export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return

  const { setupUiceptionMedia } = await import("./setup-uiception-media.mjs")
  await setupUiceptionMedia()
}
