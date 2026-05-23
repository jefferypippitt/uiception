export type RegistryFileWithInstall = {
  path: string
  target?: string
  content?: string
  type?: string
  meta?: { installUrl?: string }
}

const PENDING_PREFIX = "lib/uiception-media/pending/"

/** Media entries stripped for the built manifest — shadcn add skips these without content. */
export function mediaFilesNeedingInstallFetch(
  files: RegistryFileWithInstall[] | undefined,
): RegistryFileWithInstall[] {
  return (files ?? []).filter(
    (file) =>
      file.type === "registry:file" &&
      file.target &&
      (file.target.startsWith("public/images/blocks/") ||
        file.target.startsWith("public/videos/blocks/")) &&
      file.content === undefined &&
      typeof file.meta?.installUrl === "string" &&
      file.meta.installUrl.length > 0,
  )
}

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

/** shadcn add only — media downloads on next dev/build via instrumentation. */
export function installCommandWithMediaFetch(
  blockName: string,
  _files: RegistryFileWithInstall[] | undefined,
  origin = "https://uiception.com",
): string {
  return `npx shadcn@latest add "${origin}/r/${blockName}.json"`
}
