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

  // Images are always served from the uiception.com CDN — binary files cannot be safely
  // embedded in registry JSON (UTF-8 round-trip corrupts them). Local registry file
  // entries for images were removed intentionally; the test that enforced them was removed.

  it("next/image used with blockImageUrl must include unoptimized prop", () => {
    // Consumers won't have uiception.com in their next.config.js image domains,
    // so any <Image> receiving a blockImageUrl() src must be unoptimized.
    const sources = listTsSourcesUnder(
      join(root, "registry/new-york/blocks"),
      root,
    )

    // Match files that import both next/image and use blockImageUrl
    for (const rel of sources) {
      const content = readFileSync(join(root, rel), "utf8")
      if (!content.includes("from \"next/image\"") && !content.includes("from 'next/image'")) continue
      if (!content.includes("blockImageUrl")) continue

      expect(
        content,
        `${rel}: uses next/image with blockImageUrl but is missing the "unoptimized" prop — consumers won't have uiception.com in their next.config.js image domains`,
      ).toMatch(/\bunoptimized\b/)
    }
  })
})
