import {
  resolveShikiLang,
  SHIKI_THEME_VERCEL_DARK,
  SHIKI_THEME_VERCEL_LIGHT,
  withVercelDocsHighlighter,
} from "@/lib/shiki-vercel-docs-highlighter"

type HastNode = {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
  value?: string
}

function walk(node: HastNode, visit: (node: HastNode) => void) {
  visit(node)
  if (!node.children) return
  for (const child of node.children) {
    walk(child, visit)
  }
}

function textOf(node: HastNode): string {
  if (node.type === "text") return node.value ?? ""
  if (!node.children) return ""
  return node.children.map(textOf).join("")
}

function classList(properties: Record<string, unknown> | undefined): string[] {
  const value = properties?.className
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === "string") return value.split(/\s+/).filter(Boolean)
  return []
}

function langFromCode(code: HastNode): string {
  for (const cls of classList(code.properties)) {
    if (cls.startsWith("language-")) {
      return cls.slice("language-".length)
    }
  }
  return "text"
}

function replacePreWithHighlighted(pre: HastNode, highlighted: HastNode) {
  const rootChild =
    highlighted.type === "root" && highlighted.children?.[0]
      ? highlighted.children[0]
      : highlighted

  pre.tagName = rootChild.tagName ?? "pre"
  pre.properties = { ...(rootChild.properties ?? {}) }
  pre.children = rootChild.children ?? []
}

/**
 * Highlight fenced code blocks with the Vercel docs Shiki themes (light + dark CSS vars).
 * Used by site docs MDX only — keep changelog on plain typeset.
 */
export function rehypeVercelShiki() {
  return async (tree: HastNode) => {
    const pres: HastNode[] = []

    walk(tree, (node) => {
      if (node.type === "element" && node.tagName === "pre") {
        pres.push(node)
      }
    })

    for (const pre of pres) {
      const code = pre.children?.find(
        (child) => child.type === "element" && child.tagName === "code"
      )
      if (!code) continue

      const source = textOf(code).replace(/\n$/, "")
      const rawLang = langFromCode(code)
      const lang = resolveShikiLang(rawLang)
      const hast = await withVercelDocsHighlighter(
        (hl) =>
          hl.codeToHast(source, {
            lang,
            themes: {
              light: SHIKI_THEME_VERCEL_LIGHT,
              dark: SHIKI_THEME_VERCEL_DARK,
            },
            defaultColor: false,
          }) as HastNode
      )

      replacePreWithHighlighted(pre, hast)
    }
  }
}
