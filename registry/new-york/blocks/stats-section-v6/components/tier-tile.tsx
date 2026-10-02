import { cn } from "@/lib/utils"

import { type Group, zoomWindow } from "../lib/config"
import { MiniWaffle } from "./mini-waffle"

export type TileSize = "feature" | "wide" | "compact"

const tileClass = "flex flex-col justify-between gap-6 bg-background p-5"

const valueClass =
  "leading-none font-semibold tracking-tight text-foreground tabular-nums"

function TileLabel({ group, className }: { group: Group; className?: string }) {
  return (
    <dt className={cn("flex flex-col text-base", className)}>
      <span className="font-medium text-foreground">{group.channel}</span>
      <span className="text-muted-foreground">{group.wait}</span>
    </dt>
  )
}

export function TierTile({
  group,
  groupIndex,
  size,
  className,
}: {
  group: Group
  groupIndex: number
  size: TileSize
  className?: string
}) {
  if (size === "wide") {
    return (
      // On desktop the tile is a two-column grid: label above value on the
      // left, chart on the right. The chart column shrinks before it can
      // overlap the label. `md:contents` lets the dd's children join the grid.
      <div
        className={cn(
          tileClass,
          "md:grid md:grid-cols-[auto_minmax(0,1fr)] md:grid-rows-[auto_1fr] md:gap-x-6",
          className
        )}
      >
        <TileLabel group={group} className="md:col-start-1 md:row-start-1" />
        <dd className="flex items-center justify-between gap-6 md:contents">
          <span
            className={cn(
              valueClass,
              "text-4xl md:col-start-1 md:row-start-2 md:self-end md:text-5xl"
            )}
          >
            {group.share}%
          </span>
          <MiniWaffle
            groupIndex={groupIndex}
            className="w-44 gap-[3px] md:col-start-2 md:row-span-2 md:row-start-1 md:w-full md:max-w-44 md:self-center md:justify-self-end"
          />
        </dd>
      </div>
    )
  }

  // The feature and compact tiles read top to bottom: label, grid, value.
  // Their values sit on the bottom edge, so they line up across the row.
  // The compact tiles hold too few squares to read in a full grid, so they
  // draw only the band of rows that holds them, at full tile width.
  const isFeature = size === "feature"

  return (
    <div className={cn(tileClass, className)}>
      <TileLabel group={group} />
      <dd
        className={cn(
          "flex gap-6 md:flex-1 md:flex-col md:items-start",
          isFeature
            ? "flex-row-reverse items-center justify-between"
            : "flex-col"
        )}
      >
        <span className="flex w-full items-center md:flex-1">
          {isFeature ? (
            <MiniWaffle
              groupIndex={groupIndex}
              className="ml-auto w-44 max-w-full gap-[3px] md:ml-0 md:w-64"
            />
          ) : (
            <MiniWaffle
              groupIndex={groupIndex}
              rows={zoomWindow(groupIndex)}
              className="-mx-2 w-[calc(100%+1rem)] gap-[2px]"
            />
          )}
        </span>
        <span
          className={cn(
            valueClass,
            "shrink-0",
            isFeature ? "text-5xl md:text-6xl" : "text-3xl md:text-4xl"
          )}
        >
          {group.share}%
        </span>
      </dd>
    </div>
  )
}
