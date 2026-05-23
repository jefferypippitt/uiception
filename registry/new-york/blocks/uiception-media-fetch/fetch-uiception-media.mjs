import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs"
import { dirname, join } from "node:path"
import { pathToFileURL } from "node:url"

/**
 * Downloads bundled uiception block media listed in lib/uiception-media/pending/*.json.
 * Runs from instrumentation (next dev/start) and next.config (next build).
 */
export async function ensureUiceptionBlockMedia(cwd = process.cwd()) {
  const pendingDir = join(cwd, "lib/uiception-media/pending")
  if (!existsSync(pendingDir)) return

  let downloaded = 0

  for (const name of readdirSync(pendingDir)) {
    if (!name.endsWith(".json")) continue

    const entries = readJsonFile(join(pendingDir, name))
    if (!Array.isArray(entries)) continue

    for (const entry of entries) {
      if (typeof entry?.target !== "string" || typeof entry?.url !== "string") {
        continue
      }
      if (await downloadFile(cwd, entry.target, entry.url)) {
        downloaded++
      }
    }
  }

  if (downloaded > 0) {
    console.log(
      `[uiception] fetched ${downloaded} media file${downloaded === 1 ? "" : "s"}`,
    )
  }
}

function readJsonFile(filePath) {
  const raw = readFileSync(filePath, "utf8").replace(/^\uFEFF/, "")
  return JSON.parse(raw)
}

async function downloadFile(cwd, target, url) {
  const dest = join(cwd, target.replace(/\\/g, "/"))
  if (existsSync(dest)) return false

  mkdirSync(dirname(dest), { recursive: true })

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
  }

  writeFileSync(dest, Buffer.from(await response.arrayBuffer()))
  return true
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href

if (isMain) {
  await ensureUiceptionBlockMedia()
}
