import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { listTsSourcesUnder } from "./list-ts-sources"
import { loadRegistry, registryProjectRoot as root } from "./load-registry"

const BLOCK_DIR_RE = /registry\/new-york\/blocks\/([^/]+)\//
// matches: from "@/components/ui/svgs/SomeName"
const SVG_IMPORT_RE = /from\s+["']@\/components\/ui\/svgs\/([^"']+)["']/g

describe("registry svg files", () => {
  it("declares every imported svg in the block's files array in registry.json", () => {
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

      const content = readFileSync(join(root, rel), "utf8")
      const registeredPaths = new Set((block.files ?? []).map((f) => f.path))

      let m: RegExpExecArray | null
      SVG_IMPORT_RE.lastIndex = 0
      while ((m = SVG_IMPORT_RE.exec(content)) !== null) {
        const svgName = m[1]
        const expected = `components/ui/svgs/${svgName}.tsx`
        expect(
          registeredPaths.has(expected),
          `${rel}: imports svg "${svgName}" but "${expected}" is missing from files in registry.json for block "${blockName}"`,
        ).toBe(true)
      }
    }
  })
})
