import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import {
  blocksReferencingBundledMedia,
  extractReferencedMediaPaths,
} from "./extract-block-media-paths"
import {
  loadRegistry,
  registryProjectRoot as root,
  type RegistryFile,
  type RegistryItem,
} from "./load-registry"

const INSTALL_ORIGIN = "https://uiception.com"

function loadBuiltBlockManifest(blockName: string): RegistryItem | null {
  const manifestPath = join(root, "public/r", `${blockName}.json`)
  if (!existsSync(manifestPath)) return null
  return JSON.parse(readFileSync(manifestPath, "utf8")) as RegistryItem
}

function mediaFilesForBlock(block: RegistryItem): RegistryFile[] {
  return (block.files ?? []).filter(
    (f) =>
      f.type === "registry:file" &&
      (f.target.startsWith("public/images/blocks/") ||
        f.target.startsWith("public/videos/blocks/")),
  )
}

describe("registry block media", () => {
  it("declares every referenced bundled media in registry.json", () => {
    const { items } = loadRegistry()
    const byName = new Map(
      items.filter((i) => i.type === "registry:block").map((i) => [i.name!, i]),
    )

    for (const blockName of blocksReferencingBundledMedia(root)) {
      const block = byName.get(blockName)
      expect(block, `missing registry:block ${blockName}`).toBeTruthy()

      const declared = new Map(
        mediaFilesForBlock(block!).map((f) => [f.target, f] as const),
      )

      for (const publicPath of extractReferencedMediaPaths(root, blockName)) {
        const entry = declared.get(publicPath)
        expect(
          entry,
          `${blockName}: add registry:file for ${publicPath}`,
        ).toBeTruthy()
        expect(
          entry!.path,
          `${blockName}: path must match target for ${publicPath}`,
        ).toBe(publicPath)
        expect(
          entry!.type,
          `${blockName}: ${publicPath} must use type registry:file`,
        ).toBe("registry:file")
      }
    }
  })

  it("enforces media path conventions in registry.json", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    for (const block of blocks) {
      const name = block.name
      expect(name).toBeTruthy()
      for (const f of block.files ?? []) {
        if (f.target.startsWith("public/images/")) {
          expect(
            f.target,
            `${name}: image target must be under blocks/${name}`,
          ).toMatch(new RegExp(`^public/images/blocks/${name}/`))
        }
        if (f.target.startsWith("public/videos/")) {
          expect(
            f.target,
            `${name}: video target must be under public/videos/blocks/`,
          ).toMatch(/^public\/videos\/blocks\//)
        }
      }
    }
  })

  it("declared media files exist on disk in the authoring repo", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    for (const block of blocks) {
      for (const file of mediaFilesForBlock(block)) {
        const abs = join(root, file.target)
        expect(
          readFileSync(abs).byteLength,
          `missing or empty: ${file.target}`,
        ).toBeGreaterThan(0)
      }
    }
  })

  it("built public/r manifests are ready for consumer install", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    for (const block of blocks) {
      const media = mediaFilesForBlock(block)
      if (media.length === 0) continue

      const blockName = block.name!
      const manifest = loadBuiltBlockManifest(blockName)
      expect(
        manifest,
        `${blockName}: run pnpm registry:build — missing public/r/${blockName}.json`,
      ).toBeTruthy()

      const manifestByTarget = new Map(
        (manifest!.files ?? []).map((f) => [f.target, f] as const),
      )

      for (const file of media) {
        const built = manifestByTarget.get(file.target)
        expect(
          built,
          `${blockName}: public/r/${blockName}.json missing ${file.target}`,
        ).toBeTruthy()
        expect(
          built!.type,
          `${blockName}: ${file.target} must be registry:file in built manifest`,
        ).toBe("registry:file")
        expect(
          built!.path,
          `${blockName}: built manifest path must match ${file.target}`,
        ).toBe(file.target)
        expect(
          built!.content,
          `${blockName}: ${file.target} must not embed binary as UTF-8 — run pnpm registry:build`,
        ).toBeUndefined()
        expect(
          (built!.meta as { installUrl?: string } | undefined)?.installUrl,
          `${blockName}: ${file.target} needs meta.installUrl`,
        ).toBe(`${INSTALL_ORIGIN}/${file.target.replace(/^public\//, "")}`)
      }
    }
  })
})
