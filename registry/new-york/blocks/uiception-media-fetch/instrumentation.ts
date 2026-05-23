import { join } from "node:path"
import { pathToFileURL } from "node:url"

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return

  const { setupUiceptionMedia } = await import(
    pathToFileURL(
      join(process.cwd(), "lib/uiception-media/setup-uiception-media.mjs"),
    ).href
  )

  await setupUiceptionMedia()
}
