import { readFileSync } from "node:fs"
import { join } from "node:path"

import { listTsSourcesUnder } from "./list-ts-sources"

/** CDN URL, e.g. https://uiception.com/images/blocks/hero-section-v1/hero-section-v1-bg.png */
export type MediaCdnUrl = `https://uiception.com/${"images" | "videos"}/blocks/${string}`

/** Install path under public/, e.g. public/images/blocks/hero-section-v1/hero-section-v1-bg.png */
export type PublicMediaPath = `public/${string}`

const BLOCK_DIR_RE = /registry\/new-york\/blocks\/([^/]+)\//

// ─── mediaOrigin pattern (current standard) ───────────────────────────────────

/**
 * Matches a single-file constant using the mediaOrigin helper, e.g.:
 *   const HERO_BG = `${mediaOrigin}/images/blocks/hero-section-v1/hero-section-v1-bg.png`
 *
 * Groups: 1 = "images"|"videos", 2 = block folder, 3 = filename
 */
const MEDIAORIGIN_LITERAL_RE =
  /\$\{mediaOrigin\}\/(images|videos)\/blocks\/([^`/\n${}]+)\/([^`\n${}]+)/g

/**
 * Matches an image helper function using the mediaOrigin helper, e.g.:
 *   const blockImage = (filename: string) => `${mediaOrigin}/images/blocks/block-id/${filename}`
 *
 * Groups: 1 = fn name, 2 = block folder
 */
