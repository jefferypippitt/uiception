"use client"

/**
 * Product surface: Command palette — `Connect an integration…` (⌘K).
 * Top bar: search input with `Search` glyph + `⌘K` kbd hint (the palette's input is the top bar).
 * Cursor: walks down rows, lands on the Supabase row (per SKILL § 5 · Cursor canvas).
 * Brand marks from `@/components/ui/svgs/*` (mandatory, per SKILL principle 8).
 * Accent (one element): purple `Connect` chip on the hovered row.
 */

import { ChevronRight, CornerDownLeft, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { GithubDark } from "@/components/ui/svgs/githubDark"
import { GithubLight } from "@/components/ui/svgs/githubLight"
import { Openai } from "@/components/ui/svgs/openai"
import { OpenaiDark } from "@/components/ui/svgs/openaiDark"
import { Supabase } from "@/components/ui/svgs/supabase"
import { Vercel } from "@/components/ui/svgs/vercel"
import { VercelDark } from "@/components/ui/svgs/vercelDark"

import { useFsv2IllustrationActive } from "../hooks/use-fsv2-illustration-active"
import {
  INTEGRATIONS,
  INTEGRATIONS_TARGET_IDX,
  useIntegrationsAnimation,
} from "../hooks/use-integrations-animation"
import { Cursor } from "./cursor"

import type { Integration } from "../hooks/use-integrations-animation"

/** `*Dark` SVGs use white fills — invisible on light `bg-card`. Pair with default/Light variants. */
function IntegrationBrandMark({ id }: { id: Integration["id"] }) {
  switch (id) {
    case "github":
      return (
        <>
          <GithubLight className="size-3.5 shrink-0 dark:hidden" aria-hidden />
          <GithubDark className="size-3.5 shrink-0 hidden dark:block" aria-hidden />
        </>
      )
    case "vercel":
      return (
        <>
          <Vercel className="size-3.5 shrink-0 dark:hidden" aria-hidden />
          <VercelDark className="size-3.5 shrink-0 hidden dark:block" aria-hidden />
        </>
      )
    case "supabase":
      return <Supabase className="size-3.5 shrink-0" aria-hidden />
    case "openai":
      return (
        <>
          <Openai className="size-3.5 shrink-0 dark:hidden" aria-hidden />
          <OpenaiDark className="size-3.5 shrink-0 hidden dark:block" aria-hidden />
        </>
      )
    default:
      return null
  }
}

/** Cursor x/y (% of body) per hovered row — rows are stacked evenly in the body */
function cursorForRow(idx: number, total: number) {
  const rowSpan = 100 / total
  return { x: 86, y: rowSpan * idx + rowSpan / 2 }
}

export default function IntegrationsIllustration() {
  const active = useFsv2IllustrationActive()
  const { hoverIdx, query, pressed, isResult } = useIntegrationsAnimation(active)

  const effectiveHover = isResult ? INTEGRATIONS_TARGET_IDX : hoverIdx
  const cursor =
    effectiveHover < 0
      ? { x: 8, y: 96 }
      : cursorForRow(effectiveHover, INTEGRATIONS.length)

  return (
    <div className="flex size-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      {/* Top bar = the palette's search input */}
      <header className="flex h-7 shrink-0 items-center gap-1.5 border-b border-border px-2.5">
        <Search className="size-3 shrink-0 text-muted-foreground" aria-hidden />
        <span
          className={cn(
            "min-w-0 flex-1 truncate font-mono text-[11px]",
            query ? "text-foreground" : "text-muted-foreground/70",
          )}
        >
          {query || "Connect an integration…"}
          <span className="ml-0.5 inline-block h-2.5 w-px align-middle bg-foreground/70 fsv2-caret" />
        </span>
        <kbd className="inline-flex h-4 shrink-0 items-center rounded-sm border border-border bg-muted px-1 font-mono text-[9px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </header>

      {/* Body — results list (relative, acts as cursor canvas) */}
      <div className="relative flex min-h-0 flex-1 flex-col py-1">
        {INTEGRATIONS.map((item, i) => {
          const hovered = effectiveHover === i
          const target = i === INTEGRATIONS_TARGET_IDX && isResult

          return (
            <div
              key={item.id}
              className={cn(
                "flex h-[22%] items-center gap-2 border-l-2 px-2.5 text-[11px] transition-colors",
                hovered
                  ? "border-foreground/40 bg-muted/60"
                  : "border-transparent",
              )}
            >
              <IntegrationBrandMark id={item.id} />
              <span className="min-w-0 truncate font-medium text-foreground">
                {item.name}
              </span>
              <span className="truncate text-[10px] text-muted-foreground">
                {item.kind}
              </span>

              {target ? (
                <span className="ml-auto inline-flex h-4 items-center gap-1 rounded-sm bg-purple-500/10 px-1.5 text-[10px] font-medium text-purple-500">
                  Connect
                  <ChevronRight className="size-2.5" aria-hidden />
                </span>
              ) : hovered ? (
                <ChevronRight
                  className="ml-auto size-3 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              ) : (
                <span className="ml-auto w-4 shrink-0" aria-hidden />
              )}
            </div>
          )
        })}

        <Cursor x={cursor.x} y={cursor.y} pressed={pressed} />
      </div>

      {/* Footer — keyboard hints */}
      <div className="flex h-6 shrink-0 items-center gap-2 border-t border-border px-2.5 text-[9px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <kbd className="inline-flex h-3.5 items-center gap-0.5 rounded-sm border border-border bg-muted px-1 font-mono text-[8px]">
            <span>↑</span><span>↓</span>
          </kbd>
          <span>Navigate</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <kbd className="inline-flex h-3.5 items-center rounded-sm border border-border bg-muted px-1 font-mono text-[8px]">
            <CornerDownLeft className="size-2.5" aria-hidden />
          </kbd>
          <span>Connect</span>
        </span>
        <span className="ml-auto tabular-nums">
          {INTEGRATIONS.length} sources
        </span>
      </div>
    </div>
  )
}
