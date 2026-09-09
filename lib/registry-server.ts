import { promises as fs } from "fs"
import path from "path"
import { marked } from "marked"
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
  /**
   * Rendered-Markdown HTML for `.md` / `.markdown` files, shown instead of the
   * syntax-highlighted source in the code viewer. Empty string for every other
   * file type.
   */
  markdownHtml: string
}

const MARKDOWN_EXTS = new Set(["md", "markdown"])

/**
 * Render a registry `.md` file to HTML. Content originates from our own
 * `public/r/*.json` manifests (authored in this repo), so raw HTML passed
 * through by `marked` is trusted.
 */
function renderRegistryMarkdown(source: string): string {
  return marked.parse(source, { async: false, gfm: true }) as string
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
          files.push({ path: displayPath, content, htmlLight: "", htmlDark: "", markdownHtml: "" })
          continue
        }

        const ext = displayPath.split(".").pop()?.toLowerCase() ?? ""
        if (MARKDOWN_EXTS.has(ext)) {
          files.push({
            path: displayPath,
            content,
            htmlLight: "",
            htmlDark: "",
            markdownHtml: renderRegistryMarkdown(content),
          })
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

        files.push({ path: displayPath, content, htmlLight, htmlDark, markdownHtml: "" })
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
