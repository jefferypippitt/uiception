import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import { listTsSourcesUnder } from "./list-ts-sources"

const root = join(dirname(fileURLToPath(import.meta.url)), "../..")

const BLOCK_DIR_RE = /registry\/new-york\/blocks\/([^/]+)\//

const FONT_SANS_UTILITY_RE = /\bfont-sans\b/

const SELF_CONTAINED_SANS_IMPORT_RE =
  /from\s+["']geist\/font\/sans["']|from\s+["']next\/font\/(google|local)["']/

describe("registry host font-sans", () => {
  it("blocks that use Tailwind font-sans import a self-contained sans font in the same block", () => {
    const sources = listTsSourcesUnder(
      join(root, "registry/new-york/blocks"),
      root,
    )

    const blockFiles = new Map<string, string[]>()
    for (const rel of sources) {
      const m = rel.match(BLOCK_DIR_RE)
      if (!m) continue
      if (!blockFiles.has(m[1])) blockFiles.set(m[1], [])
      blockFiles.get(m[1])!.push(rel)
    }

    for (const [blockName, files] of blockFiles) {
      const usesFontSans = files.some((rel) =>
        FONT_SANS_UTILITY_RE.test(readFileSync(join(root, rel), "utf8")),
      )
      if (!usesFontSans) continue

      const hasSelfContainedSans = files.some((rel) =>
        SELF_CONTAINED_SANS_IMPORT_RE.test(readFileSync(join(root, rel), "utf8")),
      )

      expect(
        hasSelfContainedSans,
        `Block "${blockName}" uses Tailwind class "font-sans" but no self-contained sans import ` +
          `(geist/font/sans or next/font/google|local) in any file under that block. ` +
          `Installs will inherit the consumer app's sans (often Inter). ` +
          `Import GeistSans and apply GeistSans.className, or use next/font for your chosen sans.`,
      ).toBe(true)
    }
  })
})
