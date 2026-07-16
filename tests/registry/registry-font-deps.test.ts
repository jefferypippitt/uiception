import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import { listTsSourcesUnder } from "./list-ts-sources"

const root = join(dirname(fileURLToPath(import.meta.url)), "../..")

const BLOCK_DIR_RE = /registry\/new-york\/blocks\/([^/]+)\//

// Standard Tailwind font utilities — safe to use anywhere, no self-contained
// import needed. Everything else defined in globals.css @theme inline is
// layout-dependent and must be imported directly inside the block.
const TAILWIND_BUILTIN_FONTS = new Set(["font-sans", "font-mono", "font-serif"])

/**
 * Parse globals.css and return every Tailwind font utility that comes from
 * a layout-defined CSS variable, e.g. --font-instrument-serif → font-instrument-serif
 */
function getLayoutFontClasses(): Set<string> {
  const css = readFileSync(join(root, "app/globals.css"), "utf8")

  // Extract the @theme inline block
  const themeMatch = css.match(/@theme\s+inline\s*\{([^}]+)\}/)
  if (!themeMatch) return new Set()

  const classes = new Set<string>()
  const varRe = /--font-([\w-]+)\s*:/g
  let m: RegExpExecArray | null
  while ((m = varRe.exec(themeMatch[1])) !== null) {
    const cls = `font-${m[1]}`
    if (TAILWIND_BUILTIN_FONTS.has(cls)) continue
    classes.add(cls)
  }
  return classes
}

// Detects a self-contained font import: next/font/google, next/font/local,
// or a package-based font (e.g. geist/font/pixel) — any of these satisfy
// the "this block owns its font, doesn't rely on the host site's globals.css" rule.
const NEXT_FONT_IMPORT_RE = /from\s+["'](next\/font\/(google|local)|geist\/font\/pixel)["']/

describe("registry font dependencies", () => {
  it("does not use layout-only font classes — import next/font directly in the block instead", () => {
    const layoutFonts = getLayoutFontClasses()
    if (layoutFonts.size === 0) return

    const layoutFontRe = new RegExp(`\\b(${[...layoutFonts].join("|")})\\b`)

    const sources = listTsSourcesUnder(
      join(root, "registry/new-york/blocks"),
      root,
    )

    // Group files by block
    const blockFiles = new Map<string, string[]>()
    for (const rel of sources) {
      const m = rel.match(BLOCK_DIR_RE)
      if (!m) continue
      if (!blockFiles.has(m[1])) blockFiles.set(m[1], [])
      blockFiles.get(m[1])!.push(rel)
    }

    for (const [blockName, files] of blockFiles) {
      const hasSelfContainedImport = files.some((rel) =>
        NEXT_FONT_IMPORT_RE.test(readFileSync(join(root, rel), "utf8")),
      )

      for (const rel of files) {
        const content = readFileSync(join(root, rel), "utf8")
        const match = layoutFontRe.exec(content)
        if (!match) continue

        expect(
          hasSelfContainedImport,
          `${rel}: uses layout-only font class "${match[1]}" — ` +
          `import the font from next/font/google or next/font/local directly ` +
          `in the block and apply via .className instead`,
        ).toBe(true)
      }
    }
  })
})
