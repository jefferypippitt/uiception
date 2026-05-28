"use client"

import { MousePointer2 } from "lucide-react"

import { cn } from "@/lib/utils"

import { GRID_DATA_ROW_REM } from "../lib/config"

type CursorProps = {
  x: number
  y: number
  pressed?: boolean
  /** Extra downward offset on top of half-row centering. */
  yNudgeRem?: number
  /** Data row track height — matches `gridTemplateRows` on compact layouts. */
  rowHeightRem?: number
  className?: string
}

export function Cursor({
  x,
  y,
  pressed,
  yNudgeRem = 0,
  rowHeightRem = GRID_DATA_ROW_REM,
  className,
}: CursorProps) {
  const rowCenterRem = rowHeightRem / 2 + yNudgeRem

  return (
    <MousePointer2
      aria-hidden
      strokeWidth={2}
      className={cn(
        "pointer-events-none absolute z-20 size-5",
        "fill-foreground stroke-background text-foreground",
        "[paint-order:stroke_fill]",
        "motion-safe:transition-[left,top,transform] motion-safe:duration-500 motion-safe:ease-out",
        className
      )}
      style={{
        left: `${x}%`,
        /* y = row top %; rem offset lands tip on row midpoint (+ optional nudge) */
        top: `calc(${y}% + ${rowCenterRem}rem)`,
        transform: `translate(-2px, -2px)${pressed ? " scale(0.92)" : ""}`,
      }}
    />
  )
}
