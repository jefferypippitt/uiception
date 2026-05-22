import { describe, expect, it } from "vitest"

import { loadRegistry } from "./load-registry"

/** Paths that are shared across blocks — not installed under app/<block>/ */
function isSharedFile(path: string): boolean {
  return (
    path.startsWith("lib/") ||
    path.startsWith("components/ui/svgs/") ||
    path.startsWith("public/images/") ||
    path.startsWith("public/videos/") ||
    path.startsWith("components/ui/")
  )
}

function expectedSharedTarget(path: string): string {
  if (path.startsWith("components/ui/")) {
    return `@ui/${path.slice("components/ui/".length)}`
  }
  if (path.startsWith("lib/")) {
    return `@lib/${path.slice("lib/".length)}`
  }
  if (path.startsWith("hooks/")) {
    return `@hooks/${path.slice("hooks/".length)}`
  }
  return path
}

describe("registry target paths", () => {
  it("block-owned files target under app/<block-name>/", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    for (const block of blocks) {
      const name = block.name!
      const blockPrefix = `registry/new-york/blocks/${name}/`

      for (const f of block.files ?? []) {
        if (!f.path.startsWith(blockPrefix)) continue
        if (isSharedFile(f.path)) continue

        expect(
          f.target.startsWith(`app/${name}/`),
          `${name}: file "${f.path}" has target "${f.target}" — expected it to start with "app/${name}/"`,
        ).toBe(true)
      }
    }
  })

  it("shared files use @ui/@lib/@hooks targets (public media keeps literal path)", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    for (const block of blocks) {
      for (const f of block.files ?? []) {
        if (!isSharedFile(f.path)) continue
        expect(
          f.target,
          `${block.name}: shared file "${f.path}" target should use registry alias`,
        ).toBe(expectedSharedTarget(f.path))
      }
    }
  })
})
