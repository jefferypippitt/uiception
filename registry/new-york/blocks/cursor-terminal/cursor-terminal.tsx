"use client"

import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Plus,
  Terminal,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

import { useTerminalAnimation } from "./use-terminal-animation"
import Spinner from "./spinner"
import PromptShell from "./prompt-shell"
import PanelIconButton from "./panel-icon-button"
import { ICON_SM, ICON_XS, PANEL_TABS, type LineColor } from "./config"

import "./cursor-terminal.css"

function colorCls(c?: LineColor) {
  if (c === "green") return "text-[#16c60c]"
  if (c === "cyan") return "text-[#61d6d6]"
  if (c === "dim") return "text-[#767676]"
  return "text-[#cccccc]"
}

function renderFirstStepCommand(text: string) {
  const npxToken = "npx"
  const commandPrefix = "npx shadcn@latest add "

  if (!text.startsWith(npxToken)) {
    return <span className="min-w-0">{text}</span>
  }

  const npxEnd = npxToken.length
  const argStart = commandPrefix.length

  return (
    <span className="min-w-0">
      <span className="text-[#dcdcaa]">{npxToken}</span>
      {text.slice(npxEnd, Math.min(text.length, argStart))}
      {text.length > argStart && (
        <span className="text-[#4fc1ff]">{text.slice(argStart)}</span>
      )}
    </span>
  )
}

export default function CursorTerminal({ className }: { className?: string }) {
  const { lines, prompt, scrollRef } = useTerminalAnimation()

  return (
    <div
      className={cn(
        "crt-terminal mx-auto w-full max-w-3xl min-w-0 overflow-hidden rounded-md border border-white/10 bg-[#1e1e1e] font-mono shadow-[0_20px_40px_-12px_rgb(0_0_0/0.4)]",
        className
      )}
    >
      <div className="flex h-9 min-h-9 items-stretch border-b border-white/6 bg-[#252526] select-none">
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
                  "shrink-0 border-t border-t-transparent px-3 text-[10px] transition-colors",
                  active
                    ? "border-t-[#007fd4] bg-[#1e1e1e] text-[#e8e8e8]"
                    : "text-[#858585] hover:text-[#c0c0c0]"
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
            className="flex h-7 items-center gap-1 rounded px-1.5 text-[10px] text-[#cccccc] transition-colors hover:bg-white/6"
          >
            <Terminal className={cn(ICON_SM, "text-[#3b8eea]")} aria-hidden />
            <span className="max-w-22 truncate sm:max-w-none">powershell</span>
            <ChevronDown
              className={cn(ICON_XS, "text-[#858585]")}
              aria-hidden
            />
          </button>
          <PanelIconButton
            label="New terminal"
            className="w-auto min-w-7 gap-0.5 px-1"
          >
            <Plus className={ICON_SM} aria-hidden />
            <ChevronDown
              className={cn(ICON_XS, "text-[#a0a0a0]")}
              aria-hidden
            />
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
        className="crt-body h-88 overflow-y-auto bg-[#1e1e1e] px-3.5 py-2 text-left font-mono text-[11px] leading-[1.45] text-[#cccccc] [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {lines.map((line) =>
          line.promptLine ? (
            <div key={line.id}>
              <div className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0">
                <PromptShell dot={line.dot ?? "grey"} showPath />
                {renderFirstStepCommand(line.text)}
              </div>
            </div>
          ) : (
            <div
              key={line.id}
              className={cn("crt-line-in", colorCls(line.color))}
            >
              {line.spinning ? (
                <span>
                  <Spinner /> {line.text}
                </span>
              ) : (
                line.text || "\u00A0"
              )}
            </div>
          )
        )}

        {prompt.showPrompt && (
          <div
            className={cn(
              "flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0",
              prompt.animateIn && "crt-line-in"
            )}
          >
            <PromptShell dot={prompt.dot} showPath={prompt.showPath} />
            {prompt.typed && (
              <span className={cn("min-w-0", prompt.pasteIn && "crt-paste-in")}>
                {renderFirstStepCommand(prompt.typed)}
              </span>
            )}
            {prompt.cursor && (
              <span
                className="crt-cursor ml-px inline-block h-[1em] w-2 translate-y-px bg-[#cccccc] align-text-bottom"
                aria-hidden
              />
            )}
          </div>
        )}
      </div>

      <div className="border-t border-white/6 bg-[#1e1e1e] py-1.5 text-center text-[10px] text-[#6e6e6e]">
        Ctrl+K to generate command
      </div>
    </div>
  )
}
