"use client"

import { ChevronDown, ChevronUp, MoreHorizontal, Plus, Terminal, X } from "lucide-react"
import { cn } from "@/lib/utils"

import { useTerminalAnimation } from "./hooks/use-terminal-animation"
import Spinner from "./components/spinner"
import PromptShell from "./components/prompt-shell"
import PanelIconButton from "./components/panel-icon-button"
import { ICON_SM, ICON_XS, PANEL_TABS, type LineColor } from "./lib/config"

import "./styles/cursor-terminal.css"

function colorCls(c?: LineColor) {
  if (c === "green") return "text-[#16c60c]"
  if (c === "cyan")  return "text-[#61d6d6]"
  if (c === "dim")   return "text-[#767676]"
  return "text-[#cccccc]"
}

export default function CursorTerminal() {
  const { lines, typed, phase, scrollRef } = useTerminalAnimation()

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
              <span><Spinner /> {line.text}</span>
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
