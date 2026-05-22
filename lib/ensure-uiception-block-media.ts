import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

const DEFAULT_ORIGIN = "https://uiception.com"

function mediaOrigin(): string {
  return (
    process.env.UICEPTION_MEDIA_ORIGIN ??
    process.env.UICEPTION_ORIGIN ??
    DEFAULT_ORIGIN
  ).replace(/\/$/, "")
}

function isBundledMediaTarget(target: string): boolean {
  return (
    target.startsWith("public/images/blocks/") ||
    target.startsWith("public/videos/blocks/")
  )
}

function installUrlForTarget(target: string, meta?: { installUrl?: string }): string {
  if (meta?.installUrl) return meta.installUrl
  const webPath = target.replace(/^public[/\\]/, "").replace(/\\/g, "/")
  return `${mediaOrigin()}/${webPath}`
}

type RegistryFile = {
  type?: string
  target: string
  meta?: { installUrl?: string }
}

type RegistryManifest = {
  files?: RegistryFile[]
}

async function loadManifest(blockId: string): Promise<RegistryManifest | null> {
  const url = `${mediaOrigin()}/r/${blockId}.json`
  const res = await fetch(url)
  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error(`Failed to load ${url} (${res.status})`)
  }
  return res.json() as Promise<RegistryManifest>
}

async function downloadMedia(target: string, meta?: { installUrl?: string }) {
  const cwd = process.cwd()
  const outPath = join(cwd, target)
  if (existsSync(outPath)) return

  const url = installUrlForTarget(target, meta)
  const assetRes = await fetch(url)
  if (!assetRes.ok) {
    throw new Error(`Failed to download ${url} (${assetRes.status})`)
  }

  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, Buffer.from(await assetRes.arrayBuffer()))
}

/**
 * Ensures bundled block images/videos exist under `public/` before render.
 * `shadcn add` cannot install binary `registry:file` entries (no manifest `content`).
 */
export async function ensureUiceptionBlockMedia(blockId: string): Promise<void> {
  if (process.env.UICEPTION_SKIP_MEDIA_FETCH === "1") return

  const manifest = await loadManifest(blockId)
  if (!manifest) return

  const pending = new Map<string, RegistryFile>()
  for (const file of manifest.files ?? []) {
    if (file.type !== "registry:file" || !isBundledMediaTarget(file.target)) {
      continue
    }
    pending.set(file.target, file)
  }

  await Promise.all(
    [...pending.values()].map((file) => downloadMedia(file.target, file.meta)),
  )
}
