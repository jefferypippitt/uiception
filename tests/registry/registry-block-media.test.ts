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

  it("legacy blocks do not use same-origin /images|/videos/blocks paths", async () => {
    const { REWRITE_MEDIA_BLOCKS } = await import(
      "../../scripts/rewrite-registry-media.mjs"
    )
    const sources = listTsSourcesUnder(
      join(root, "registry/new-york/blocks"),
      root,
    )
    const localPathRe = /["'`]\/(images|videos)\/blocks\//
    for (const rel of sources) {
      const blockName = rel.match(
        /registry\/new-york\/blocks\/([^/]+)\//,
      )?.[1]
      if (blockName && REWRITE_MEDIA_BLOCKS.has(blockName)) continue

      const content = readFileSync(join(root, rel), "utf8")
      expect(
        localPathRe.test(content),
        `${rel}: use https://uiception.com/... or opt the block into REWRITE_MEDIA_BLOCKS`,
      ).toBe(false)
    }
  })

  it("next/image components with media URLs declare unoptimized", () => {
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
          `${rel}: next/image with a media src must include the unoptimized prop (no remotePatterns required for consumers)`,
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

  it("opted-in blocks ship hardcoded CDN URLs (not same-origin or mediaOrigin)", async () => {
    const { REWRITE_MEDIA_BLOCKS } = await import(
      "../../scripts/rewrite-registry-media.mjs"
    )
    const builtDir = join(root, "public/r")
    if (!existsSync(builtDir)) return

    for (const blockName of REWRITE_MEDIA_BLOCKS) {
      const builtPath = join(builtDir, `${blockName}.json`)
      if (!existsSync(builtPath)) continue
      const built = JSON.parse(readFileSync(builtPath, "utf8")) as {
        files?: { content?: string; path?: string }[]
      }
      for (const file of built.files ?? []) {
        if (typeof file.content !== "string") continue
        expect(
          file.content.includes("mediaOrigin"),
          `${blockName} (${file.path}): shipped content still has mediaOrigin — run pnpm registry:build`,
        ).toBe(false)
        expect(
          file.content.includes("NEXT_PUBLIC_BASE_URL"),
          `${blockName} (${file.path}): shipped content still has NEXT_PUBLIC_BASE_URL — run pnpm registry:build`,
        ).toBe(false)
        expect(
          /["'`]\/(images|videos)\/blocks\//.test(file.content),
          `${blockName} (${file.path}): shipped content still has same-origin media paths — run pnpm registry:build`,
        ).toBe(false)
        if (sourceReferencesMedia(file.content) || file.content.includes("uiception.com/images/blocks") || file.content.includes("uiception.com/videos/blocks")) {
          expect(
            file.content.includes("https://uiception.com/"),
            `${blockName} (${file.path}): shipped media should use https://uiception.com/...`,
          ).toBe(true)
        }
      }
    }
  })
})
