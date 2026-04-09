import { readFileSync } from "node:fs"
import { join, normalize, resolve, dirname as pathDirname, relative } from "node:path"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import { listTsSourcesUnder } from "./list-ts-sources"

const root = join(dirname(fileURLToPath(import.meta.url)), "../..")
const registryPath = join(root, "registry.json")

type RegistryFile = { path: string }
type RegistryItem = { name?: string; type?: string; files?: RegistryFile[] }

function loadRegistry(): { items: RegistryItem[] } {
  return JSON.parse(readFileSync(registryPath, "utf8")) as { items: RegistryItem[] }
}

const BLOCK_DIR_RE = /registry\/new-york\/blocks\/([^/]+)\//
// Side-effect CSS imports: import "./styles/foo.css" or import "../styles/foo.css"
const CSS_IMPORT_RE = /^import\s+["']([^"']+\.css)["']/gm

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

      let m: RegExpExecArray | null
      CSS_IMPORT_RE.lastIndex = 0
      while ((m = CSS_IMPORT_RE.exec(content)) !== null) {
        const specifier = m[1]
        // resolve relative to the source file, then make it root-relative
        const absResolved = normalize(resolve(pathDirname(absFile), specifier))
        const registryPath = relative(root, absResolved).split("\\").join("/")

        expect(
          registeredPaths.has(registryPath),
          `${rel}: imports CSS "${specifier}" but "${registryPath}" is missing from files in registry.json for block "${blockName}"`,
        ).toBe(true)
      }
    }
  })

  it("declares lib/block-image-url.ts in files when blockImageUrl is imported", () => {
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
      if (!content.includes("@/lib/block-image-url")) continue

      const registeredPaths = new Set((block.files ?? []).map((f) => f.path))
      expect(
        registeredPaths.has("lib/block-image-url.ts"),
        `${rel}: imports block-image-url but "lib/block-image-url.ts" is missing from files in registry.json for block "${blockName}"`,
      ).toBe(true)
    }
  })
})
