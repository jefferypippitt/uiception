type HastNode = {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
  value?: string
}

type FileTreeKind = "folder" | "tsx" | "css" | "comment" | "text"

function text(value: string): HastNode {
  return { type: "text", value }
}

function span(kind: FileTreeKind, value: string): HastNode {
  return {
    type: "element",
    tagName: "span",
    properties: { className: [`ft-${kind}`] },
    children: [text(value)],
  }
}

function classifySegment(segment: string): FileTreeKind {
  if (segment.endsWith("/")) return "folder"
  if (/\.tsx$/i.test(segment)) return "tsx"
  if (/\.css$/i.test(segment)) return "css"
  return "text"
}

/** Split a path into segments, keeping trailing `/` on folders. */
function pathSegments(path: string): string[] {
  return path.split(/(?<=\/)/).filter((part) => part.length > 0)
}

function highlightPath(path: string): HastNode[] {
  return pathSegments(path).map((segment) =>
    span(classifySegment(segment), segment)
  )
}

/**
 * Highlight a docs file-tree fence.
 * Rules: folders (…/) one color, *.tsx another, *.css another, # comments muted.
 */
export function highlightFileTreeHast(source: string): HastNode {
  const lines = source.replace(/\n$/, "").split("\n")

  const codeChildren: HastNode[] = []

  for (const line of lines) {
    const lineChildren: HastNode[] = []
    const match = line.match(/^(\s*)(.*?)(?:(\s+)(#.*))?$/)

    if (!match) {
      lineChildren.push(text(line))
    } else {
      const [, indent = "", path = "", gap = "", comment] = match
      if (indent) lineChildren.push(text(indent))
      if (path) lineChildren.push(...highlightPath(path))
      if (gap) lineChildren.push(text(gap))
      if (comment) lineChildren.push(span("comment", comment))
    }

    codeChildren.push({
      type: "element",
      tagName: "span",
      properties: { className: ["line"] },
      children: lineChildren,
    })
    codeChildren.push(text("\n"))
  }

  // Drop trailing newline text node for cleaner output
  if (
    codeChildren.length > 0 &&
    codeChildren[codeChildren.length - 1]?.type === "text" &&
    codeChildren[codeChildren.length - 1]?.value === "\n"
  ) {
    codeChildren.pop()
  }

  return {
    type: "element",
    tagName: "pre",
    properties: {
      className: ["file-tree"],
      tabIndex: 0,
    },
    children: [
      {
        type: "element",
        tagName: "code",
        properties: {},
        children: codeChildren,
      },
    ],
  }
}

export function isFileTreeLang(lang: string): boolean {
  return lang === "file-tree"
}
