"use client"

import { useState, type ReactNode } from "react"
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Plus,
  Terminal,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  SoundPreferenceProvider,
  useSoundPreference,
} from "@/contexts/sound-preference"
import { playSound } from "@/lib/sound-engine"
import { switchOffSound } from "@/lib/switch-off"
import { switchOnSound } from "@/lib/switch-on"

import { useTerminalAnimation } from "@/registry/new-york/blocks/cursor-terminal/hooks/use-terminal-animation"
import Spinner from "@/registry/new-york/blocks/cursor-terminal/components/spinner"
import PromptShell from "@/registry/new-york/blocks/cursor-terminal/components/prompt-shell"
import { ICON_SM, ICON_XS, type Line, type LineColor } from "@/registry/new-york/blocks/cursor-terminal/lib/config"
import dynamic from "next/dynamic"
import TrexRunner from "./trex-runner"
const Wordle = dynamic(() => import("./wordle"), { ssr: false })
import ReactionTime from "./reaction-time"
import ColorMemory from "./color-memory"
import SequenceMemory from "./sequence-memory"

import "@/registry/new-york/blocks/cursor-terminal/styles/cursor-terminal.css"
import "./cursor-terminal.css"

const PANEL_TABS = [
  "Terminal",
  "Trex Runner",
  "Wordle",
  "Reaction Time",
  "Color Memory",
  "Sequence Memory",
] as const

function colorCls(c?: LineColor) {
  if (c === "green") return "text-(--crt-t-line-green)"
  if (c === "cyan") return "text-(--crt-t-line-cyan)"
  if (c === "dim") return "text-(--crt-t-line-dim)"
  return "text-(--crt-t-line-default)"
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
      <span className="text-(--crt-t-syntax-kw)">{npxToken}</span>
      {text.slice(npxEnd, Math.min(text.length, argStart))}
      {text.length > argStart && (
        <span className="text-(--crt-t-syntax-arg)">{text.slice(argStart)}</span>
      )}
    </span>
  )
}

function HomepagePanelIconButton({
  children,
  label,
  hoverDanger,
  className,
  onClick,
  ariaPressed,
  tabIndex = -1,
}: {
  children: ReactNode
  label: string
  hoverDanger?: boolean
  className?: string
  onClick?: () => void
  ariaPressed?: boolean | "mixed"
  tabIndex?: number
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={ariaPressed}
      tabIndex={tabIndex}
      onClick={onClick}
      className={cn(
        "flex size-7 items-center justify-center rounded text-(--crt-t-icon-fg) transition-colors hover:bg-(--crt-t-hover-bg)",
        hoverDanger && "hover:bg-(--crt-t-close-hover-bg) hover:text-white",
        className,
      )}
    >
      {children}
    </button>
  )
}

function TerminalSoundToggle() {
  const { soundEnabled, setSoundEnabled } = useSoundPreference()

  return (
    <HomepagePanelIconButton
      label={soundEnabled ? "Mute game sounds" : "Unmute game sounds"}
      ariaPressed={soundEnabled}
      tabIndex={0}
      onClick={() => {
        if (soundEnabled) {
          void playSound(switchOffSound.dataUri, { volume: 0.32 })
          setSoundEnabled(false)
        } else {
          setSoundEnabled(true)
          queueMicrotask(() => {
            void playSound(switchOnSound.dataUri, { volume: 0.32 })
          })
        }
      }}
    >
      {soundEnabled ? (
        <Volume2 className={ICON_SM} aria-hidden />
      ) : (
        <VolumeX className={ICON_SM} aria-hidden />
      )}
    </HomepagePanelIconButton>
  )
}

