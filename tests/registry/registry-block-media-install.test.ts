import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import {
  blocksReferencingBundledMedia,
  extractReferencedMediaPaths,
  type PublicMediaPath,
} from "./extract-block-media-paths"

const root = join(dirname(fileURLToPath(import.meta.url)), "../..")
const registryPath = join(root, "registry.json")

type RegistryFile = {
  path: string
  target: string
  type: string
  content?: string
}
type RegistryItem = { name?: string; type?: string; files?: RegistryFile[] }

function loadRegistry(): { items: RegistryItem[] } {
  return JSON.parse(readFileSync(registryPath, "utf8")) as { items: RegistryItem[] }
}

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

describe("registry block media install bundle", () => {
  it("declares every referenced image/video in the installing block's registry.json files", () => {
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
          `${blockName}: add registry:file for ${publicPath} so shadcn add installs the asset`,
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

  it("does not omit referenced media when a block uses filename helpers", () => {
    const { items } = loadRegistry()
    const byName = new Map(
      items.filter((i) => i.type === "registry:block").map((i) => [i.name!, i]),
    )

    const helperBlocks = [
      "testimonials-section-v1",
      "testimonials-section-v2",
      "feature-section-v4",
    ] as const

    for (const blockName of helperBlocks) {
      const referenced = extractReferencedMediaPaths(root, blockName)
      expect(
        referenced.length,
        `${blockName}: expected helper-resolved media paths`,
      ).toBeGreaterThan(0)

      const declaredTargets = new Set(
        mediaFilesForBlock(byName.get(blockName)!).map((f) => f.target),
      )

      for (const publicPath of referenced) {
        expect(
          declaredTargets.has(publicPath),
          `${blockName}: missing registry:file for helper-resolved ${publicPath}`,
        ).toBe(true)
      }
    }
  })

  it("bundles shared video in every block that references it", () => {
    const { items } = loadRegistry()
    const byName = new Map(
      items.filter((i) => i.type === "registry:block").map((i) => [i.name!, i]),
    )

    const sharedVideo =
      "public/videos/blocks/macbook-pro-with-video/screen-demo.mp4" as PublicMediaPath

    for (const blockName of ["macbook-pro-with-video", "google-chrome-windows-with-video"]) {
      const referenced = extractReferencedMediaPaths(root, blockName)
      expect(referenced, `${blockName} should reference shared demo video`).toContain(
        sharedVideo,
      )

      const block = byName.get(blockName)!
      const targets = new Set(mediaFilesForBlock(block).map((f) => f.target))
      expect(
        targets.has(sharedVideo),
        `${blockName}: must declare shared video in registry.json for install`,
      ).toBe(true)
    }
  })

  it("ships every registry-declared media file in public/r/<block>.json", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    for (const block of blocks) {
      const media = mediaFilesForBlock(block)
      if (media.length === 0) continue

      const manifest = loadBuiltBlockManifest(block.name!)
      expect(
        manifest,
        `${block.name}: run pnpm registry:build — missing public/r/${block.name}.json`,
      ).toBeTruthy()

      const manifestTargets = new Map(
        (manifest!.files ?? []).map((f) => [f.target, f] as const),
      )

      for (const file of media) {
        const built = manifestTargets.get(file.target)
        expect(
          built,
          `${block.name}: public/r/${block.name}.json missing ${file.target} — run pnpm registry:build`,
        ).toBeTruthy()
        expect(
          built!.type,
          `${block.name}: ${file.target} must be registry:file in built manifest`,
        ).toBe("registry:file")
        expect(
          built!.path,
          `${block.name}: built manifest path must match ${file.target}`,
        ).toBe(file.target)
      }
    }
  })

  it("embeds non-empty content for every media file in public/r/<block>.json", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    for (const block of blocks) {
      const media = mediaFilesForBlock(block)
      if (media.length === 0) continue

      const manifest = loadBuiltBlockManifest(block.name!)
      expect(manifest, `${block.name}: missing built manifest`).toBeTruthy()

      const manifestByTarget = new Map(
        (manifest!.files ?? []).map((f) => [f.target, f] as const),
      )

      for (const file of media) {
        const built = manifestByTarget.get(file.target)!
        expect(
          typeof built.content === "string" && built.content.length > 0,
          `${block.name}: ${file.target} must ship embedded content in public/r/${block.name}.json so shadcn add writes the file without a CDN fetch`,
        ).toBe(true)
      }
    }
  })

  it("matches referenced media count between source, registry.json, and built manifest", () => {
    const { items } = loadRegistry()
    const byName = new Map(
      items.filter((i) => i.type === "registry:block").map((i) => [i.name!, i]),
    )

    for (const blockName of blocksReferencingBundledMedia(root)) {
      const referenced = new Set(extractReferencedMediaPaths(root, blockName))
      const block = byName.get(blockName)!

      const declaredForReferenced = mediaFilesForBlock(block)
        .map((f) => f.target)
        .filter((t) => referenced.has(t as PublicMediaPath))

      expect(
        declaredForReferenced.length,
        `${blockName}: registry.json must declare all ${referenced.size} referenced media paths (found ${declaredForReferenced.length})`,
      ).toBe(referenced.size)

      const manifest = loadBuiltBlockManifest(blockName)
      expect(manifest, `${blockName}: missing public/r/${blockName}.json`).toBeTruthy()

      const builtForReferenced = (manifest!.files ?? [])
        .map((f) => f.target)
        .filter((t) => referenced.has(t as PublicMediaPath))

      expect(
        builtForReferenced.length,
        `${blockName}: built manifest must include all ${referenced.size} referenced media paths (found ${builtForReferenced.length}) — run pnpm registry:build`,
      ).toBe(referenced.size)
    }
  })
})
