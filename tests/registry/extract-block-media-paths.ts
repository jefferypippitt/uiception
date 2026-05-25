import { readFileSync } from "node:fs"
import { join } from "node:path"

import { listTsSourcesUnder } from "./list-ts-sources"

/** CDN URL, e.g. https://uiception.com/images/blocks/hero-section-v1/hero-section-v1-bg.png */
export type MediaCdnUrl = `https://uiception.com/${"images" | "videos"}/blocks/${string}`

/** Install path under public/, e.g. public/images/blocks/hero-section-v1/hero-section-v1-bg.png */
export type PublicMediaPath = `public/${string}`

const BLOCK_DIR_RE = /registry\/new-york\/blocks\/([^/]+)\//

/** Resolved CDN URLs only — excludes helper templates containing ${...}. */
const LITERAL_MEDIA_RE =
  /["'`]https:\/\/uiception\.com\/(images|videos)\/blocks\/([^"'`\${}\n]+)["'`]/g

const IMAGE_HELPER_RE =
  /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*[`'"]https:\/\/uiception\.com\/images\/blocks\/([^/`'"]+)\/\$\{filename\}[`'"]/g

const VIDEO_HELPER_RE =
  /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*[`'"]https:\/\/uiception\.com\/videos\/blocks\/([^/`'"]+)\/\$\{filename\}[`'"]/g

function helperCallRe(fnName: string): RegExp {
  return new RegExp(`\\b${fnName}\\s*\\(\\s*["']([^"']+)["']\\s*\\)`, "g")
}

function extractFromSource(
  content: string,
  helpers: Map<string, { kind: "images" | "videos"; folder: string }>,
  out: Set<PublicMediaPath>,
): void {
  let m: RegExpExecArray | null

  LITERAL_MEDIA_RE.lastIndex = 0
  while ((m = LITERAL_MEDIA_RE.exec(content)) !== null) {
    out.add(`public/${m[1]}/blocks/${m[2]}` as PublicMediaPath)
  }

  for (const [fnName, { kind, folder }] of helpers) {
    const callRe = helperCallRe(fnName)
    callRe.lastIndex = 0
    while ((m = callRe.exec(content)) !== null) {
      out.add(`public/${kind}/blocks/${folder}/${m[1]}` as PublicMediaPath)
    }
  }
}

function collectHelpers(content: string): Map<string, { kind: "images" | "videos"; folder: string }> {
  const helpers = new Map<string, { kind: "images" | "videos"; folder: string }>()
  let m: RegExpExecArray | null

  IMAGE_HELPER_RE.lastIndex = 0
  while ((m = IMAGE_HELPER_RE.exec(content)) !== null) {
    helpers.set(m[1], { kind: "images", folder: m[2] })
  }

  VIDEO_HELPER_RE.lastIndex = 0
  while ((m = VIDEO_HELPER_RE.exec(content)) !== null) {
    helpers.set(m[1], { kind: "videos", folder: m[2] })
  }

  return helpers
}

/** All public/* media paths referenced by a block's TS/TSX sources (derived from CDN URLs). */
export function extractReferencedMediaPaths(
  root: string,
  blockName: string,
): PublicMediaPath[] {
  const blockDir = join(root, "registry/new-york/blocks", blockName)
  const sources = listTsSourcesUnder(blockDir, root).filter((rel) =>
    BLOCK_DIR_RE.test(rel),
  )

  const helpers = new Map<string, { kind: "images" | "videos"; folder: string }>()
  const contents: string[] = []

  for (const rel of sources) {
    const content = readFileSync(join(root, rel), "utf8")
    contents.push(content)
    for (const [name, meta] of collectHelpers(content)) {
      helpers.set(name, meta)
    }
  }

  const paths = new Set<PublicMediaPath>()
  for (const content of contents) {
    extractFromSource(content, helpers, paths)
  }

  return [...paths].sort()
}

/** Blocks whose TS/TSX sources reference CDN media URLs (https://uiception.com/images|videos/blocks/...). */
export function blocksReferencingBundledMedia(root: string): string[] {
  const blocksDir = join(root, "registry/new-york/blocks")
  const sources = listTsSourcesUnder(blocksDir, root)
  const blocks = new Set<string>()

  for (const rel of sources) {
    const content = readFileSync(join(root, rel), "utf8")
    LITERAL_MEDIA_RE.lastIndex = 0
    IMAGE_HELPER_RE.lastIndex = 0
    VIDEO_HELPER_RE.lastIndex = 0
    if (
      LITERAL_MEDIA_RE.test(content) ||
      IMAGE_HELPER_RE.test(content) ||
      VIDEO_HELPER_RE.test(content)
    ) {
      const match = rel.match(BLOCK_DIR_RE)
      if (match) blocks.add(match[1])
    }
  }

  return [...blocks].sort()
}
