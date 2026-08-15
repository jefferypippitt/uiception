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
export const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v", ".mkv"] as const

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

function resolveCollectionMediaUrl(
  kind: "images" | "videos",
  collection: "blocks" | "templates",
  id: string,
  filename: string,
  allowedExtensions: readonly string[],
  origin: string,
): string {
  const dir = join(process.cwd(), "public", kind, collection, id)
  const resolved = resolveLocalMediaFilename(dir, filename, allowedExtensions)
  const relPath = `${kind}/${collection}/${id}/${resolved ?? filename}`
  return resolved ? `/${relPath}` : `${origin}/${relPath}`
}

export function createBlockImage(blockId: string, origin = CDN_ORIGIN) {
  return (filename: string) =>
    resolveCollectionMediaUrl(
      "images",
      "blocks",
      blockId,
      filename,
      IMAGE_EXTENSIONS,
      origin,
    )
}

export function createBlockVideo(blockId: string, origin = CDN_ORIGIN) {
  return (filename: string) =>
    resolveCollectionMediaUrl(
      "videos",
      "blocks",
      blockId,
      filename,
      VIDEO_EXTENSIONS,
      origin,
    )
}

export function createTemplateImage(templateId: string, origin = CDN_ORIGIN) {
  return (filename: string) =>
    resolveCollectionMediaUrl(
      "images",
      "templates",
      templateId,
      filename,
      IMAGE_EXTENSIONS,
      origin,
    )
}

export function createTemplateVideo(templateId: string, origin = CDN_ORIGIN) {
  return (filename: string) =>
    resolveCollectionMediaUrl(
      "videos",
      "templates",
      templateId,
      filename,
      VIDEO_EXTENSIONS,
      origin,
    )
}
