import { createHighlighter, type Highlighter } from "shiki"

import { vercelDocsShikiThemes } from "@/lib/shiki-vercel-docs-themes"

export {
  SHIKI_THEME_VERCEL_DARK,
  SHIKI_THEME_VERCEL_LIGHT,
} from "@/lib/shiki-vercel-docs-themes"

const LANGS = [
  "tsx",
  "jsx",
  "typescript",
  "javascript",
  "css",
  "json",
  "markdown",
  "bash",
  "text",
] as const

let highlighterPromise: Promise<Highlighter> | null = null

export function getVercelDocsHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: vercelDocsShikiThemes,
      langs: [...LANGS],
    })
  }
  return highlighterPromise
}

export function resolveShikiLang(lang: string | undefined | null): string {
  const raw = (lang ?? "").trim().toLowerCase()
  if (!raw || raw === "text" || raw === "plaintext" || raw === "plain") {
    return "text"
  }
  if (raw === "shell" || raw === "sh" || raw === "zsh" || raw === "console") {
    return "bash"
  }
  if (raw === "ts") return "typescript"
  if (raw === "js") return "javascript"
  if (raw === "md") return "markdown"
  return LANGS.includes(raw as (typeof LANGS)[number]) ? raw : "text"
}
