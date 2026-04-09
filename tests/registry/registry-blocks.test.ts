import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const root = join(dirname(fileURLToPath(import.meta.url)), "../..")
const registryPath = join(root, "registry.json")

type RegistryFile = {
  path: string
  type: string
  target: string
}

type RegistryItem = {
  name?: string
  type?: string
  title?: string
  files?: RegistryFile[]
}

function loadRegistry(): { items: RegistryItem[] } {
  const raw = readFileSync(registryPath, "utf8")
  return JSON.parse(raw) as { items: RegistryItem[] }
}

describe("registry.json blocks", () => {
  it("has valid registry:block entries with files and paths on disk", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    expect(blocks.length).toBeGreaterThan(0)

    for (const block of blocks) {
      expect(block.name, "block name").toBeTruthy()
      expect(block.title, `title for ${block.name}`).toBeTruthy()
      expect(block.files?.length, `files for ${block.name}`).toBeGreaterThan(0)

      for (const f of block.files ?? []) {
        expect(f.path, `path key for ${block.name}`).toBeTruthy()
        expect(f.target, `target key for ${block.name} / ${f.path}`).toBeTruthy()
        expect(f.type, `type for ${block.name} / ${f.path}`).toMatch(/^registry:/)

        const abs = join(root, f.path)
        expect(existsSync(abs), `source file exists: ${f.path}`).toBe(true)
      }
    }
  })

  it("does not duplicate targets within the same block", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    for (const block of blocks) {
      const targets = (block.files ?? []).map((f) => f.target)
      const unique = new Set(targets)
      expect(unique.size, `duplicate targets in ${block.name}`).toBe(targets.length)
    }
  })
})
