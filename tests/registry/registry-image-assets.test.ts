import { readFileSync } from "node:fs"
import { join } from "node:path"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import { listTsSourcesUnder } from "./list-ts-sources"

const root = join(dirname(fileURLToPath(import.meta.url)), "../..")
const registryPath = join(root, "registry.json")

type RegistryFile = { path: string; target: string; type: string }
type RegistryItem = { name?: string; type?: string; files?: RegistryFile[] }

function loadRegistry(): { items: RegistryItem[] } {
  return JSON.parse(readFileSync(registryPath, "utf8")) as { items: RegistryItem[] }
}

const REMOTE_IMAGE_RE = /https:\/\/uiception\.com\/images\/([^"'?#\s]+)/g
const BLOCK_DIR_RE = /registry\/new-york\/blocks\/([^/]+)\//

describe("registry image assets", () => {
  it("ships public images only under public/images/blocks/<block>/", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    for (const block of blocks) {
      const name = block.name
      expect(name).toBeTruthy()
      for (const f of block.files ?? []) {
        if (!f.target.startsWith("public/images/")) continue
        expect(
          f.target,
          `${name}: image target must be under blocks/${name}`,
        ).toMatch(new RegExp(`^public/images/blocks/${name}/`))
      }
    }
  })

  it("maps every uiception.com/images reference in block sources to a registry file for that block", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")
    const byName = new Map(blocks.map((b) => [b.name!, b]))

    const sources = listTsSourcesUnder(
      join(root, "registry/new-york/blocks"),
      root,
    )

    for (const rel of sources) {
      const content = readFileSync(join(root, rel), "utf8")
      const blockMatch = rel.match(BLOCK_DIR_RE)
      if (!blockMatch) continue
      const blockName = blockMatch[1]
      const block = byName.get(blockName)
      expect(block, `registry block for ${blockName}`).toBeTruthy()

      const targets = new Set((block!.files ?? []).map((f) => f.target))
      let m: RegExpExecArray | null
      REMOTE_IMAGE_RE.lastIndex = 0
      while ((m = REMOTE_IMAGE_RE.exec(content)) !== null) {
        const filename = m[1]
        const expected = `public/images/${filename}`
        expect(
          targets.has(expected),
          `${rel}: remote image ${filename} must be listed as ${expected} in registry.json for block ${blockName}`,
        ).toBe(true)
      }
    }
  })

  it("blockImageUrl local paths point at public files for that block", () => {
    const sources = listTsSourcesUnder(
      join(root, "registry/new-york/blocks"),
      root,
    )

    const localInCall = /blockImageUrl\(\s*["']https:\/\/uiception\.com\/images\/[^"']+["']\s*,\s*["'](\/images\/blocks\/[^"']+)["']/g

    for (const rel of sources) {
      const content = readFileSync(join(root, rel), "utf8")
      const blockMatch = rel.match(BLOCK_DIR_RE)
      if (!blockMatch) continue
      const blockName = blockMatch[1]

      let m: RegExpExecArray | null
      localInCall.lastIndex = 0
      while ((m = localInCall.exec(content)) !== null) {
        const webPath = m[1]
        expect(
          webPath.startsWith(`/images/blocks/${blockName}/`),
          `${rel}: local path ${webPath} must be under /images/blocks/${blockName}/`,
        ).toBe(true)

        const relPublic = webPath.replace(/^\//, "public/").replace(/\//g, "/")
        const abs = join(root, ...relPublic.split("/"))
        expect(
          readFileSync(abs),
          `missing public asset for ${webPath} (expected ${relPublic})`,
        ).toBeDefined()
      }
    }
  })
})
