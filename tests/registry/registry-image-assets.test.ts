import { readFileSync } from "node:fs"
import { join } from "node:path"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

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

})
