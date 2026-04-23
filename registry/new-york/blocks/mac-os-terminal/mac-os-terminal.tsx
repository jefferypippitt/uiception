"use client"

import { GeistSans } from "geist/font/sans"
import { Folder } from "lucide-react"
import { cn } from "@/lib/utils"

import { useTerminalAnimation } from "./hooks/use-terminal-animation"
import Spinner from "./components/spinner"
import PromptShell from "./components/prompt-shell"
import TrafficLights from "./components/traffic-lights"
import SyntaxCode from "./components/syntax-code"
import { CODE_DEMO } from "./lib/mac-os-terminal-code-segments"
import type { LineColor } from "./lib/config"

import "./styles/mac-os-terminal.css"

const codeBlockWrap = "mot-codeblock my-2 py-2 pr-2 pl-3 text-[12px] leading-[1.55]"

function colorCls(c?: LineColor) {
  if (!c) return "mot-t-line-default"
  switch (c) {
    case "green": return "mot-t-line-green"
    case "cyan":  return "mot-t-line-cyan"
    case "dim":   return "mot-t-line-dim"
  }
}

export default function MacOsTerminal() {
  const { lines, typed, phase, codeIdx, scrollRef } = useTerminalAnimation()

  return (
    <div className="mot-terminal mot-terminal-shell w-full overflow-hidden rounded-md">
      <div className="mot-terminal-titlebar relative flex h-8 shrink-0 select-none items-center">
        <TrafficLights />
        <div
          className={cn(
            GeistSans.className,
            "mot-terminal-title flex w-full items-center justify-center gap-1.5 px-20 text-center text-[12px] font-medium tracking-tight",
          )}
        >
          <Folder size={14} className="size-3.5 shrink-0" fill="#3b8eea" stroke="none" strokeWidth={0} aria-hidden />
          <span>Projects</span>
          <span className="text-[#a1a1aa] dark:text-[#6b6b6b]" aria-hidden>—</span>
          <span>-zsh</span>
          <span className="text-[#a1a1aa] dark:text-[#6b6b6b]" aria-hidden>—</span>
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
              <span><Spinner /> {line.text}</span>
            ) : (
              line.text || "\u00A0"
            )}
          </div>
        ))}

        {(phase === "typingCode" || phase === "done") && (
          <div className={codeBlockWrap}>
            <pre className="m-0 whitespace-pre-wrap break-words font-mono">
              <SyntaxCode visibleChars={phase === "done" ? CODE_DEMO.length : codeIdx} />
              {phase === "typingCode" && <span className="mot-terminal-cursor" />}
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
