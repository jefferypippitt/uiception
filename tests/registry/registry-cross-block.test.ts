import { readFileSync } from "node:fs"
import { join } from "node:path"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import { listTsSourcesUnder } from "./list-ts-sources"

const root = join(dirname(fileURLToPath(import.meta.url)), "../..")

const BLOCK_DIR_RE = /registry\/new-york\/blocks\/([^/]+)\//

// Matches any import that references another block's folder, e.g.:
//   from "@/registry/new-york/blocks/hero-section-v2/..."
//   from "../../hero-section-v2/..."  (relative cross-block)
const CROSS_BLOCK_ALIAS_RE = /@\/registry\/new-york\/blocks\/([^/'"]+)/g
const CROSS_BLOCK_RELATIVE_RE = /from\s+["'][^"']*registry\/new-york\/blocks\/([^/'"]+)/g

describe("registry cross-block imports", () => {
  it("does not import from another block's folder", () => {
    const sources = listTsSourcesUnder(
      join(root, "registry/new-york/blocks"),
      root,
    )

    for (const rel of sources) {
      const blockMatch = rel.match(BLOCK_DIR_RE)
      if (!blockMatch) continue
      const blockName = blockMatch[1]
      const content = readFileSync(join(root, rel), "utf8")

      // Check alias imports: @/registry/new-york/blocks/<other>/
      let m: RegExpExecArray | null
      CROSS_BLOCK_ALIAS_RE.lastIndex = 0
      while ((m = CROSS_BLOCK_ALIAS_RE.exec(content)) !== null) {
        const imported = m[1]
        expect(
          imported,
          `${rel}: cross-block import from "${imported}" — blocks must be self-contained`,
        ).toBe(blockName)
      }

      // Check relative imports that escape into another block folder
      CROSS_BLOCK_RELATIVE_RE.lastIndex = 0
      while ((m = CROSS_BLOCK_RELATIVE_RE.exec(content)) !== null) {
        const imported = m[1]
        expect(
          imported,
          `${rel}: cross-block import from "${imported}" — blocks must be self-contained`,
        ).toBe(blockName)
      }
    }
  })
})
