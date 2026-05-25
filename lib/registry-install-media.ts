export type RegistryFileWithInstall = {
  path: string
  target?: string
  content?: string
  type?: string
  meta?: { installUrl?: string }
}

/** Returns the shadcn add command for a block. */
export function installCommandWithMediaFetch(
  blockName: string,
  _files: RegistryFileWithInstall[] | undefined,
  origin = "https://uiception.com",
): string {
  return `npx shadcn@latest add "${origin}/r/${blockName}.json"`
}
