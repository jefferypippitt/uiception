/**
 * Use CDN image URLs on the hosted uiception.com app; use shipped `/public` assets for registry installs.
 * Set `NEXT_PUBLIC_UICEPTION_IMAGES=cdn` in production for uiception.com only.
 */
export function blockImageUrl(remote: string, local: string): string {
  return process.env.NEXT_PUBLIC_UICEPTION_IMAGES === "cdn" ? remote : local
}
