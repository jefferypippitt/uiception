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
  "mdx",
  "yaml",
  "bash",
  "text",
] as const

const EXT_TO_LANG: Record<string, string> = {
  tsx: "tsx",
  jsx: "jsx",
  ts: "typescript",
  js: "javascript",
  mjs: "javascript",
  css: "css",
  json: "json",
  md: "markdown",
  mdx: "mdx",
  yml: "yaml",
  yaml: "yaml",
  sh: "bash",
}

let highlighterPromise: Promise<Highlighter> | null = null
/** Serializes WASM Oniguruma use — concurrent codeToHtml/Hast corrupts the singleton. */
let highlightQueue: Promise<void> = Promise.resolve()

function createVercelDocsHighlighter() {
  return createHighlighter({
    themes: vercelDocsShikiThemes,
    langs: [...LANGS],
  })
}

export function getVercelDocsHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createVercelDocsHighlighter()
  }
  return highlighterPromise
}

function isWasmMemoryError(error: unknown) {
  if (!(error instanceof Error)) return false
  const message = error.message.toLowerCase()
  return (
    message.includes("memory access out of bounds") ||
    message.includes("out of memory") ||
    message.includes("cannot allocate") ||
    error.name === "RuntimeError"
  )
}

async function resetVercelDocsHighlighter() {
  const pending = highlighterPromise
  highlighterPromise = null
  if (!pending) return
  try {
    const hl = await pending
    hl.dispose()
  } catch {
    // Previous instance already failed — drop it.
  }
}

/**
 * Run work against the shared highlighter one-at-a-time.
 * Retries once after disposing/recreating if WASM memory errors.
 */
export function withVercelDocsHighlighter<T>(
  fn: (hl: Highlighter) => T | Promise<T>
): Promise<T> {
  const run = async (retried: boolean): Promise<T> => {
    const hl = await getVercelDocsHighlighter()
    try {
      return await fn(hl)
    } catch (error) {
      if (!retried && isWasmMemoryError(error)) {
        await resetVercelDocsHighlighter()
        return run(true)
      }
      throw error
    }
  }

  const result = highlightQueue.then(() => run(false))
  highlightQueue = result.then(
    () => undefined,
    () => undefined
  )
  return result
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
  if (raw === "yml") return "yaml"
  return LANGS.includes(raw as (typeof LANGS)[number]) ? raw : "text"
}

export function getShikiLangFromPath(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase() ?? ""
  return resolveShikiLang(EXT_TO_LANG[ext] ?? "text")
}
