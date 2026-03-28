"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { ChevronDown, ChevronUp, MoreHorizontal, Plus, Terminal, X } from "lucide-react"

import { cn } from "@/lib/utils"

import "./cursor-terminal.css"

const ICON_SM = "size-3.5 shrink-0 stroke-[1.75]"
const ICON_XS = "size-3 shrink-0 stroke-[1.75]"

const PROMPT = "PS C:\\projects\\uiception> "
const COMMAND =
  'pnpm dlx shadcn@latest add "https://uiception.com/r/hero-section-v1.json"'
const TYPE_SPEED = 38

const PANEL_TABS = ["Problems", "Output", "Debug Console", "Terminal", "Ports", "GitLens"] as const

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]

type LineColor = "green" | "cyan" | "dim"

interface Line {
  id: number
  text: string
  color?: LineColor
  spinning?: boolean
}

type OutputItem =
  | { type: "line"; text: string; color?: LineColor; delay: number }
  | {
      type: "spinner"
      text: string
      delay: number
      duration: number
      /** If set, shown after ✓ when the spinner finishes (otherwise `text` is reused). */
      doneText?: string
    }

/**
 * hero-section-v1 install: 20 registry targets + `button` registryDependency = 21 files.
 * Show a short sample; remainder is summarized (matches truncation style).
 */
const OUTPUT_SEQUENCE: OutputItem[] = [
  { type: "spinner", text: "Checking registry.", delay: 280, duration: 1000 },
  {
    type: "spinner",
    text: "Installing dependencies.",
    delay: 160,
    duration: 2200,
    doneText: "Installed dependencies.",
  },
  { type: "line", text: "✓ Created 21 files:", color: "green", delay: 80 },
  { type: "line", text: "  - components/ui/button.tsx", color: "cyan", delay: 85 },
  { type: "line", text: "  - app/hero-section-v1/page.tsx", color: "cyan", delay: 80 },
  { type: "line", text: "  - app/hero-section-v1/hero-section-v1.tsx", color: "cyan", delay: 80 },
  { type: "line", text: "  - app/hero-section-v1/brands-section-v1.tsx", color: "cyan", delay: 80 },
  { type: "line", text: "  - app/hero-section-v1/mac-os-terminal.tsx", color: "cyan", delay: 80 },
  { type: "line", text: "  - public/images/hero-section-v1-bg.png", color: "cyan", delay: 80 },
  {
    type: "line",
    text: "  … +15 files (CSS, terminal TS/CSS, code segments, 12 brand SVGs)",
    color: "dim",
    delay: 90,
  },
  { type: "line", text: "", delay: 160 },
  { type: "line", text: "Success! Component installed successfully.", color: "green", delay: 100 },
  { type: "line", text: "You may now import and use the component.", color: "dim", delay: 80 },
]

const INIT_LINES: Line[] = []

function Spinner() {
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setFrame((f) => (f + 1) % SPINNER_FRAMES.length), 80)
    return () => clearInterval(t)
  }, [])
  return <span>{SPINNER_FRAMES[frame]}</span>
}

