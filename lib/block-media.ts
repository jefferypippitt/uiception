import { existsSync } from "node:fs"
import { extname, join } from "node:path"

const CDN_ORIGIN = "https://uiception.com"

/** Most-used web image formats, in popularity order for alternate lookup. */
export const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
  ".svg",
] as const

/** Most-used web video formats, in popularity order for alternate lookup. */
export const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v"] as const

function basenameWithoutExt(filename: string): string {
  const ext = extname(filename)
  return ext ? filename.slice(0, -ext.length) : filename
}

/**
 * Finds a local file matching the canonical slot name. Exact filename wins;
 * otherwise tries the same basename with each allowed extension in order.
 */
export function resolveLocalMediaFilename(
  dir: string,
  canonicalFilename: string,
  allowedExtensions: readonly string[],
): string | null {
  const exactPath = join(dir, canonicalFilename)
  if (existsSync(exactPath)) return canonicalFilename

  const base = basenameWithoutExt(canonicalFilename)
  for (const ext of allowedExtensions) {
    const candidate = `${base}${ext}`
    if (candidate !== canonicalFilename && existsSync(join(dir, candidate))) {
      return candidate
    }
  }

  return null
}

function resolveBlockMediaUrl(
  kind: "images" | "videos",
  blockId: string,
  filename: string,
  allowedExtensions: readonly string[],
  origin: string,
): string {
  const dir = join(process.cwd(), "public", kind, "blocks", blockId)
  const resolved = resolveLocalMediaFilename(dir, filename, allowedExtensions)
  const relPath = `${kind}/blocks/${blockId}/${resolved ?? filename}`
  return resolved ? `/${relPath}` : `${origin}/${relPath}`
}

export function createBlockImage(blockId: string, origin = CDN_ORIGIN) {
  return (filename: string) =>
    resolveBlockMediaUrl("images", blockId, filename, IMAGE_EXTENSIONS, origin)
}

export function createBlockVideo(blockId: string, origin = CDN_ORIGIN) {
  return (filename: string) =>
    resolveBlockMediaUrl("videos", blockId, filename, VIDEO_EXTENSIONS, origin)
}
