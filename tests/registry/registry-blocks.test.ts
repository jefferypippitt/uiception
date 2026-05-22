import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { loadRegistry, registryProjectRoot as root } from "./load-registry"

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

  it("declares every file in the block folder in registry.json", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    function walk(dir: string, results: string[] = []): string[] {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name)
        if (entry.isDirectory()) walk(full, results)
        else results.push(full.replace(/\\/g, "/"))
      }
      return results
    }

    for (const block of blocks) {
      const blockDir = join(root, "registry/new-york/blocks", block.name!)
      if (!existsSync(blockDir)) continue

      const declared = new Set(
        (block.files ?? []).map((f) => join(root, f.path).replace(/\\/g, "/")),
      )

      for (const file of walk(blockDir)) {
        expect(
          declared.has(file),
          `${block.name}: file on disk not declared in registry.json — add it to the files array: ${file.replace(root.replace(/\\/g, "/") + "/", "")}`,
        ).toBe(true)
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
