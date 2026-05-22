/** Extensions we never syntax-highlight in the block code viewer. */
const BINARY_EXTS = new Set([
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "ico",
  "avif",
  "bmp",
  "tiff",
  "mp4",
  "webm",
  "mov",
  "m4v",
  "ogv",
  "mp3",
  "wav",
  "ogg",
  "woff",
  "woff2",
  "ttf",
  "eot",
])

const BUNDLED_MEDIA_PREFIXES = [
  "public/images/blocks/",
  "public/videos/blocks/",
] as const

/** Avoid feeding megabytes into Shiki if a built manifest still embeds binary. */
const MAX_HIGHLIGHT_CHARS = 256_000

export function isBinaryFile(path: string): boolean {
  const ext = path.split(".").pop()?.toLowerCase() ?? ""
  return BINARY_EXTS.has(ext)
}

export function isBundledMediaTarget(target: string): boolean {
  return BUNDLED_MEDIA_PREFIXES.some((prefix) => target.startsWith(prefix))
}

export function shouldStripRegistryFileContent(
  path: string,
  content: string | undefined,
  meta?: { installUrl?: string }
): boolean {
  if (meta?.installUrl) return true
  if (isBinaryFile(path) || isBundledMediaTarget(path)) return true
  if (content !== undefined && content.length > MAX_HIGHLIGHT_CHARS) return true
  return false
}

export function binaryPlaceholder(path: string): string {
  const name = path.split("/").pop() ?? path
  const ext = path.split(".").pop()?.toLowerCase() ?? ""
  const isVideo = ["mp4", "webm", "mov", "m4v", "ogv"].includes(ext)

  if (isVideo) {
    return [
      `// ${name}`,
      "//",
      "// Bundled video — not shown here (binary).",
      "// After `shadcn add`, run sync-block-media.mjs for this block to download it.",
      "// Or place your own file at the same path under public/videos/blocks/...",
    ].join("\n")
  }

  return [
    `// ${name}`,
    "//",
    "// This image asset is included when you install the block.",
    "// Replace it with your own file at the same path.",
  ].join("\n")
}

export function codeViewContentForRegistryFile(
  path: string,
  content: string | undefined,
  meta?: { installUrl?: string }
): string {
  if (shouldStripRegistryFileContent(path, content, meta)) {
    return binaryPlaceholder(path)
  }
  return content ?? ""
}
