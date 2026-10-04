"use client"

import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"

import { commandText, sessions, type Segment, type Tone } from "../lib/commands"

import "../styles/cta-section-v7.css"

const toneClass: Record<Tone, string> = {
  fg: "text-(--wt-fg)",
  cyan: "text-(--wt-cyan)",
  "bright-yellow": "text-(--wt-bright-yellow)",
}

function Segments({ segments }: { segments: Segment[] }) {
  return segments.map((segment, i) => (
    <span key={i} className={toneClass[segment.tone ?? "fg"]}>
      {segment.text}
    </span>
  ))
}

export default function WindowsTerminal({ className }: { className?: string }) {
  const [activeId, setActiveId] = useState(sessions[0].id)
  const [copied, setCopied] = useState(false)
  const active = sessions.find((session) => session.id === activeId) ?? sessions[0]

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(commandText(active))
      setCopied(true)
    } catch {
      // Clipboard can be blocked (insecure context, permissions); nothing to do.
    }
  }

  return (
    <div
      className={cn(
        "wt-window w-full min-w-0 overflow-hidden rounded-lg border border-(--wt-border) bg-(--wt-tabrow-bg)",
        className
      )}
    >
      {/* Tab row, Windows Terminal style */}
      <div className="wt-ui flex h-10 items-stretch select-none">
        <div
          role="tablist"
          aria-label="Install command"
          className="flex min-w-0 flex-1 items-end pl-2"
        >
          {sessions.map((session, i) => {
            const selected = session.id === activeId
            const nextSelected = sessions[i + 1]?.id === activeId

            return (
              <button
                key={session.id}
                type="button"
                role="tab"
                id={`wt-tab-${session.id}`}
                aria-selected={selected}
                aria-controls={`wt-panel-${session.id}`}
                onClick={() => {
                  setActiveId(session.id)
                  setCopied(false)
                }}
                className={cn(
                  "relative flex h-8 items-center rounded-t-lg px-4 text-xs",
                  selected
                    ? "wt-tab-selected z-10 bg-(--wt-term-bg) text-(--wt-tab-fg-selected)"
                    : "text-(--wt-tab-fg) hover:bg-(--wt-tab-hover)"
                )}
              >
                {session.title}
                {/* Separator between two unselected tabs */}
                {!selected && !nextSelected && i < sessions.length - 1 ? (
                  <span className="absolute top-2 right-0 h-4 w-px bg-(--wt-tab-sep)" />
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      {/* Terminal buffer: one prompt with the install command */}
      <div
        role="tabpanel"
        id={`wt-panel-${active.id}`}
        aria-labelledby={`wt-tab-${active.id}`}
        className="flex items-center gap-2 bg-(--wt-term-bg) py-3 pr-2 pl-3"
      >
        <code className="wt-mono min-w-0 flex-1 overflow-x-auto text-[13px] leading-tight whitespace-nowrap text-(--wt-fg) [scrollbar-width:none]">
          <span className="select-none">
            {active.prompt}{" "}
          </span>
          <Segments segments={active.command} />
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy command"}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-(--wt-bright-black) transition-colors hover:bg-(--wt-copy-hover) hover:text-(--wt-fg)"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
      </div>
    </div>
  )
}
