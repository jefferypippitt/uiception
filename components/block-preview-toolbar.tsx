"use client"

import * as React from "react"
import {
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  Folder,
  FolderOpen,
  Monitor,
  RefreshCw,
  Smartphone,
  Tablet,
} from "lucide-react"
import { createHighlighter, type Highlighter } from "shiki"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { OpenInV0Button } from "@/components/open-in-v0-button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import type { BlockVersion } from "@/lib/blocks"
import { cn } from "@/lib/utils"
import { ReactLight } from "@/components/ui/svgs/reactLight"
import { ReactDark } from "@/components/ui/svgs/reactDark"
import { Typescript } from "@/components/ui/svgs/typescript"
import { Javascript } from "@/components/ui/svgs/javascript"
import { CssOld } from "@/components/ui/svgs/cssOld"
import { MarkdownLight } from "@/components/ui/svgs/markdownLight"
import { MarkdownDark } from "@/components/ui/svgs/markdownDark"
import { Bash } from "@/components/ui/svgs/bash"
import { BashDark } from "@/components/ui/svgs/bashDark"

// ---------------------------------------------------------------------------
// Shiki — singleton highlighter (lazy, shared across all instances)
// ---------------------------------------------------------------------------

let shikiPromise: Promise<Highlighter> | null = null

/** Noir: Shiki “min” themes — mostly grayscale, high-contrast, film-still vibe. */
const SHIKI_THEME_LIGHT = "min-light"
const SHIKI_THEME_DARK = "min-dark"

function getHighlighter() {
  if (!shikiPromise) {
    shikiPromise = createHighlighter({
      themes: [SHIKI_THEME_LIGHT, SHIKI_THEME_DARK],
      langs: ["tsx", "jsx", "typescript", "javascript", "css", "json", "markdown", "bash", "text"],
    })
  }
  return shikiPromise
}

function getLang(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? ""
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

const BINARY_EXTS = new Set(["png", "jpg", "jpeg", "webp", "gif", "ico", "avif", "bmp", "tiff"])

function isBinaryFile(path: string): boolean {
  const ext = path.split(".").pop()?.toLowerCase() ?? ""
  return BINARY_EXTS.has(ext)
}

function binaryPlaceholder(path: string): string {
  const name = path.split("/").pop() ?? path
  return `// ${name}\n//\n// This image asset is included when you install the block.\n// Replace it with your own file at the same path.`
}

// ---------------------------------------------------------------------------
// File-type icons
// ---------------------------------------------------------------------------

function FileTypeIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase() ?? ""

  if (ext === "tsx" || ext === "jsx") {
    return (
      <>
        <ReactLight className="size-4 shrink-0 dark:hidden" aria-hidden />
        <ReactDark className="size-4 shrink-0 hidden dark:block" aria-hidden />
      </>
    )
  }

  if (ext === "ts") {
    return <Typescript className="size-4 shrink-0" aria-hidden />
  }

  if (ext === "css") {
    return <CssOld className="size-4 shrink-0" aria-hidden />
  }

  if (ext === "json") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
        <rect width="16" height="16" rx="2.5" fill="#CBCB41" />
        <text
          x="0.5"
          y="12"
          fontSize="6"
          fontWeight="700"
          fontFamily="ui-monospace,monospace"
          fill="#1a1a1a"
        >
          JSON
        </text>
      </svg>
    )
  }

  if (ext === "js" || ext === "mjs") {
    return <Javascript className="size-4 shrink-0" aria-hidden />
  }

  if (ext === "md" || ext === "mdx") {
    return (
      <>
        <MarkdownLight className="size-4 shrink-0 dark:hidden" aria-hidden />
        <MarkdownDark className="size-4 shrink-0 hidden dark:block" aria-hidden />
      </>
    )
  }

  if (ext === "sh") {
    return (
      <>
        <Bash className="size-4 shrink-0 dark:hidden" aria-hidden />
        <BashDark className="size-4 shrink-0 hidden dark:block" aria-hidden />
      </>
    )
  }

  // generic
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path
        d="M3 2a1 1 0 011-1h5.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0114 5.414V14a1 1 0 01-1 1H4a1 1 0 01-1-1V2z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M9 1.5V5a1 1 0 001 1h3.5"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Registry types
