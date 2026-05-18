"use client"

import { MousePointer2 } from "lucide-react"

import { cn } from "@/lib/utils"

type CursorProps = {
  x: number
  y: number
  pressed?: boolean
  className?: string
}

export function Cursor({ x, y, pressed, className }: CursorProps) {
  return (
    <MousePointer2
      aria-hidden
      strokeWidth={2}
      className={cn(
        "pointer-events-none absolute z-20 size-3.5",
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
