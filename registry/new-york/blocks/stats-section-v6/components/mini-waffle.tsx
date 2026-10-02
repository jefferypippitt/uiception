import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

import { cellOrder, cells, GRID_SIZE, groups } from "../lib/config"

/** Delay between lit squares in the fill-in, in milliseconds. */
const FILL_STEP_MS = 10
/** Delay per diagonal step in the breathing shimmer, in milliseconds. */
const SHIMMER_STEP_MS = 120

export type RowWindow = { start: number; count: number }

/**
 * A 10-column grid that lights only one group's squares, in the same spots
 * they hold in the full 100. Laid side by side, the four grids add up to one
 * chart. `rows` draws only a band of rows, for groups too small to read in
 * the full grid.
 */
export function MiniWaffle({
  groupIndex,
  rows = { start: 0, count: GRID_SIZE },
  className,
}: {
  groupIndex: number
  rows?: RowWindow
  className?: string
}) {
  const color = groups[groupIndex].color
  const first = rows.start * GRID_SIZE
  const visible = cells.slice(first, first + rows.count * GRID_SIZE)

  return (
    <div aria-hidden className={cn("shrink-0", className)}>
      <div className="grid grid-cols-10 gap-[inherit]">
        {visible.map((cellGroup, offset) => {
          const index = first + offset

          if (cellGroup !== groupIndex) {
            return (
              <span
                key={index}
                className="aspect-square rounded-[2px] bg-muted"
              />
            )
          }

          return (
            <span
              key={index}
              className="ssv6-dot aspect-square rounded-[2px]"
              style={
                {
                  backgroundColor: color,
                  "--ssv6-fill-delay": `${cellOrder[index] * FILL_STEP_MS}ms`,
                  "--ssv6-shimmer-delay": `${
                    ((index % GRID_SIZE) + Math.floor(index / GRID_SIZE)) *
                    SHIMMER_STEP_MS
                  }ms`,
                } as CSSProperties
              }
            />
          )
        })}
      </div>
    </div>
  )
}
