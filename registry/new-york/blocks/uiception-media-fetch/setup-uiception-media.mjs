import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { pathToFileURL } from "node:url"

import { ensureUiceptionBlockMedia } from "./fetch-uiception-media.mjs"

const MARKER = "uiception-media-fetch"
const FETCH_IMPORT =
  'import { ensureUiceptionBlockMedia } from "./lib/uiception-media/fetch-uiception-media.mjs"'
const FETCH_CALL = "await ensureUiceptionBlockMedia()"
const PREBUILD_CMD = "node lib/uiception-media/fetch-uiception-media.mjs"

export async function setupUiceptionMedia(cwd = process.cwd()) {
  patchNextConfig(cwd)
  patchPackageScripts(cwd)
  await ensureUiceptionBlockMedia(cwd)
}

function patchNextConfig(cwd) {
  const configPath = join(cwd, "next.config.mjs")
  if (!existsSync(configPath)) {
    writeFileSync(
      configPath,
      `${FETCH_IMPORT}\n\n${FETCH_CALL} // ${MARKER}\n\n/** @type {import('next').NextConfig} */\nconst nextConfig = {}\n\nexport default nextConfig\n`,
    )
    return
  }

  const content = readFileSync(configPath, "utf8")
  if (content.includes("ensureUiceptionBlockMedia") || content.includes(MARKER)) {
    return
  }

  writeFileSync(
    configPath,
    `${FETCH_IMPORT}\n\n${FETCH_CALL} // ${MARKER}\n\n${content}`,
  )
}

function patchPackageScripts(cwd) {
  const pkgPath = join(cwd, "package.json")
  if (!existsSync(pkgPath)) return

  const pkg = JSON.parse(readFileSync(pkgPath, "utf8").replace(/^\uFEFF/, ""))
  pkg.scripts ??= {}

  if (pkg.scripts.prebuild?.includes("fetch-uiception-media")) return

  const prev = pkg.scripts.prebuild
  pkg.scripts.prebuild = prev ? `${PREBUILD_CMD} && ${prev}` : PREBUILD_CMD
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href

if (isMain) {
  await setupUiceptionMedia()
}
