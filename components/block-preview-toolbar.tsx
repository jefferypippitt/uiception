"use client"

import * as React from "react"
import { IconCheck, IconTerminal2 } from "@tabler/icons-react"
import {
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  Folder,
  FolderCog,
  FolderOpen,
  Monitor,
  RefreshCw,
  Smartphone,
  Tablet,
} from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { OpenInV0Button } from "@/components/open-in-v0-button"
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
import type { BlockRegistryData } from "@/lib/registry-server"
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
  if (ext === "ts") return <Typescript className="size-4 shrink-0" aria-hidden />
  if (ext === "js" || ext === "mjs") return <Javascript className="size-4 shrink-0" aria-hidden />
  if (ext === "css") return <CssOld className="size-4 shrink-0" aria-hidden />
  if (ext === "md" || ext === "mdx") {
    return (
      <>
        <MarkdownLight className="size-4 shrink-0 dark:hidden" aria-hidden />
        <MarkdownDark className="size-4 shrink-0 hidden dark:block" aria-hidden />
      </>
    )
  }
  if (ext === "sh" || ext === "bash") {
    return (
      <>
        <Bash className="size-4 shrink-0 dark:hidden" aria-hidden />
        <BashDark className="size-4 shrink-0 hidden dark:block" aria-hidden />
      </>
    )
  }

  return (
    <svg
      viewBox="0 0 15 15"
      className="size-4 shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5Z"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1"
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
// File tree
// ---------------------------------------------------------------------------

type FileNode = {
  kind: "file"
  name: string
  path: string
}

type FolderNode = {
  kind: "folder"
  name: string
  children: TreeNode[]
}

type TreeNode = FileNode | FolderNode

function buildTree(files: { path: string }[]): TreeNode[] {
  const root: FolderNode = { kind: "folder", name: "", children: [] }

  for (const file of files) {
    const parts = file.path.split("/").filter(Boolean)
    let cur = root
    for (let i = 0; i < parts.length; i++) {
      const name = parts[i]
      const isLast = i === parts.length - 1
      if (isLast) {
        cur.children.push({ kind: "file", name, path: file.path })
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

const INDENT = 14

type TreeCallbacks = {
  selectedPath: string | null
  onSelect: (path: string) => void
}

function FolderTypeIcon({ name, open }: { name: string; open: boolean }) {
  const lower = name.toLowerCase()

  if (lower === "app") {
    return <FolderCog className="size-4 shrink-0 text-emerald-500" aria-hidden />
  }

  const Icon = open ? FolderOpen : Folder

  if (lower === "@ui" || lower === "ui" || lower === "components") {
    return <Icon className="size-4 shrink-0 fill-violet-500/80 text-violet-500" aria-hidden />
  }
  if (lower === "hooks") {
    return <Icon className="size-4 shrink-0 fill-cyan-500/80 text-cyan-500" aria-hidden />
  }
  if (lower === "lib" || lower === "utils") {
    return <Icon className="size-4 shrink-0 fill-amber-500/80 text-amber-500" aria-hidden />
  }
  if (lower === "styles" || lower === "css") {
    return <Icon className="size-4 shrink-0 fill-pink-500/80 text-pink-500" aria-hidden />
  }

  return <Icon className="size-4 shrink-0 fill-blue-500/80 text-blue-500" aria-hidden />
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
        className="file-tree-row flex h-7 w-full max-w-full min-w-0 items-center gap-1.5 overflow-hidden rounded-sm pr-2 text-left font-mono text-[12px] font-medium tracking-tight text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ChevronRight
          className={cn(
            "size-3.5 shrink-0 opacity-50 transition-transform duration-150",
            open && "rotate-90"
          )}
        />
        <FolderTypeIcon name={node.name} open={open} />
        <span className="file-tree-label truncate font-mono text-[12px] tracking-tight text-left">{node.name}</span>
      </button>

      {open && (
        <div className="relative">
          <span
            className="pointer-events-none absolute inset-y-0 border-l border-border"
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
            onClick={() => onSelect(node.path)}
            style={{ paddingLeft: `${depth * INDENT + 6}px` }}
            className={cn(
              "file-tree-row flex h-7 w-full max-w-full min-w-0 items-center gap-1.5 overflow-hidden rounded-sm pr-2 text-left font-mono text-[12px] tracking-tight transition-colors",
              active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span className="size-3 shrink-0" />
            <span className="inline-flex shrink-0">
              <FileTypeIcon name={node.name} />
            </span>
            <span className="file-tree-label truncate text-left">{node.name}</span>
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
const TOOLBAR_CTRL_H = "h-8"

type MainView = "preview" | "code"
type Viewport = "desktop" | "tablet" | "mobile"

export function BlockPreviewToolbar({
  version,
  registryData,
}: {
  version: BlockVersion
  registryData: BlockRegistryData | null
}) {
  const versionId = version.id

  const [mainView, setMainView] = React.useState<MainView>("preview")
  const [viewport, setViewport] = React.useState<Viewport>("desktop")
  const [iframeKey, setIframeKey] = React.useState(0)
  const [loadedKey, setLoadedKey] = React.useState<number | null>(null)
  const iframeLoaded = loadedKey === iframeKey
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null)
  const [selectedPath, setSelectedPath] = React.useState<string | null>(
    registryData?.files[0]?.path ?? null
  )
  const {
    copyToClipboard: copyInstallCommand,
    isCopied: installCopied,
    isCopying: installCopying,
  } = useCopyToClipboard()
  const { copyToClipboard: copyFileContent, isCopied: fileCopied } = useCopyToClipboard()
  const { resolvedTheme } = useTheme()

  const previewPath = `/view/${versionId}`

  const selectedFile = registryData?.files.find((f) => f.path === selectedPath) ?? null
  const selectedContent = selectedFile?.content ?? ""
  const highlightedHtml = selectedFile
    ? resolvedTheme === "dark"
      ? selectedFile.htmlDark
      : selectedFile.htmlLight
    : null

  const tree = React.useMemo(
    () => (registryData ? buildTree(registryData.files) : []),
    [registryData]
  )

  const installCommand = registryData?.installCommand ?? `npx shadcn@latest add "${versionId}"`
  const installCommandDisplay = `npx shadcn add ${versionId}`

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

  const displayTitle = version.title

  return (
    <Tabs
      value={mainView}
      onValueChange={(v) => setMainView(v as MainView)}
      className="w-full gap-0"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-3">
          <TabsList aria-label="View mode">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
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
                  <TooltipContent side="bottom" sideOffset={6}>Desktop</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value="tablet" aria-label="Tablet">
                      <Tablet className="size-3.5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={6}>Tablet</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value="mobile" aria-label="Mobile">
                      <Smartphone className="size-3.5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={6}>Mobile</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value="open-new-tab" aria-label="Open preview in new tab" asChild>
                      <a href={previewPath} target="_blank" rel="noreferrer">
                        <ExternalLink className="size-3.5" />
                      </a>
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={6}>Open preview in new tab</TooltipContent>
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
                  <TooltipContent side="bottom" sideOffset={6}>Refresh</TooltipContent>
                </Tooltip>
              </ToggleGroup>
            </TooltipProvider>
          )}

          <Button
            type="button"
            variant="outline"
            size="default"
            disabled={installCopying}
            onClick={() => copyInstallCommand(installCommand)}
            aria-label={
              installCopying
                ? "Copying install command"
                : installCopied
                  ? "Install command copied"
                  : "Copy install command"
            }
            title={installCommand}
            className={cn(
              "hidden max-w-[min(100vw-2rem,26rem)] min-w-0 font-normal tracking-tight sm:inline-flex",
              TOOLBAR_CTRL_H
            )}
          >
            {installCopying ? (
              <Spinner data-icon="inline-start" className="size-4" />
            ) : installCopied ? (
              <IconCheck data-icon="inline-start" className="size-4 text-muted-foreground" stroke={1.75} />
            ) : (
              <IconTerminal2 data-icon="inline-start" className="size-4" stroke={1.75} />
            )}
            <span className="min-w-0 truncate">{installCommandDisplay}</span>
          </Button>

          <OpenInV0Button name={versionId} className={cn(TOOLBAR_CTRL_H, "px-3")} />
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
          <div className="code-view-vercel-docs flex h-full min-h-0 overflow-hidden bg-sidebar">
            <div className="flex h-full w-54 shrink-0 flex-col overflow-hidden border-r border-border bg-sidebar sm:w-62">
              <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
                <div className="min-w-0 w-full max-w-full overflow-hidden pt-2 pb-3 pr-1 pl-1">
                  {!registryData ? (
                    <p className="px-2 text-xs text-destructive">Failed to load files.</p>
                  ) : tree.length === 0 ? (
                    <p className="px-2 text-xs text-muted-foreground">No files.</p>
                  ) : (
                    <TreeRows
                      nodes={tree}
                      depth={0}
                      selectedPath={selectedPath}
                      onSelect={setSelectedPath}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
              <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border px-3">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <FileTypeIcon name={selectedPath ?? "file.tsx"} />
                  <span className="truncate font-mono text-xs text-foreground">
                    {selectedPath ?? "—"}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground"
                  disabled={!selectedContent}
                  aria-label={fileCopied ? "Copied" : "Copy file contents"}
                  onClick={() => selectedContent && copyFileContent(selectedContent)}
                >
                  {fileCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </Button>
              </div>
              <div className="min-h-0 flex-1 overflow-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
                {highlightedHtml ? (
                  <div
                    className="shiki-panel shiki-panel-vercel-docs shiki-panel-editor [&_.shiki]:rounded-none [&_.shiki]:border-0"
                    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                  />
                ) : (
                  <pre className="p-4 font-mono text-xs leading-relaxed text-[#6b7280] dark:text-[#a0a0a0]">
                    {selectedContent ? "—" : "Select a file"}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  )
}
