import { getFreeTemplateVersions } from "@/lib/templates"

export type RegistryFileWithInstall = {
  path: string
  target?: string
  content?: string
  type?: string
  meta?: { installUrl?: string }
}

export type InstallCommand = {
  /** Full command copied to clipboard */
  command: string
  /** Short label shown in the toolbar */
  display: string
}

function isTemplateItem(blockName: string): boolean {
  return getFreeTemplateVersions().some((v) => v.id === blockName)
}

/** Returns the shadcn install command for a block or full-site template. */
export function installCommandWithMediaFetch(
  blockName: string,
  _files: RegistryFileWithInstall[] | undefined,
  origin = "https://uiception.com",
): string {
  return getInstallCommand(blockName, origin).command
}

export function getInstallCommand(
  blockName: string,
  origin = "https://uiception.com",
): InstallCommand {
  const itemUrl = `${origin}/r/${blockName}.json`

  if (isTemplateItem(blockName)) {
    // Match ui.shadcn.com/create: init scaffolds Next, then installs the registry item.
    // (create is an alias for init; the create UI copies `init --template …`.)
    return {
      command: `npx shadcn@latest init --template next -y "${itemUrl}"`,
      display: `npx shadcn init ${blockName}`,
    }
  }

  return {
    command: `npx shadcn@latest add "${itemUrl}"`,
    display: `npx shadcn add ${blockName}`,
  }
}
