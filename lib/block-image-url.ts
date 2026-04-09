/**
 * Returns the CDN image URL. Images are always served from uiception.com —
 * binary assets can't be safely embedded in registry JSON, so local copies are not used.
 */
export function blockImageUrl(remote: string): string {
  return remote
}