export function CursorTerminal() {
  const { lines, prompt, scrollRef } = useTerminalAnimation()
  const [activeTab, setActiveTab] = useState<string>("Terminal")

  return (
    <SoundPreferenceProvider>
    <div className="crt-terminal crt-terminal-vercel w-full overflow-hidden rounded-md border border-(--crt-t-border) bg-(--crt-t-shell-bg) shadow-(--crt-t-shadow)">
      <div className="flex h-9 min-h-9 select-none items-stretch border-b border-(--crt-t-titlebar-border) bg-(--crt-t-titlebar-bg)">
        <div className="flex min-w-0 flex-1 items-stretch overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {PANEL_TABS.map((name) => {
            const active = name === activeTab
            return (
              <button
                key={name}
                type="button"
                onClick={() => setActiveTab(name)}
                className={cn(
                  "shrink-0 px-3 text-[10px] transition-colors",
                  active
                    ? "bg-(--crt-t-tab-active-bg) text-(--crt-t-tab-active-fg)"
                    : "text-(--crt-t-tab-inactive-fg) hover:text-(--crt-t-tab-hover-fg)",
                )}
              >
                {name}
              </button>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-px pr-1 pl-2">
          <TerminalSoundToggle />
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="flex h-7 items-center gap-1 rounded px-1.5 text-[10px] text-(--crt-t-shell-fg) transition-colors hover:bg-(--crt-t-hover-bg)"
          >
            <Terminal className={cn(ICON_SM, "text-(--crt-t-terminal-icon)")} aria-hidden />
            <span className="max-w-22 truncate sm:max-w-none">powershell</span>
            <ChevronDown className={cn(ICON_XS, "text-(--crt-t-icon-muted)")} aria-hidden />
          </button>
          <HomepagePanelIconButton label="New terminal" className="w-auto min-w-7 gap-0.5 px-1">
            <Plus className={ICON_SM} aria-hidden />
            <ChevronDown className={cn(ICON_XS, "text-(--crt-t-icon-subtle)")} aria-hidden />
          </HomepagePanelIconButton>
          <HomepagePanelIconButton label="More">
            <MoreHorizontal className={ICON_SM} aria-hidden />
          </HomepagePanelIconButton>
          <HomepagePanelIconButton label="Maximize panel">
            <ChevronUp className={ICON_SM} aria-hidden />
          </HomepagePanelIconButton>
          <HomepagePanelIconButton label="Close panel" hoverDanger>
            <X className={ICON_SM} aria-hidden />
          </HomepagePanelIconButton>
        </div>
      </div>

      {/* Wordle stays mounted to avoid re-firing the submit-gate server action on every tab switch */}
      <div className={activeTab !== "Wordle" ? "hidden" : ""}>
        <Wordle isActive={activeTab === "Wordle"} />
      </div>

      {activeTab === "Trex Runner" ? (
        <TrexRunner />
      ) : activeTab === "Reaction Time" ? (
        <ReactionTime />
      ) : activeTab === "Color Memory" ? (
        <ColorMemory />
      ) : activeTab === "Sequence Memory" ? (
        <SequenceMemory />
      ) : activeTab !== "Wordle" ? (
        <>
          <div
            ref={scrollRef}
            className="crt-body h-88 overflow-y-auto bg-(--crt-t-body-bg) px-3.5 py-2 text-left font-mono text-[11px] leading-[1.45] text-(--crt-t-body-fg)"
            style={{ scrollbarWidth: "none" }}
          >
            {lines.map((line: Line) => (
              line.promptLine ? (
                <div key={line.id}>
                  <div className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0">
                    <PromptShell dot={line.dot ?? "grey"} showPath />
                    {renderFirstStepCommand(line.text)}
                  </div>
                </div>
              ) : (
                <div key={line.id} className={cn("crt-line-in", colorCls(line.color))}>
                  {line.spinning ? (
                    <span><Spinner /> {line.text}</span>
                  ) : (
                    line.text || "\u00A0"
                  )}
                </div>
              )
            ))}

            {prompt.showPrompt && (
              <div className={cn("flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0", prompt.animateIn && "crt-line-in")}>
                <PromptShell dot={prompt.dot} showPath={prompt.showPath} />
                {prompt.typed && (
                  <span className={cn("min-w-0", prompt.pasteIn && "crt-paste-in")}>
                    {renderFirstStepCommand(prompt.typed)}
                  </span>
                )}
                {prompt.cursor && <span className="crt-cursor" />}
              </div>
            )}
          </div>

          <div className="border-t border-(--crt-t-titlebar-border) bg-(--crt-t-body-bg) py-1.5 text-center text-[10px] text-(--crt-t-footer-fg)">
            Ctrl+K to generate command
          </div>
        </>
      ) : null}
    </div>
    </SoundPreferenceProvider>
  )
}
