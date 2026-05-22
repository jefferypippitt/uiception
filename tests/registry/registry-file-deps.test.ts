import { readFileSync } from "node:fs"
import { join, normalize, resolve, dirname as pathDirname, relative } from "node:path"
import { describe, expect, it } from "vitest"

import { listTsSourcesUnder } from "./list-ts-sources"
import { loadRegistry, registryProjectRoot as root } from "./load-registry"

const BLOCK_DIR_RE = /registry\/new-york\/blocks\/([^/]+)\//
const CSS_IMPORT_RE = /^import\s+["']([^"']+\.css)["']/gm

/** e.g. ../brands-section-v1/brands-section-v1.css → brands-section-v1 */
function blockNameFromCssSpecifier(specifier: string, fromFile: string): string | null {
  const match = specifier.match(/^\.\.\/([^/]+)\//)
  if (match) return match[1]
  const absResolved = normalize(resolve(pathDirname(fromFile), specifier))
  const rel = relative(root, absResolved).split("\\").join("/")
  const blockMatch = rel.match(BLOCK_DIR_RE)
  return blockMatch?.[1] ?? null
}

describe("registry file dependencies", () => {
  it("declares every imported CSS file in the block's files array", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")
    const byName = new Map(blocks.map((b) => [b.name!, b]))

    const sources = listTsSourcesUnder(
      join(root, "registry/new-york/blocks"),
      root,
    )

    for (const rel of sources) {
      const blockMatch = rel.match(BLOCK_DIR_RE)
      if (!blockMatch) continue
      const blockName = blockMatch[1]
      const block = byName.get(blockName)
      if (!block) continue

      const absFile = join(root, rel)
      const content = readFileSync(absFile, "utf8")
      const registeredPaths = new Set((block.files ?? []).map((f) => f.path))
      const deps = new Set(block.registryDependencies ?? [])

      let m: RegExpExecArray | null
      CSS_IMPORT_RE.lastIndex = 0
      while ((m = CSS_IMPORT_RE.exec(content)) !== null) {
        const specifier = m[1]
        const absResolved = normalize(resolve(pathDirname(absFile), specifier))
        const registryPathResolved = relative(root, absResolved).split("\\").join("/")

        const cssBlock = blockNameFromCssSpecifier(specifier, absFile)
        if (cssBlock && cssBlock !== blockName && deps.has(cssBlock)) {
          continue
        }

        expect(
          registeredPaths.has(registryPathResolved),
          `${rel}: imports CSS "${specifier}" but "${registryPathResolved}" is missing from files in registry.json for block "${blockName}"`,
        ).toBe(true)
      }
    }
  })
})
