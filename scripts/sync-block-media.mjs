#!/usr/bin/env node
/**
 * Download bundled block images/videos from uiception.com after `shadcn add`.
 * The shadcn CLI cannot write binary registry:file content correctly (UTF-8 corruption).
 *
 * Usage (from your Next.js app root):
 *   node path/to/sync-block-media.mjs hero-section-v8
 *   node path/to/sync-block-media.mjs macbook-pro-with-video macbook-pro-with-image
 *   node path/to/sync-block-media.mjs --all
 *   node path/to/sync-block-media.mjs --all C:\projects\uiception-test
 */
import { mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

const origin = (process.env.UICEPTION_ORIGIN ?? "https://uiception.com").replace(
  /\/$/,
  "",
)

const args = process.argv.slice(2)
let cwd = process.cwd()
let blocks = []

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--cwd" && args[i + 1]) {
    cwd = args[++i]
    continue
  }
  blocks.push(args[i])
}

if (blocks.length === 1 && blocks[0] === "--all") {
  const appDir = join(cwd, "app")
  blocks = readdirSync(appDir).filter((name) => {
    try {
      return statSync(join(appDir, name)).isDirectory()
    } catch {
      return false
    }
  })
}

if (blocks.length === 0) {
  console.error(
    "Usage: node sync-block-media.mjs <block-id> [more-blocks...]\n" +
      "       node sync-block-media.mjs --all [--cwd <project-root>]",
  )
  process.exit(1)
}

function installUrlForTarget(target) {
  const webPath = target.replace(/^public[/\\]/, "").replace(/\\/g, "/")
  return `${origin}/${webPath}`
}

function isBundledMediaTarget(target) {
  return (
    target.startsWith("public/images/blocks/") ||
    target.startsWith("public/videos/blocks/")
  )
}

/** @param {string} block */
async function loadManifest(block) {
  const manifestUrl = `${origin}/r/${block}.json`
  const res = await fetch(manifestUrl)
  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error(`Failed to load ${manifestUrl} (${res.status})`)
  }
  return res.json()
}

/** @param {{ target: string, meta?: { installUrl?: string } }} file */
async function downloadMedia(file) {
  const url = file.meta?.installUrl ?? installUrlForTarget(file.target)
  const outPath = join(cwd, file.target)

  const assetRes = await fetch(url)
  if (!assetRes.ok) {
    throw new Error(`Failed to download ${url} (${assetRes.status})`)
  }

  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, Buffer.from(await assetRes.arrayBuffer()))
  console.log(`Wrote ${file.target}`)
}

/** Deduplicate by target path (e.g. shared screen-demo.mp4). */
const pending = new Map()

for (const block of blocks) {
  const manifest = await loadManifest(block)
  if (!manifest) continue

  for (const file of manifest.files ?? []) {
    if (file.type !== "registry:file" || !isBundledMediaTarget(file.target)) {
      continue
    }
    pending.set(file.target, file)
  }
}

if (pending.size === 0) {
  console.log("No bundled media to download for the given block(s).")
  process.exit(0)
}

let failed = false
for (const file of pending.values()) {
  try {
    await downloadMedia(file)
  } catch (err) {
    console.error(err instanceof Error ? err.message : err)
    failed = true
  }
}

process.exit(failed ? 1 : 0)