// ---------------------------------------------------------------------------

type RegistryFileJson = {
  path: string
  target?: string
  content: string
  type?: string
}

// ---------------------------------------------------------------------------
// File tree
// ---------------------------------------------------------------------------

type FileNode = {
  kind: "file"
  name: string
  path: string
  content: string
}

type FolderNode = {
  kind: "folder"
  name: string
  children: TreeNode[]
}

type TreeNode = FileNode | FolderNode

function buildTree(files: RegistryFileJson[]): TreeNode[] {
  const root: FolderNode = { kind: "folder", name: "", children: [] }

  for (const file of files) {
    const parts = file.path.split("/").filter(Boolean)
    let cur = root
    for (let i = 0; i < parts.length; i++) {
      const name = parts[i]
      const isLast = i === parts.length - 1
      if (isLast) {
        cur.children.push({ kind: "file", name, path: file.path, content: file.content })
      } else {
        let folder = cur.children.find(
          (c): c is FolderNode => c.kind === "folder" && c.name === name
        )
        if (!folder) {
          folder = { kind: "folder", name, children: [] }
          cur.children.push(folder)
        }
        cur = folder
      }
    }
  }

  return sortTree(root.children)
}

function sortTree(nodes: TreeNode[]): TreeNode[] {
  const sorted = [...nodes].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1
    return a.name.localeCompare(b.name)
  })
  for (const n of sorted) {
    if (n.kind === "folder") n.children = sortTree(n.children)
  }
  return sorted
}

// px indented per depth level
const INDENT = 14

type TreeCallbacks = {
  selectedPath: string | null
  onSelect: (path: string, content: string) => void
}

function FolderRow({
  node,
  depth,
  selectedPath,
  onSelect,
}: { node: FolderNode; depth: number } & TreeCallbacks) {
  const [open, setOpen] = React.useState(true)

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        title={node.name}
        onClick={() => setOpen((v) => !v)}
        style={{ paddingLeft: `${depth * INDENT + 6}px` }}
        className="file-tree-row flex h-7 w-full max-w-full min-w-0 items-center gap-1.5 overflow-hidden rounded-sm pr-2 text-left font-mono text-[12px] font-medium tracking-tight text-stone-600 transition-colors hover:bg-stone-200/80 hover:text-stone-950 dark:text-zinc-400 dark:hover:bg-zinc-900/70 dark:hover:text-zinc-100"
      >
        <ChevronRight
          className={cn(
            "size-3.5 shrink-0 opacity-50 transition-transform duration-150",
            open && "rotate-90"
          )}
        />
        {open ? (
          <FolderOpen
            className="size-4 shrink-0 fill-stone-400/35 text-stone-600 dark:fill-zinc-600/35 dark:text-zinc-500"
            aria-hidden
          />
        ) : (
          <Folder
            className="size-4 shrink-0 fill-stone-400/35 text-stone-600 dark:fill-zinc-600/35 dark:text-zinc-500"
            aria-hidden
          />
        )}
        <span className="file-tree-label font-mono text-[12px] tracking-tight text-left">{node.name}</span>
      </button>

      {open && (
        <div className="relative">
          {/* vertical guide line */}
          <span
            className="pointer-events-none absolute inset-y-0 border-l border-stone-300/60 dark:border-zinc-800"
            style={{ left: `${depth * INDENT + 13}px` }}
          />
          <TreeRows nodes={node.children} depth={depth + 1} selectedPath={selectedPath} onSelect={onSelect} />
        </div>
      )}
    </>
  )
}

