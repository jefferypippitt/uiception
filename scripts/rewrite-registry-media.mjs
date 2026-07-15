/**
 * Post-process `public/r/*.json` after `shadcn build`.
 *
 * Authoring source (opted-in blocks) uses same-origin paths:
 *   `/images/blocks/<id>/file.jpg`
 * so local `next dev` and the deployed site both load from `public/`.
 *
 * Shipped registry payloads rewrite those to absolute CDN URLs so consumers
 * get working media with zero setup — no env, no mediaOrigin.
 *
 * Also strips legacy `mediaOrigin` + `NEXT_PUBLIC_BASE_URL` if present.
 *
 * Rollout is opt-in via REWRITE_MEDIA_BLOCKS.
 */

import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const CDN_ORIGIN = "https://uiception.com"

/** Registry item names that get media paths rewritten for consumers. */
export const REWRITE_MEDIA_BLOCKS = new Set(["gallery-section-v3"])

/** @param {string} content */
export function rewriteBlockMediaForConsumers(content) {
  let out = content
  const before = out

  // Same-origin authoring paths → absolute CDN
  // `/images/blocks/foo/${filename}` → `https://uiception.com/images/blocks/foo/${filename}`
  // "/images/blocks/foo/bar.jpg" → "https://uiception.com/images/blocks/foo/bar.jpg"
  out = out.replace(
    /([`'"])\/((?:images|videos)\/blocks\/)/g,
    `$1${CDN_ORIGIN}/$2`,
  )

  // Legacy mediaOrigin → CDN
  if (out.includes("mediaOrigin")) {
    out = out.replace(
      /`\$\{mediaOrigin\}\/([^`${}]+)`/g,
      (_match, path) => `"${CDN_ORIGIN}/${path}"`,
    )
    out = out.replace(/\$\{mediaOrigin\}\//g, `${CDN_ORIGIN}/`)
    out = out.replace(
      /^const mediaOrigin = process\.env\.NEXT_PUBLIC_BASE_URL \?\? (?:""|"https:\/\/uiception\.com")\r?\n/gm,
      "",
    )
    out = out.replace(/\n{3,}/g, "\n\n")
  }

  return out === before ? content : out
}

/** @deprecated Use rewriteBlockMediaForConsumers */
export const rewriteMediaOriginForConsumers = rewriteBlockMediaForConsumers

/** @param {string} outputDir */
export function rewriteRegistryMediaInDir(outputDir) {
  let rewritten = 0

  for (const blockName of REWRITE_MEDIA_BLOCKS) {
    const abs = join(outputDir, `${blockName}.json`)
    let raw
    try {
      raw = readFileSync(abs, "utf8")
    } catch {
      console.warn(`rewrite-registry-media: skip missing ${blockName}.json`)
      continue
    }

    let item
    try {
      item = JSON.parse(raw)
    } catch {
      console.warn(`rewrite-registry-media: skip invalid JSON ${blockName}.json`)
      continue
    }

    if (!Array.isArray(item.files)) continue

    let changed = false
    for (const file of item.files) {
      if (typeof file.content !== "string") continue
      const next = rewriteBlockMediaForConsumers(file.content)
      if (next !== file.content) {
        file.content = next
        changed = true
      }
    }

    if (changed) {
      writeFileSync(abs, `${JSON.stringify(item, null, 2)}\n`, "utf8")
      rewritten += 1
    }
  }

  return rewritten
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith("rewrite-registry-media.mjs") ||
    process.argv[1].includes("rewrite-registry-media"))

if (isMain) {
  const outputDir = join(process.cwd(), "public", "r")
  const count = rewriteRegistryMediaInDir(outputDir)
  console.log(
    `rewrite-registry-media: updated ${count} registry item(s) in ${outputDir}`,
  )
}
