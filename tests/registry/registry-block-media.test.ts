import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { listTsSourcesUnder } from "./list-ts-sources"
import {
  loadRegistry,
  registryProjectRoot as root,
  type RegistryItem,
} from "./load-registry"

function mediaTargetsForBlock(
  block: RegistryItem,
  kind: "images" | "videos",
): string[] {
  const prefix =
    kind === "images"
      ? `public/images/blocks/${block.name}/`
      : `public/videos/blocks/${block.name}/`
  return (block.files ?? [])
    .map((f) => f.target)
    .filter((t) => t.startsWith(prefix))
}

const BLOCK_IMAGE_PATH_RE = /[`'"]\/images\/blocks\//
const BLOCK_VIDEO_PATH_RE = /[`'"]\/videos\/blocks\//

function blocksReferencingMedia(pathRe: RegExp): string[] {
  const sources = listTsSourcesUnder(join(root, "registry/new-york/blocks"), root)
  const blocks = new Set<string>()
  for (const rel of sources) {
    const content = readFileSync(join(root, rel), "utf8")
    if (!pathRe.test(content)) continue
    const match = rel.match(/registry\/new-york\/blocks\/([^/]+)\//)
    if (match) blocks.add(match[1])
  }
  return [...blocks]
}

function registryFileTargets(block: RegistryItem): string[] {
  return (block.files ?? []).map((f) => f.target)
}

describe("registry block media", () => {
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

  it("ships public videos only under public/videos/blocks/<block>/", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    for (const block of blocks) {
      const name = block.name
      expect(name).toBeTruthy()
      for (const f of block.files ?? []) {
        if (!f.target.startsWith("public/videos/")) continue
        expect(
          f.target,
          `${name}: video target must be under public/videos/blocks/`,
        ).toMatch(/^public\/videos\/blocks\//)
      }
    }
  })

  it("declares bundled images for blocks that reference /images/blocks/", () => {
    const { items } = loadRegistry()
    const byName = new Map(
      items.filter((i) => i.type === "registry:block").map((i) => [i.name, i]),
    )

    for (const blockName of blocksReferencingMedia(BLOCK_IMAGE_PATH_RE)) {
      const block = byName.get(blockName)
      expect(block, `registry block ${blockName}`).toBeTruthy()

      const imageTargets = mediaTargetsForBlock(block!, "images")
      const hasImageInFiles = registryFileTargets(block!).some((t) =>
        t.startsWith("public/images/blocks/"),
      )
      expect(
        imageTargets.length > 0 || hasImageInFiles,
        `${blockName}: add images to registry.json under public/images/blocks/${blockName}/`,
      ).toBe(true)
    }
  })

  it("declares bundled video for blocks that reference /videos/blocks/", () => {
    const { items } = loadRegistry()
    const byName = new Map(
      items.filter((i) => i.type === "registry:block").map((i) => [i.name, i]),
    )

    for (const blockName of blocksReferencingMedia(BLOCK_VIDEO_PATH_RE)) {
      const block = byName.get(blockName)
      expect(block, `registry block ${blockName}`).toBeTruthy()

      const hasVideoInFiles = registryFileTargets(block!).some((t) =>
        t.startsWith("public/videos/blocks/"),
      )
      expect(
        hasVideoInFiles,
        `${blockName}: add video to registry.json (registry:file under public/videos/blocks/...)`,
      ).toBe(true)
    }
  })

  it("lists every registry-declared image on disk under public/images/blocks/", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    for (const block of blocks) {
      for (const target of mediaTargetsForBlock(block, "images")) {
        const abs = join(root, target)
        expect(
          readFileSync(abs).byteLength,
          `missing or empty: ${target}`,
        ).toBeGreaterThan(0)
      }
    }
  })

  it("lists every registry-declared video on disk under public/videos/blocks/", () => {
    const { items } = loadRegistry()
    const blocks = items.filter((i) => i.type === "registry:block")

    for (const block of blocks) {
      for (const target of registryFileTargets(block)) {
        if (!target.startsWith("public/videos/blocks/")) continue
        const abs = join(root, target)
        expect(
          readFileSync(abs).byteLength,
          `missing or empty: ${target}`,
        ).toBeGreaterThan(0)
      }
    }
  })
})