function PromptShell({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block size-[7px] shrink-0 rounded-full bg-[#3b8eea] ring-1 ring-white/15"
        aria-hidden
      />
      <span className="tabular-nums">{PROMPT}</span>
      {children}
    </div>
  )
}

export default function CursorTerminal() {
  const [lines, setLines] = useState<Line[]>(INIT_LINES)
  const [typed, setTyped] = useState("")
  const [phase, setPhase] = useState<"idle" | "typing" | "output" | "done">("idle")
  const [outIdx, setOutIdx] = useState(0)
  const idRef = useRef(10)
  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines, typed])

  useEffect(() => {
    if (phase !== "idle") return
    const t = setTimeout(() => setPhase("typing"), 1600)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== "typing") return
    if (typed.length < COMMAND.length) {
      const t = setTimeout(() => setTyped(COMMAND.slice(0, typed.length + 1)), TYPE_SPEED)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setLines((prev) => [...prev, { id: idRef.current++, text: `${PROMPT}${COMMAND}` }])
      setTyped("")
      setOutIdx(0)
      setPhase("output")
    }, 360)
    return () => clearTimeout(t)
  }, [phase, typed])

  useEffect(() => {
    if (phase !== "output") return
    if (outIdx >= OUTPUT_SEQUENCE.length) {
      const t = setTimeout(() => setPhase("done"), 500)
      return () => clearTimeout(t)
    }

    const item = OUTPUT_SEQUENCE[outIdx]

    if (item.type === "spinner") {
      const t = setTimeout(() => {
        const spinId = idRef.current++
        setLines((prev) => [...prev, { id: spinId, text: item.text, spinning: true }])
        spinTimerRef.current = setTimeout(() => {
          setLines((prev) =>
            prev.map((l) =>
              l.id === spinId
                ? {
                    ...l,
                    spinning: false,
                    text: `✓ ${item.doneText ?? item.text}`,
                    color: "green" as LineColor,
                  }
                : l,
            ),
          )
          setOutIdx((i) => i + 1)
        }, item.duration)
      }, item.delay)
      return () => {
        clearTimeout(t)
        if (spinTimerRef.current) clearTimeout(spinTimerRef.current)
      }
    }

    const t = setTimeout(() => {
      setLines((prev) => [...prev, { id: idRef.current++, text: item.text, color: item.color }])
      setOutIdx((i) => i + 1)
    }, item.delay)
    return () => clearTimeout(t)
  }, [phase, outIdx])

  useEffect(() => {
    if (phase !== "done") return
    const t = setTimeout(() => {
      idRef.current = 10
      setTyped("")
      setOutIdx(0)
      setLines(INIT_LINES)
      setPhase("idle")
    }, 5500)
    return () => clearTimeout(t)
  }, [phase])

  function colorCls(c?: LineColor) {
    if (c === "green") return "text-[#16c60c]"
    if (c === "cyan") return "text-[#61d6d6]"
    if (c === "dim") return "text-[#767676]"
    return "text-[#cccccc]"
  }

  return (
    <div className="crt-terminal w-full overflow-hidden rounded-md border border-white/8 bg-[#1e1e1e] shadow-lg shadow-black/40">
      <div className="flex h-9 min-h-9 select-none items-stretch border-b border-white/6 bg-[#252526]">
        <div className="flex min-w-0 flex-1 items-stretch overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {PANEL_TABS.map((name) => {
            const active = name === "Terminal"
            return (
              <button
                key={name}
                type="button"
                aria-hidden
                tabIndex={-1}
                className={cn(
                  "shrink-0 px-3 text-[11px] transition-colors",
                  active
                    ? "border-t border-t-[#007fd4] bg-[#1e1e1e] text-[#e8e8e8]"
                    : "border-t border-t-transparent text-[#858585] hover:text-[#c0c0c0]",
                )}
              >
                {name}
              </button>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-px pr-1 pl-2">
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="flex h-7 items-center gap-1 rounded px-1.5 text-[12px] text-[#cccccc] transition-colors hover:bg-white/6"
          >
            <Terminal className={cn(ICON_SM, "text-[#3b8eea]")} aria-hidden />
            <span className="max-w-22 truncate sm:max-w-none">powershell</span>
            <ChevronDown className={cn(ICON_XS, "text-[#858585]")} aria-hidden />
          </button>
          <PanelIconButton label="New terminal" className="w-auto min-w-7 gap-0.5 px-1">
            <Plus className={ICON_SM} aria-hidden />
            <ChevronDown className={cn(ICON_XS, "text-[#a0a0a0]")} aria-hidden />
          </PanelIconButton>
          <PanelIconButton label="More">
            <MoreHorizontal className={ICON_SM} aria-hidden />
          </PanelIconButton>
          <PanelIconButton label="Maximize panel">
            <ChevronUp className={ICON_SM} aria-hidden />
          </PanelIconButton>
          <PanelIconButton label="Close panel" hoverDanger>
            <X className={ICON_SM} aria-hidden />
          </PanelIconButton>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="crt-body h-[22rem] overflow-y-auto bg-[#1e1e1e] px-4 py-2.5 text-left font-mono text-[13px] leading-relaxed text-[#cccccc]"
        style={{ scrollbarWidth: "none" }}
      >
        {lines.map((line) => (
          <div key={line.id} className={cn("crt-line-in", colorCls(line.color))}>
            {line.spinning ? (
              <span>
                <Spinner /> {line.text}
              </span>
            ) : (
              line.text || "\u00A0"
            )}
          </div>
        ))}

        {(phase === "idle" || phase === "typing") && (
          <div className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0">
            <PromptShell />
            <span className="min-w-0">{typed}</span>
            <span className="crt-cursor" />
          </div>
        )}

        {phase === "done" && (
          <div className="flex items-center gap-x-1">
            <PromptShell />
            <span className="crt-cursor" />
          </div>
        )}
      </div>

      <div className="border-t border-white/6 bg-[#1e1e1e] py-2 text-center text-[11px] text-[#6e6e6e]">
        Ctrl+K to generate command
      </div>
    </div>
  )
}

function PanelIconButton({
  children,
  label,
  hoverDanger,
  className,
}: {
  children: ReactNode
  label: string
  hoverDanger?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      tabIndex={-1}
      className={cn(
        "flex size-7 items-center justify-center rounded text-[#c8c8c8] transition-colors",
        hoverDanger ? "hover:bg-[#c42b1c]/90 hover:text-white" : "hover:bg-white/8",
        className,
      )}
    >
      {children}
    </button>
  )
}
