"use client"

import { MousePointer2 } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Shared cursor primitive (per `.claude/skills/illustrations/SKILL.md` § 5 · Cursor canvas).
 * Positioned with percentages so it follows the card body's layout without magic pixel values.
 *
 * Theme compatibility: the arrow is `fill-foreground` (dark in light mode, light in dark mode)
 * and gets a `stroke-background` outline (2px) so it stays readable on `bg-card`, `bg-muted`
 * hover rows, and any accent chip beneath it — no hard-coded black/white.
 */
type CursorProps = {
  /** 0–100, as a percentage of the cursor canvas */
  x: number
  y: number
  /** `true` while the phase is a click — scales the cursor down briefly */
  pressed?: boolean
  className?: string
}

export function Cursor({ x, y, pressed, className }: CursorProps) {
  return (
    <MousePointer2
      aria-hidden
      strokeWidth={2}
      className={cn(
        "pointer-events-none absolute z-10 size-3.5",
        "fill-foreground stroke-background text-foreground",
        "[paint-order:stroke_fill]",
        "motion-safe:transition-[left,top,transform] motion-safe:duration-500 motion-safe:ease-out",
        className,
      )}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-2px, -2px)${pressed ? " scale(0.92)" : ""}`,
      }}
    />
  )
}
