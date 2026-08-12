import { promises as fs } from "fs"
import path from "path"
import { cache } from "react"

import {
  codeViewContentForRegistryFile,
  shouldStripRegistryFileContent,
} from "@/lib/registry-code-view"
import { getInstallCommand } from "@/lib/registry-install-media"
import {
  getShikiLangFromPath,
  SHIKI_THEME_VERCEL_DARK,
  SHIKI_THEME_VERCEL_LIGHT,
  withVercelDocsHighlighter,
} from "@/lib/shiki-vercel-docs-highlighter"

export type HighlightedRegistryFile = {
  path: string
  content: string
  htmlLight: string
  htmlDark: string
}

export type BlockRegistryData = {
  files: HighlightedRegistryFile[]
  installCommand: string
  installCommandDisplay: string
}

type RawFile = {
  path: string
  target?: string
  content?: string
  type?: string
  meta?: { installUrl?: string }
}

export const getBlockRegistryData = cache(
  async (versionId: string): Promise<BlockRegistryData | null> => {
    try {
      const jsonPath = path.join(process.cwd(), "public", "r", `${versionId}.json`)
      const raw = JSON.parse(await fs.readFile(jsonPath, "utf-8")) as { files?: RawFile[] }
      const rawFiles: RawFile[] = raw.files ?? []

      const files: HighlightedRegistryFile[] = []
      for (const file of rawFiles) {
        const displayPath = file.target ?? file.path
        const content = codeViewContentForRegistryFile(displayPath, file.content, file.meta)

        if (shouldStripRegistryFileContent(displayPath, file.content, file.meta)) {
          files.push({ path: displayPath, content, htmlLight: "", htmlDark: "" })
          continue
        }

        const lang = getShikiLangFromPath(displayPath)
        const { htmlLight, htmlDark } = await withVercelDocsHighlighter((hl) => ({
          htmlLight: hl.codeToHtml(content, {
            lang,
            theme: SHIKI_THEME_VERCEL_LIGHT,
          }),
          htmlDark: hl.codeToHtml(content, {
            lang,
            theme: SHIKI_THEME_VERCEL_DARK,
          }),
        }))

        files.push({ path: displayPath, content, htmlLight, htmlDark })
      }

      const install = getInstallCommand(versionId)
      return {
        files,
        installCommand: install.command,
        installCommandDisplay: install.display,
      }
    } catch {
      return null
    }
  }
)
