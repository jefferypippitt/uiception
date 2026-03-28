"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Folder } from "lucide-react"

import { cn } from "@/lib/utils"

import { CODE_DEMO, CODE_SYNTAX_PARTS } from "./mac-os-terminal-code-segments"

import "./mac-os-terminal.css"

const PROMPT = "user@macbook app % "
const COMMAND = "pnpm i ai"
const TYPE_SPEED = 38
const TYPE_CODE_MS = 11
const TYPE_CODE_NEWLINE_MS = 48

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
      /** In-progress label (with spinner) */
      text: string
      /** Past-tense line after ✓ when complete */
      doneText: string
      delay: number
      duration: number
    }

const OUTPUT_SEQUENCE: OutputItem[] = [
  {
    type: "spinner",
    text: "Resolving dependencies…",
    doneText: "Resolved dependencies",
    delay: 240,
    duration: 900,
  },
  {
    type: "spinner",
    text: "Downloading + installing ai…",
    doneText: "Downloaded and installed ai",
    delay: 140,
    duration: 1400,
  },
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
    <div className="flex min-w-0 flex-wrap items-center gap-x-1">
      <span className="shrink-0 tabular-nums">{PROMPT}</span>
      {children}
    </div>
  )
}

function TrafficLights() {
  return (
    <div className="absolute left-3 flex gap-2" aria-hidden>
      <button
        type="button"
        tabIndex={-1}
        className="size-3 shrink-0 rounded-full bg-[#ff5f57] ring-1 ring-black/10"
      />
      <button
        type="button"
        tabIndex={-1}
        className="size-3 shrink-0 rounded-full bg-[#febc2e] ring-1 ring-black/10"
      />
      <button
        type="button"
        tabIndex={-1}
        className="size-3 shrink-0 rounded-full bg-[#28c840] ring-1 ring-black/10"
      />
    </div>
  )
}

const codeBlockWrap = "mot-codeblock my-2 py-2 pr-2 pl-3 text-[12px] leading-[1.55]"

function MotSyntaxCode({ visibleChars }: { visibleChars: number }) {
  let remaining = visibleChars
  const nodes: ReactNode[] = []
  let key = 0
  for (const { t, c } of CODE_SYNTAX_PARTS) {
    if (remaining <= 0) break
    const take = Math.min(t.length, remaining)
    if (take > 0) {
      nodes.push(
        <span key={key++} className={c}>
          {t.slice(0, take)}
        </span>,
      )
      remaining -= take
    }
  }
  return <>{nodes}</>
}

export default function MacOsTerminal() {
  const [lines, setLines] = useState<Line[]>(INIT_LINES)
  const [typed, setTyped] = useState("")
  const [phase, setPhase] = useState<"idle" | "typing" | "output" | "typingCode" | "done">("idle")
  const [outIdx, setOutIdx] = useState(0)
  const [codeIdx, setCodeIdx] = useState(0)
  const idRef = useRef(10)
  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines, typed, codeIdx, phase])

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
      const t = setTimeout(() => {
        setCodeIdx(0)
        setPhase("typingCode")
      }, 450)
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
                    text: `✓ ${item.doneText}`,
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
    if (phase !== "typingCode") return
    if (codeIdx >= CODE_DEMO.length) {
      const t = setTimeout(() => setPhase("done"), 320)
      return () => clearTimeout(t)
    }
    const ch = CODE_DEMO[codeIdx]
    const delay = ch === "\n" ? TYPE_CODE_NEWLINE_MS : TYPE_CODE_MS
    const t = setTimeout(() => setCodeIdx((i) => i + 1), delay)
    return () => clearTimeout(t)
  }, [phase, codeIdx])

  useEffect(() => {
    if (phase !== "done") return
    const t = setTimeout(() => {
      idRef.current = 10
      setTyped("")
      setOutIdx(0)
      setCodeIdx(0)
      setLines(INIT_LINES)
      setPhase("idle")
    }, 8000)
    return () => clearTimeout(t)
  }, [phase])

  function colorCls(c?: LineColor) {
    if (!c) return "mot-t-line-default"
    switch (c) {
      case "green":
        return "mot-t-line-green"
      case "cyan":
        return "mot-t-line-cyan"
      case "dim":
        return "mot-t-line-dim"
    }
  }

  return (
    <div className="mot-terminal mot-terminal-shell w-full overflow-hidden rounded-[10px]">
      <div className="mot-terminal-titlebar relative flex h-8 shrink-0 select-none items-center">
        <TrafficLights />
        <div className="mot-terminal-title flex w-full items-center justify-center gap-1.5 px-20 text-center font-sans text-[12px] font-medium tracking-tight">
          <Folder
            size={14}
            className="size-3.5 shrink-0"
            fill="#3b8eea"
            stroke="none"
            strokeWidth={0}
            aria-hidden
          />
          <span>Projects</span>
          <span className="text-[#a1a1aa] dark:text-[#6b6b6b]" aria-hidden>
            —
          </span>
          <span>-zsh</span>
          <span className="text-[#a1a1aa] dark:text-[#6b6b6b]" aria-hidden>
            —
          </span>
          <span className="tabular-nums">80×24</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="mot-terminal-body h-[32rem] overflow-y-auto px-4 py-2.5 text-left font-mono text-[13px] leading-relaxed"
        style={{ scrollbarWidth: "none" }}
      >
        {lines.map((line) => (
          <div key={line.id} className={cn("mot-terminal-line-in", colorCls(line.color))}>
            {line.spinning ? (
              <span>
                <Spinner /> {line.text}
              </span>
            ) : (
              line.text || "\u00A0"
            )}
          </div>
        ))}

        {(phase === "typingCode" || phase === "done") && (
          <div className={codeBlockWrap}>
            <pre className="m-0 whitespace-pre-wrap break-words font-mono">
              <MotSyntaxCode
                visibleChars={phase === "done" ? CODE_DEMO.length : codeIdx}
              />
              {phase === "typingCode" && (
                <span className="mot-terminal-cursor" />
              )}
            </pre>
          </div>
        )}

        {(phase === "idle" || phase === "typing") && (
          <div className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0">
            <PromptShell />
            <span className="min-w-0">{typed}</span>
            <span className="mot-terminal-cursor" />
          </div>
        )}

        {phase === "done" && (
          <div className="mt-2 flex items-center gap-x-1">
            <PromptShell />
            <span className="mot-terminal-cursor" />
          </div>
        )}
      </div>
    </div>
  )
}