const MEDIAORIGIN_IMAGE_HELPER_RE =
  /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*`\$\{mediaOrigin\}\/images\/blocks\/([^`/\n]+)\/\$\{[^}]+\}`/g

/**
 * Matches a video helper function using the mediaOrigin helper, e.g.:
 *   const blockVideo = (filename: string) => `${mediaOrigin}/videos/blocks/block-id/${filename}`
 *
 * Groups: 1 = fn name, 2 = block folder
 */
const MEDIAORIGIN_VIDEO_HELPER_RE =
  /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*`\$\{mediaOrigin\}\/videos\/blocks\/([^`/\n]+)\/\$\{[^}]+\}`/g

// ─── Legacy: hardcoded https://uiception.com (kept for backward compat) ────────

/** Matches a literal hardcoded CDN URL (old pattern — should not appear in new blocks). */
const LITERAL_MEDIA_RE =
  /["'`]https:\/\/uiception\.com\/(images|videos)\/blocks\/([^"'`${}\n]+)["'`]/g

const LEGACY_IMAGE_HELPER_RE =
  /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*[`'"]https:\/\/uiception\.com\/images\/blocks\/([^/`'"]+)\/\$\{filename\}[`'"]/g

const LEGACY_VIDEO_HELPER_RE =
  /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*[`'"]https:\/\/uiception\.com\/videos\/blocks\/([^/`'"]+)\/\$\{filename\}[`'"]/g

// ─── Same-origin authoring (rewritten to CDN on registry:build) ───────────────

/**
 * Matches a single-file same-origin path, e.g.:
 *   const HERO = "/images/blocks/gallery-section-v3/image-1.jpg"
 */
const RELATIVE_LITERAL_RE =
  /["'`]\/(images|videos)\/blocks\/([^"'`${}\n]+)["'`]/g

const RELATIVE_IMAGE_HELPER_RE =
  /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*`\/images\/blocks\/([^`/\n]+)\/\$\{[^}]+\}`/g

const RELATIVE_VIDEO_HELPER_RE =
  /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*`\/videos\/blocks\/([^`/\n]+)\/\$\{[^}]+\}`/g

// ─── Has-media detection ───────────────────────────────────────────────────────

/** Returns true if the source file references any block media (either pattern). */
export function sourceReferencesMedia(content: string): boolean {
  MEDIAORIGIN_LITERAL_RE.lastIndex = 0
  MEDIAORIGIN_IMAGE_HELPER_RE.lastIndex = 0
  MEDIAORIGIN_VIDEO_HELPER_RE.lastIndex = 0
  LITERAL_MEDIA_RE.lastIndex = 0
  LEGACY_IMAGE_HELPER_RE.lastIndex = 0
  LEGACY_VIDEO_HELPER_RE.lastIndex = 0
  RELATIVE_LITERAL_RE.lastIndex = 0
  RELATIVE_IMAGE_HELPER_RE.lastIndex = 0
  RELATIVE_VIDEO_HELPER_RE.lastIndex = 0

  return (
    MEDIAORIGIN_LITERAL_RE.test(content) ||
    MEDIAORIGIN_IMAGE_HELPER_RE.test(content) ||
    MEDIAORIGIN_VIDEO_HELPER_RE.test(content) ||
    LITERAL_MEDIA_RE.test(content) ||
    LEGACY_IMAGE_HELPER_RE.test(content) ||
    LEGACY_VIDEO_HELPER_RE.test(content) ||
    RELATIVE_LITERAL_RE.test(content) ||
    RELATIVE_IMAGE_HELPER_RE.test(content) ||
    RELATIVE_VIDEO_HELPER_RE.test(content)
  )
}

// ─── Helper call resolution ────────────────────────────────────────────────────

function helperCallRe(fnName: string): RegExp {
  return new RegExp(`\\b${fnName}\\s*\\(\\s*["']([^"']+)["']\\s*\\)`, "g")
}

function collectHelpers(
  content: string,
): Map<string, { kind: "images" | "videos"; folder: string }> {
  const helpers = new Map<string, { kind: "images" | "videos"; folder: string }>()
  let m: RegExpExecArray | null

  // mediaOrigin helpers (current standard)
  MEDIAORIGIN_IMAGE_HELPER_RE.lastIndex = 0
  while ((m = MEDIAORIGIN_IMAGE_HELPER_RE.exec(content)) !== null) {
    helpers.set(m[1], { kind: "images", folder: m[2] })
  }

  MEDIAORIGIN_VIDEO_HELPER_RE.lastIndex = 0
  while ((m = MEDIAORIGIN_VIDEO_HELPER_RE.exec(content)) !== null) {
    helpers.set(m[1], { kind: "videos", folder: m[2] })
  }

  // Legacy hardcoded helpers
  LEGACY_IMAGE_HELPER_RE.lastIndex = 0
  while ((m = LEGACY_IMAGE_HELPER_RE.exec(content)) !== null) {
    helpers.set(m[1], { kind: "images", folder: m[2] })
  }

  LEGACY_VIDEO_HELPER_RE.lastIndex = 0
  while ((m = LEGACY_VIDEO_HELPER_RE.exec(content)) !== null) {
    helpers.set(m[1], { kind: "videos", folder: m[2] })
  }

  // Same-origin authoring helpers
  RELATIVE_IMAGE_HELPER_RE.lastIndex = 0
  while ((m = RELATIVE_IMAGE_HELPER_RE.exec(content)) !== null) {
    helpers.set(m[1], { kind: "images", folder: m[2] })
  }

  RELATIVE_VIDEO_HELPER_RE.lastIndex = 0
  while ((m = RELATIVE_VIDEO_HELPER_RE.exec(content)) !== null) {
    helpers.set(m[1], { kind: "videos", folder: m[2] })
  }

  return helpers
}

function extractFromSource(
  content: string,
  helpers: Map<string, { kind: "images" | "videos"; folder: string }>,
  out: Set<PublicMediaPath>,
): void {
  let m: RegExpExecArray | null

  // mediaOrigin single-file literals
  MEDIAORIGIN_LITERAL_RE.lastIndex = 0
  while ((m = MEDIAORIGIN_LITERAL_RE.exec(content)) !== null) {
    out.add(`public/${m[1]}/blocks/${m[2]}/${m[3]}` as PublicMediaPath)
  }

  // Legacy literal CDN URLs
  LITERAL_MEDIA_RE.lastIndex = 0
  while ((m = LITERAL_MEDIA_RE.exec(content)) !== null) {
    out.add(`public/${m[1]}/blocks/${m[2]}` as PublicMediaPath)
  }

  // Same-origin literals
  RELATIVE_LITERAL_RE.lastIndex = 0
  while ((m = RELATIVE_LITERAL_RE.exec(content)) !== null) {
    out.add(`public/${m[1]}/blocks/${m[2]}` as PublicMediaPath)
  }

  // Helper call sites: fn("filename.ext")
  for (const [fnName, { kind, folder }] of helpers) {
    const callRe = helperCallRe(fnName)
    callRe.lastIndex = 0
    while ((m = callRe.exec(content)) !== null) {
      out.add(`public/${kind}/blocks/${folder}/${m[1]}` as PublicMediaPath)
    }
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** All public/* media paths referenced by a block's TS/TSX sources. */
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

/** Blocks whose TS/TSX sources reference block media (either mediaOrigin or legacy CDN pattern). */
export function blocksReferencingBundledMedia(root: string): string[] {
  const blocksDir = join(root, "registry/new-york/blocks")
  const sources = listTsSourcesUnder(blocksDir, root)
  const blocks = new Set<string>()

  for (const rel of sources) {
    const content = readFileSync(join(root, rel), "utf8")
    if (sourceReferencesMedia(content)) {
      const match = rel.match(BLOCK_DIR_RE)
      if (match) blocks.add(match[1])
    }
  }

  return [...blocks].sort()
}
