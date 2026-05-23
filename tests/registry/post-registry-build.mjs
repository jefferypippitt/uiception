/**

 * Run after `shadcn build` (via pnpm registry:build / prebuild).

 * - Strips corrupt binary `content` from media registry:file entries

 * - Adds pending manifest JSON (text content) + uiception-media-fetch dependency

 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs"

import { join } from "node:path"



const ORIGIN = process.env.UICEPTION_ORIGIN ?? "https://uiception.com"

const MEDIA_FETCH_ITEM = `${ORIGIN}/r/uiception-media-fetch.json`

const PENDING_DIR = "lib/uiception-media/pending"

const root = process.cwd()

const outDir = join(root, "public/r")



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



function mediaFilesForItem(item) {

  return (item.files ?? []).filter(

    (file) => file.type === "registry:file" && isBundledMediaTarget(file.target),

  )

}



function ensureMediaFetchDependency(item) {

  item.registryDependencies ??= []

  if (!item.registryDependencies.includes(MEDIA_FETCH_ITEM)) {

    item.registryDependencies.push(MEDIA_FETCH_ITEM)

  }

}



function upsertPendingManifest(item, blockName, mediaFiles) {

  const pendingTarget = `${PENDING_DIR}/${blockName}.json`

  const pendingContent = JSON.stringify(

    mediaFiles.map((file) => ({

      target: file.target.replace(/\\/g, "/"),

      url: installUrlForTarget(file.target),

    })),

    null,

    2,

  )



  item.files = (item.files ?? []).filter((file) => file.target !== pendingTarget)

  item.files.push({

    path: pendingTarget,

    type: "registry:file",

    target: pendingTarget,

    content: pendingContent,

  })

}



for (const name of readdirSync(outDir)) {

  if (!name.endsWith(".json") || name === "registry.json") continue



  const filePath = join(outDir, name)

  const item = JSON.parse(readFileSync(filePath, "utf8"))

  let changed = false

  const blockName = item.name ?? name.replace(/\.json$/, "")

  const mediaFiles = mediaFilesForItem(item)



  if (mediaFiles.length > 0 && blockName !== "uiception-media-fetch") {

    upsertPendingManifest(item, blockName, mediaFiles)

    ensureMediaFetchDependency(item)

    changed = true

  }



  for (const file of mediaFiles) {

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



  if (item.docs?.includes("ensure-uiception-block-media")) {

    delete item.docs

    changed = true

  }



  if (blockName === "uiception-media-fetch") {

    const instrumentation = (item.files ?? []).find(

      (file) => file.target === "instrumentation.ts",

    )

    if (

      instrumentation?.content?.includes('"./setup-uiception-media.mjs"')

    ) {

      instrumentation.content = instrumentation.content.replace(

        '"./setup-uiception-media.mjs"',

        '"./lib/uiception-media/setup-uiception-media.mjs"',

      )

      changed = true

    }

  }



  if (changed) {

    writeFileSync(filePath, `${JSON.stringify(item, null, 2)}\n`)

  }

}


