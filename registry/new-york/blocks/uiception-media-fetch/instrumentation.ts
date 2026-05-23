import { setupUiceptionMedia } from "./setup-uiception-media.mjs"

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return

  await setupUiceptionMedia()
}
