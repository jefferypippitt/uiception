/**
 * Chrome Origin Trial token(s) for html-in-canvas.
 *
 * Same pattern as canvasui.dev (NEXT_PUBLIC_HTML_IN_CANVAS_OT_TOKEN).
 * Comma-separate multiple tokens (e.g. production + localhost).
 * Register: https://developer.chrome.com/origintrials
 */
export function getHtmlInCanvasOriginTrialTokens(): string[] {
  const raw =
    process.env.NEXT_PUBLIC_HTML_IN_CANVAS_OT_TOKEN?.trim() ||
    // legacy alias from earlier setup
    process.env.HTML_IN_CANVAS_ORIGIN_TRIAL?.trim() ||
    ""

  if (!raw) return []

  return raw
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean)
}
