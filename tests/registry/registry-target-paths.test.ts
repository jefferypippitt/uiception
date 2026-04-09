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

/** Paths that are shared across blocks — their targets mirror their path, not app/<block>/ */
function isSharedFile(path: string): boolean {
  return (
    path.startsWith("lib/") ||
    path.startsWith("components/ui/svgs/") ||
    path.startsWith("public/images/") ||
    path.startsWith("components/ui/")
  )
}

describe("registry target paths", () => {
  it("block-owned files target under app/<block-name>/", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    for (const block of blocks) {
      const name = block.name!
      const blockPrefix = `registry/new-york/blocks/${name}/`

      for (const f of block.files ?? []) {
        // Only check files that live inside this block's own folder
        if (!f.path.startsWith(blockPrefix)) continue
        // Shared files are excluded
        if (isSharedFile(f.path)) continue

        expect(
          f.target.startsWith(`app/${name}/`),
          `${name}: file "${f.path}" has target "${f.target}" — expected it to start with "app/${name}/"`,
        ).toBe(true)
      }
    }
  })

  it("shared files (svgs, lib, public) have target matching their path", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    for (const block of blocks) {
      for (const f of block.files ?? []) {
        if (!isSharedFile(f.path)) continue
        expect(
          f.target,
          `${block.name}: shared file "${f.path}" target should equal its path`,
        ).toBe(f.path)
      }
    }
  })
})
