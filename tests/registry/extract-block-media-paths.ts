import { readFileSync } from "node:fs"
import { join } from "node:path"

import { listTsSourcesUnder } from "./list-ts-sources"

/** CDN URL, e.g. https://uiception.com/images/blocks/hero-section-v1/hero-section-v1-bg.png */
export type MediaCdnUrl = `https://uiception.com/${"images" | "videos"}/blocks/${string}`

/** Install path under public/, e.g. public/images/blocks/hero-section-v1/hero-section-v1-bg.png */
export type PublicMediaPath = `public/${string}`

const BLOCK_DIR_RE = /registry\/new-york\/blocks\/([^/]+)\//

/**
 * Matches a helper function that checks the consumer's own filesystem for a
 * local override before falling back to the CDN, e.g.:
 *   const blockImage = (filename: string) => {
 *     const relPath = `images/blocks/gallery-section-v3/${filename}`
 *     ...
 *   }
 *
 * Groups: 1 = fn name, 2 = "images"|"videos", 3 = block folder
 */
const AUTO_FALLBACK_HELPER_RE =
  /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?const\s+relPath\s*=\s*`(images|videos)\/blocks\/([^`/\n]+)\/\$\{[^}]+\}`[\s\S]*?\n\}/g

// ─── Has-media detection ───────────────────────────────────────────────────────

/** Returns true if the source file references any block media. */
export function sourceReferencesMedia(content: string): boolean {
  AUTO_FALLBACK_HELPER_RE.lastIndex = 0
  return AUTO_FALLBACK_HELPER_RE.test(content)
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

  AUTO_FALLBACK_HELPER_RE.lastIndex = 0
  while ((m = AUTO_FALLBACK_HELPER_RE.exec(content)) !== null) {
    helpers.set(m[1], { kind: m[2] as "images" | "videos", folder: m[3] })
  }

  return helpers
}

function extractFromSource(
  content: string,
  helpers: Map<string, { kind: "images" | "videos"; folder: string }>,
  out: Set<PublicMediaPath>,
): void {
  let m: RegExpExecArray | null

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

/** Blocks whose TS/TSX sources reference block media. */
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
