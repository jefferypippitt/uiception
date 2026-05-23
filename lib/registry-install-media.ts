export type RegistryFileWithInstall = {
  path: string
  target?: string
  content?: string
  type?: string
  meta?: { installUrl?: string }
}

/** Media entries stripped for the built manifest — shadcn add skips these without a follow-up fetch. */
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

/** One shell line per asset (curl is available on macOS, Linux, and modern Windows). */
export function curlInstallLines(
  files: RegistryFileWithInstall[] | undefined,
): string[] {
  return mediaFilesNeedingInstallFetch(files).map(
    (file) =>
      `curl -fsSL -o "${file.target!.replace(/\\/g, "/")}" "${file.meta!.installUrl}"`,
  )
}

export function installCommandWithMediaFetch(
  blockName: string,
  files: RegistryFileWithInstall[] | undefined,
  origin = "https://uiception.com",
): string {
  const shadcn = `npx shadcn@latest add "${origin}/r/${blockName}.json"`
  const curls = curlInstallLines(files ?? [])
  if (curls.length === 0) return shadcn
  return [shadcn, ...curls].join(" && ")
}