function TreeRows({
  nodes,
  depth,
  selectedPath,
  onSelect,
}: { nodes: TreeNode[]; depth: number } & TreeCallbacks) {
  return (
    <>
      {nodes.map((node) => {
        if (node.kind === "folder") {
          return (
            <FolderRow
              key={`folder-${depth}-${node.name}`}
              node={node}
              depth={depth}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          )
        }

        const active = selectedPath === node.path
        return (
          <button
            key={node.path}
            type="button"
            title={node.path}
            onClick={() => onSelect(node.path, node.content)}
            style={{ paddingLeft: `${depth * INDENT + 6}px` }}
            className={cn(
              "file-tree-row flex h-7 w-full max-w-full min-w-0 items-center gap-1.5 overflow-hidden rounded-sm pr-2 text-left font-mono text-[12px] tracking-tight transition-colors",
              active
                ? "bg-stone-300/90 text-stone-950 dark:bg-zinc-800 dark:text-zinc-50"
                : "text-stone-600 hover:bg-stone-200/70 hover:text-stone-950 dark:text-zinc-500 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200"
            )}
          >
            {/* aligns file icon with folder icon (chevron placeholder) */}
            <span className="size-3 shrink-0" />
            <span className="inline-flex shrink-0">
              <FileTypeIcon name={node.name} />
            </span>
            <span className="file-tree-label text-left">{node.name}</span>
          </button>
        )
      })}
    </>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const PREVIEW_SHELL = "h-[min(44rem,72vh)]"

/** Shared height for toolbar controls (icon groups, copy row, primary actions). */
const TOOLBAR_CTRL_H = "h-8"

type MainView = "preview" | "code"

type Viewport = "desktop" | "tablet" | "mobile"

export function BlockPreviewToolbar({
  version,
}: {
  version: BlockVersion
}) {
  const versionId = version.id

  const [mainView, setMainView] = React.useState<MainView>("preview")
  const [viewport, setViewport] = React.useState<Viewport>("desktop")
  const [iframeKey, setIframeKey] = React.useState(0)
  const [loadedKey, setLoadedKey] = React.useState<number | null>(null)
  const iframeLoaded = loadedKey === iframeKey
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null)
  const [registryFiles, setRegistryFiles] = React.useState<RegistryFileJson[] | null>(null)
  const [codeError, setCodeError] = React.useState<string | null>(null)
  const [selectedPath, setSelectedPath] = React.useState<string | null>(null)
  const [selectedContent, setSelectedContent] = React.useState("")
  const [highlightedHtml, setHighlightedHtml] = React.useState<string | null>(null)
  const {
    copyToClipboard: copyInstallCommand,
    isCopied: installCopied,
  } = useCopyToClipboard()
  const { copyToClipboard: copyFileContent, isCopied: fileCopied } = useCopyToClipboard()
  const { resolvedTheme } = useTheme()

  React.useEffect(() => {
    setRegistryFiles(null)
    setCodeError(null)
    setSelectedPath(null)
    setSelectedContent("")
    setHighlightedHtml(null)
  }, [versionId])

  React.useEffect(() => {
    if (mainView !== "code" || registryFiles !== null || codeError) return
    let cancelled = false
    void fetch(`/r/${versionId}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load registry item (${res.status})`)
        return res.json() as Promise<{ files: RegistryFileJson[] }>
      })
      .then((data) => {
        if (cancelled) return
        const files = data.files ?? []
        setRegistryFiles(files)
        const first = files[0]
        if (first) {
          const firstPath = first.target ?? first.path
          setSelectedPath(firstPath)
          setSelectedContent(isBinaryFile(firstPath) ? binaryPlaceholder(firstPath) : (first.content ?? ""))
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) setCodeError(e instanceof Error ? e.message : "Failed to load files")
      })
    return () => {
      cancelled = true
    }
  }, [mainView, versionId, registryFiles, codeError])

  const installCommand = `npx shadcn@latest add "https://uiception.com/r/${versionId}.json"`
  const previewPath = `/view/${versionId}`

  // If the iframe navigates to a new preview URL, ensure the loading overlay
  // can't get stuck due to a stale `loadedKey`.
  React.useEffect(() => {
    setLoadedKey(null)
  }, [previewPath])

  // Hard-refresh can complete the iframe load before React hydration attaches
  // event handlers. This effect covers that case by checking readyState.
  React.useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    let cancelled = false

    const markLoaded = () => {
      if (cancelled) return
      setLoadedKey(iframeKey)
    }

    // If the iframe already finished loading (common on hard refresh),
    // `readyState` will be `complete` and we can clear the spinner.
    try {
      const doc = iframe.contentDocument
      if (doc?.readyState === "complete") {
        markLoaded()
        return
      }
    } catch {
      // Accessing contentDocument can throw if the browser hasn't navigated yet.
    }

    iframe.addEventListener("load", markLoaded, { once: true })
    return () => {
      cancelled = true
      iframe.removeEventListener("load", markLoaded)
    }
  }, [iframeKey, previewPath])

  // Re-highlight whenever content, selected file, or theme changes
  React.useEffect(() => {
    if (!selectedContent) {
      setHighlightedHtml(null)
      return
    }
    const lang = getLang(selectedPath ?? "")
    const theme = resolvedTheme === "dark" ? SHIKI_THEME_DARK : SHIKI_THEME_LIGHT
    let cancelled = false
    void getHighlighter().then((hl) => {
      if (cancelled) return
      setHighlightedHtml(hl.codeToHtml(selectedContent, { lang, theme }))
    })
    return () => { cancelled = true }
  }, [selectedContent, selectedPath, resolvedTheme])

  const tree = React.useMemo(
    () =>
      registryFiles
        ? buildTree(registryFiles.map((f) => ({ ...f, path: f.target ?? f.path })))
        : [],
    [registryFiles]
  )

  const displayTitle = version.title

  return (
    <Tabs
      value={mainView}
      onValueChange={(v) => setMainView(v as MainView)}
      className="w-full gap-0"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-3">
          <TabsList
            aria-label="View mode"
          >
            <TabsTrigger value="preview">
              Preview
            </TabsTrigger>
            <TabsTrigger value="code">
              Code
            </TabsTrigger>
          </TabsList>

          <div className="hidden h-4 w-px shrink-0 bg-border sm:block" aria-hidden />

          <p className="min-w-0 max-w-[min(100%,28rem)] truncate text-sm font-medium">
            {displayTitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:ml-auto sm:gap-2.5">
          {mainView === "preview" && (
            <TooltipProvider delayDuration={300}>
              <ToggleGroup
                type="single"
                variant="outline"
                spacing={0}
                value={viewport}
                onValueChange={(v) => {
                  if (v === "desktop" || v === "tablet" || v === "mobile") {
                    setViewport(v)
                  }
                }}
                className="shrink-0"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value="desktop" aria-label="Desktop">
                      <Monitor className="size-3.5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={6}>
                    Desktop
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value="tablet" aria-label="Tablet">
                      <Tablet className="size-3.5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={6}>
                    Tablet
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value="mobile" aria-label="Mobile">
                      <Smartphone className="size-3.5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={6}>
                    Mobile
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value="open-new-tab" aria-label="Open preview in new tab" asChild>
                      <a href={previewPath} target="_blank" rel="noreferrer">
                        <ExternalLink className="size-3.5" />
                      </a>
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={6}>
                    Open preview in new tab
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value="refresh"
                      aria-label="Refresh"
                      onClick={() => setIframeKey((k) => k + 1)}
                    >
                      <RefreshCw className="size-3.5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={6}>
                    Refresh
                  </TooltipContent>
                </Tooltip>
              </ToggleGroup>
            </TooltipProvider>
          )}

          <button
            type="button"
            onClick={() => copyInstallCommand(installCommand)}
            className={cn(
              "hidden w-[min(100vw-2rem,22rem)] items-center gap-2 rounded-lg border border-border/70 bg-muted/20 px-2.5 text-left font-mono text-xs text-foreground transition-colors hover:bg-muted/40 sm:inline-flex",
              TOOLBAR_CTRL_H
            )}
            title={installCommand}
          >
            <span className="min-w-0 flex-1 truncate">{installCommand}</span>
            <span className="shrink-0 text-muted-foreground">
              {installCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            </span>
          </button>

          <OpenInV0Button name={versionId} className={cn(TOOLBAR_CTRL_H, "px-3 text-xs")} />
        </div>
      </div>

      <div className={cn("overflow-hidden rounded-xl border bg-background", PREVIEW_SHELL)}>
        <TabsContent value="preview" className="m-0 h-full min-h-0 p-0">
          <div className="preview-scrollbar flex h-full items-center justify-center overflow-auto bg-muted/15 p-3">
            <div
              className={cn(
                "h-full min-h-0 transition-[max-width] duration-200",
                viewport === "desktop" && "w-full max-w-none",
                viewport === "tablet" && "w-full max-w-[768px]",
                viewport === "mobile" && "w-full max-w-[390px]"
              )}
            >
              <div className="relative h-full min-h-80 w-full">
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg border border-border/80 bg-muted/20">
                    <Spinner className="size-5 text-muted-foreground" />
                  </div>
                )}
                <iframe
                  key={iframeKey}
                  src={previewPath}
                  title={displayTitle}
                  ref={iframeRef}
                  className={cn(
                    "block h-full w-full rounded-lg border border-border/80 bg-background shadow-sm",
                    !iframeLoaded && "invisible"
                  )}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="code" className="m-0 h-full min-h-0 p-0">
          <div className="code-view-noir flex h-full min-h-0 overflow-hidden bg-stone-200 dark:bg-black">
            <div className="flex h-full w-54 shrink-0 flex-col overflow-hidden border-r border-stone-400/30 bg-stone-100/95 sm:w-62 dark:border-zinc-800 dark:bg-zinc-950">
              <p className="min-w-0 truncate px-3 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500 dark:text-zinc-500">
                Files
              </p>
              <ScrollArea className="file-tree-scroll-area min-h-0 min-w-0 flex-1 overflow-x-hidden">
                <div className="min-w-0 w-full max-w-full overflow-hidden pb-3 pr-1 pl-1">
                  {codeError ? (
                    <p className="px-2 text-xs text-destructive">{codeError}</p>
                  ) : registryFiles === null ? (
                    <p className="px-2 text-xs text-stone-500 dark:text-zinc-500">Loading…</p>
                  ) : tree.length === 0 ? (
                    <p className="px-2 text-xs text-stone-500 dark:text-zinc-500">No files.</p>
                  ) : (
                    <TreeRows
                      nodes={tree}
                      depth={0}
                      selectedPath={selectedPath}
                      onSelect={(path, content) => {
                        setSelectedPath(path)
                        setSelectedContent(isBinaryFile(path) ? binaryPlaceholder(path) : content)
                      }}
                    />
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white dark:bg-black">
              <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-stone-300/60 px-3 dark:border-zinc-800">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <FileTypeIcon name={selectedPath ?? "file.tsx"} />
                  <span className="truncate font-mono text-xs text-stone-900 dark:text-zinc-200">
                    {selectedPath ?? "—"}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-stone-500 hover:bg-stone-200 hover:text-stone-900 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                  disabled={!selectedContent}
                  aria-label={fileCopied ? "Copied" : "Copy file contents"}
                  onClick={() => selectedContent && copyFileContent(selectedContent)}
                >
                  {fileCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </Button>
              </div>
              <ScrollArea className="min-h-0 flex-1">
                {highlightedHtml ? (
                  <div
                    className="shiki-panel shiki-panel-noir shiki-panel-editor [&_.shiki]:rounded-none [&_.shiki]:border-0"
                    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                  />
                ) : (
                  <pre className="p-4 font-mono text-xs leading-relaxed text-stone-500 dark:text-zinc-500">
                    {selectedContent
                      ? "Highlighting…"
                      : registryFiles === null
                        ? ""
                        : "Select a file"}
                  </pre>
                )}
              </ScrollArea>
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  )
}
