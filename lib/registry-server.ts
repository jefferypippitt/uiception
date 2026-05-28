import { promises as fs } from "fs"
import path from "path"
import { cache } from "react"
import { createHighlighter, type Highlighter } from "shiki"

import {
  codeViewContentForRegistryFile,
  shouldStripRegistryFileContent,
} from "@/lib/registry-code-view"
import { installCommandWithMediaFetch } from "@/lib/registry-install-media"
import {
  SHIKI_THEME_VERCEL_DARK,
  SHIKI_THEME_VERCEL_LIGHT,
  vercelDocsShikiThemes,
} from "@/lib/shiki-vercel-docs-themes"

export type HighlightedRegistryFile = {
  path: string
  content: string
  htmlLight: string
  htmlDark: string
}

export type BlockRegistryData = {
  files: HighlightedRegistryFile[]
  installCommand: string
}

type RawFile = {
  path: string
  target?: string
  content?: string
  type?: string
  meta?: { installUrl?: string }
}

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: vercelDocsShikiThemes,
      langs: ["tsx", "jsx", "typescript", "javascript", "css", "json", "markdown", "bash", "text"],
    })
  }
  return highlighterPromise
}

function getLang(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase() ?? ""
  const map: Record<string, string> = {
    tsx: "tsx",
    jsx: "jsx",
    ts: "typescript",
    js: "javascript",
    mjs: "javascript",
    css: "css",
    json: "json",
    md: "markdown",
    mdx: "markdown",
    sh: "bash",
  }
  return map[ext] ?? "text"
}

export const getBlockRegistryData = cache(
  async (versionId: string): Promise<BlockRegistryData | null> => {
    try {
      const jsonPath = path.join(process.cwd(), "public", "r", `${versionId}.json`)
      const raw = JSON.parse(await fs.readFile(jsonPath, "utf-8")) as { files?: RawFile[] }
      const rawFiles: RawFile[] = raw.files ?? []
      const hl = await getHighlighter()

      const files = await Promise.all(
        rawFiles.map(async (file) => {
          const displayPath = file.target ?? file.path
          const content = codeViewContentForRegistryFile(displayPath, file.content, file.meta)

          if (shouldStripRegistryFileContent(displayPath, file.content, file.meta)) {
            return { path: displayPath, content, htmlLight: "", htmlDark: "" }
          }

          const lang = getLang(displayPath)
          const [htmlLight, htmlDark] = await Promise.all([
            hl.codeToHtml(content, { lang, theme: SHIKI_THEME_VERCEL_LIGHT }),
            hl.codeToHtml(content, { lang, theme: SHIKI_THEME_VERCEL_DARK }),
          ])

          return { path: displayPath, content, htmlLight, htmlDark }
        })
      )

      return { files, installCommand: installCommandWithMediaFetch(versionId, rawFiles) }
    } catch {
      return null
    }
  }
)
