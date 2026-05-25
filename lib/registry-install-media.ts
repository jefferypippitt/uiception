export type RegistryFileWithInstall = {
  path: string
  target?: string
  content?: string
  type?: string
  meta?: { installUrl?: string }
}

const PENDING_PREFIX = "lib/uiception-media/manifests/"

/**
 * Files that carry a pending download manifest — written to the user's project
 * by shadcn add and consumed by the uiception-media-fetch instrumentation on
 * next dev/build to download the actual binary assets.
 */
export function pendingManifestFiles(
  files: RegistryFileWithInstall[] | undefined,
): RegistryFileWithInstall[] {
  return (files ?? []).filter(
    (file) =>
      file.type === "registry:file" &&
      file.target?.startsWith(PENDING_PREFIX) &&
      typeof file.content === "string" &&
      file.content.length > 0,
  )
}

/** Returns the shadcn add command for a block. */
export function installCommandWithMediaFetch(
  blockName: string,
  _files: RegistryFileWithInstall[] | undefined,
  origin = "https://uiception.com",
): string {
  return `npx shadcn@latest add "${origin}/r/${blockName}.json"`
}
