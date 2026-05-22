/**
 * shadcn build embeds binary files as UTF-8 strings, which corrupts PNG/MP4 bytes.
 * Strip embedded content from media registry:file entries and attach installUrl so
 * consumers can run scripts/sync-block-media.mjs after `shadcn add`.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const ORIGIN = process.env.UICEPTION_ORIGIN ?? "https://uiception.com"
const root = process.cwd()
const outDir = join(root, "public/r")

/** Next.js serves `public/foo` at `/foo`. */
function installUrlForTarget(target) {
  const webPath = target.replace(/^public[/\\]/, "").replace(/\\/g, "/")
  return `${ORIGIN}/${webPath}`
}

function isBundledMediaTarget(target) {
  return (
    target.startsWith("public/images/blocks/") ||
    target.startsWith("public/videos/blocks/")
  )
}

for (const name of readdirSync(outDir)) {
  if (!name.endsWith(".json") || name === "registry.json") continue

  const filePath = join(outDir, name)
  const item = JSON.parse(readFileSync(filePath, "utf8"))
  let changed = false

  for (const file of item.files ?? []) {
    if (file.type !== "registry:file" || !isBundledMediaTarget(file.target)) {
      continue
    }

    const installUrl = installUrlForTarget(file.target)

    if (file.content !== undefined) {
      delete file.content
      changed = true
    }

    const meta = { ...(file.meta ?? {}), installUrl }
    if (JSON.stringify(meta) !== JSON.stringify(file.meta ?? {})) {
      file.meta = meta
      changed = true
    }
  }

  if (changed) {
    writeFileSync(filePath, `${JSON.stringify(item, null, 2)}\n`)
  }
}
