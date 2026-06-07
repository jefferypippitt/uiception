import { existsSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import {
  blocksReferencingBundledMedia,
  extractReferencedMediaPaths,
  sourceReferencesMedia,
} from "./extract-block-media-paths"
import { listTsSourcesUnder } from "./list-ts-sources"
import { loadRegistry, registryProjectRoot as root } from "./load-registry"

describe("registry block media", () => {
  it("CDN-referenced media files exist on the authoring disk", () => {
    for (const blockName of blocksReferencingBundledMedia(root)) {
      for (const publicPath of extractReferencedMediaPaths(root, blockName)) {
        expect(
          existsSync(join(root, publicPath)),
          `${blockName}: missing file ${publicPath} — add it so Vercel can serve it`,
        ).toBe(true)
      }
    }
  })

  it("no block component references local /images/blocks or /videos/blocks paths", () => {
    const sources = listTsSourcesUnder(
      join(root, "registry/new-york/blocks"),
      root,
    )
    const localPathRe = /["'`]\/(images|videos)\/blocks\//
    for (const rel of sources) {
      const content = readFileSync(join(root, rel), "utf8")
      expect(
        localPathRe.test(content),
        `${rel}: use https://uiception.com/... instead of a local /(images|videos)/blocks/ path`,
      ).toBe(false)
    }
  })

  it("next/image components with CDN URLs declare unoptimized", () => {
    const sources = listTsSourcesUnder(
      join(root, "registry/new-york/blocks"),
      root,
    )
    for (const rel of sources) {
      const content = readFileSync(join(root, rel), "utf8")
      if (
        content.includes('from "next/image"') &&
        sourceReferencesMedia(content)
      ) {
        expect(
          content,
          `${rel}: next/image with a CDN src must include the unoptimized prop (no remotePatterns required for consumers)`,
        ).toContain("unoptimized")
      }
    }
  })

  it("all .gitkeep registry files are non-empty so shadcn installs them", () => {
    const { items } = loadRegistry()
    for (const item of items) {
      for (const f of item.files ?? []) {
        if (!f.path.endsWith(".gitkeep")) continue
        const abs = join(root, f.path)
        expect(existsSync(abs), `${item.name}: missing gitkeep file ${f.path}`).toBe(true)
        const size = statSync(abs).size
        expect(
          size,
          `${item.name}: ${f.path} is empty — shadcn skips empty files, add placeholder text`,
        ).toBeGreaterThan(0)
      }
    }
  })
})
