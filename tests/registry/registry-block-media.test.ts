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
  type RegistryItem,
} from "./load-registry"

function loadBuiltBlockManifest(blockName: string): RegistryItem | null {
  const manifestPath = join(root, "public/r", `${blockName}.json`)
  if (!existsSync(manifestPath)) return null
  return JSON.parse(readFileSync(manifestPath, "utf8")) as RegistryItem
}

type PendingEntry = { target: string; url: string }

/** Parse the pending manifest embedded in a built registry item. */
function pendingEntriesForBlock(manifest: RegistryItem): PendingEntry[] {
  const pendingFile = (manifest.files ?? []).find(
    (f) =>
      f.type === "registry:file" &&
      f.target?.startsWith("lib/uiception-media/manifests/") &&
      typeof f.content === "string",
  )
  if (!pendingFile?.content) return []
  return JSON.parse(pendingFile.content) as PendingEntry[]
}

describe("registry block media", () => {
  it("every block referencing bundled media has a media-manifest.json source file", () => {
    for (const blockName of blocksReferencingBundledMedia(root)) {
      const pendingSourcePath = join(
        root,
        "registry/new-york/blocks",
        blockName,
        "media-manifest.json",
      )
      expect(
        existsSync(pendingSourcePath),
        `${blockName}: create registry/new-york/blocks/${blockName}/media-manifest.json`,
      ).toBe(true)
    }
  })

  it("media-manifest.json source files list every path referenced in block sources", () => {
    for (const blockName of blocksReferencingBundledMedia(root)) {
      const pendingSourcePath = join(
        root,
        "registry/new-york/blocks",
        blockName,
        "media-manifest.json",
      )
      if (!existsSync(pendingSourcePath)) continue

      const entries = JSON.parse(
        readFileSync(pendingSourcePath, "utf8"),
      ) as PendingEntry[]
      const declaredTargets = new Set(entries.map((e) => e.target))

      for (const publicPath of extractReferencedMediaPaths(root, blockName)) {
        expect(
          declaredTargets.has(publicPath),
          `${blockName}: media-manifest.json is missing { target: "${publicPath}" }`,
        ).toBe(true)
      }
    }
  })

  it("media-manifest.json entries have correct urls and referenced files exist on disk", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    for (const block of blocks) {
      const pendingSourcePath = join(
        root,
        "registry/new-york/blocks",
        block.name!,
        "media-manifest.json",
      )
      if (!existsSync(pendingSourcePath)) continue

      const entries = JSON.parse(
        readFileSync(pendingSourcePath, "utf8"),
      ) as PendingEntry[]

      for (const entry of entries) {
        // Binary asset must exist on the authoring disk
        const abs = join(root, entry.target)
        expect(
          existsSync(abs),
          `${block.name}: missing binary file ${entry.target}`,
        ).toBe(true)

        // URL must be the public-facing URL for that asset
        const expectedUrl = `https://uiception.com/${entry.target.replace(/^public\//, "")}`
        expect(
          entry.url,
          `${block.name}: wrong url for ${entry.target}`,
        ).toBe(expectedUrl)
      }
    }
  })

  it("built public/r manifests embed the pending manifest with correct entries", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    for (const block of blocks) {
      const pendingSourcePath = join(
        root,
        "registry/new-york/blocks",
        block.name!,
        "media-manifest.json",
      )
      if (!existsSync(pendingSourcePath)) continue

      const sourceEntries = JSON.parse(
        readFileSync(pendingSourcePath, "utf8"),
      ) as PendingEntry[]

      const blockName = block.name!
      const manifest = loadBuiltBlockManifest(blockName)
      expect(
        manifest,
        `${blockName}: run pnpm registry:build â€” missing public/r/${blockName}.json`,
      ).toBeTruthy()

      const builtEntries = pendingEntriesForBlock(manifest!)
      expect(
        builtEntries.length,
        `${blockName}: built manifest pending entry count mismatch`,
      ).toBe(sourceEntries.length)

      for (const src of sourceEntries) {
        const built = builtEntries.find((e) => e.target === src.target)
        expect(
          built,
          `${blockName}: built manifest missing pending entry for ${src.target}`,
        ).toBeTruthy()
        expect(built!.url).toBe(src.url)
      }

      // No binary stubs â€” there should be no file entries targeting public/images/ or public/videos/
      const binaryStubs = (manifest!.files ?? []).filter(
        (f) =>
          f.target?.startsWith("public/images/blocks/") ||
          f.target?.startsWith("public/videos/blocks/"),
      )
      expect(
        binaryStubs,
        `${blockName}: remove binary file stubs from registry.json â€” use media-manifest.json instead`,
      ).toHaveLength(0)
    }
  })
})

