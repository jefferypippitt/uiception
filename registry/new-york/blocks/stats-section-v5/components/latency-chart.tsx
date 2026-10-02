"use client"

import { type PointerEvent, useState } from "react"
import { Bar, BarChart, Cell, ReferenceLine, XAxis, YAxis } from "recharts"

import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

import {
  type Band,
  BAND_COLORS,
  BUCKET_MS,
  bucketOf,
  latencyBuckets,
  type Marker,
  P50_MS,
  P99_MS,
} from "../lib/config"

const chartConfig = {
  p50: { label: "Fast", color: BAND_COLORS.p50 },
  p99: { label: "Slower", color: BAND_COLORS.p99 },
  tail: { label: "Slowest 1%", color: BAND_COLORS.tail },
} satisfies ChartConfig

const BAR_OPACITY = 0.8
/** Bars outside the hovered bar's band fade to this opacity. */
const DIMMED = 0.2
/** Opacity of a reference line while the other one has focus. */
const MUTED_LINE = 0.2

const AXIS_TICKS = [0, 100, 200]
/** The hover handle starts on the median line, so the first hover slides out from it. */
const MEDIAN_INDEX = bucketOf(P50_MS) / BUCKET_MS
const peak = Math.max(...latencyBuckets.map((bucket) => bucket.requests))
/** Room above the tallest bar for the reference line labels. */
const HEADROOM = 1.3
/** Height recharts gives the x-axis, so the hover handle stops at the baseline. */
const AXIS_HEIGHT = 30
const BANDS: Band[] = ["p50", "p99", "tail"]
/** Buckets per band, so each strip segment spans exactly its bars. */
const bandWidths = BANDS.map(
  (band) => latencyBuckets.filter((bucket) => bucket.band === band).length
)

function AxisTick({
  x,
  y,
  payload,
}: {
  x?: number
  y?: number
  payload?: { value: number }
}) {
  const value = payload?.value ?? 0

  return (
    <text
      x={x}
      y={y}
      dy={14}
      textAnchor={value === 0 ? "start" : "middle"}
      className="fill-muted-foreground text-xs tabular-nums"
    >
      {value} ms
    </text>
  )
}

/** Vertical step between the two reference line labels, so they never overlap. */
const LABEL_ROW = 18

function MarkerLabel({
  viewBox,
  text,
  muted,
  side,
  row,
}: {
  viewBox?: { x?: number; y?: number }
  text: string
  muted: boolean
  /** Which side of its line the label sits on. */
  side: "right" | "left"
  row: number
}) {
  const x = viewBox?.x ?? 0
  const y = viewBox?.y ?? 0

  return (
    <text
      x={side === "right" ? x + 6 : x - 6}
      y={y + 4 + row * LABEL_ROW}
      textAnchor={side === "right" ? "start" : "end"}
      dominantBaseline="hanging"
      className={cn(
        "fill-foreground text-xs font-medium tabular-nums transition-opacity duration-300",
        muted && "opacity-20"
      )}
    >
      {text}
    </text>
  )
}

function formatShare(share: number) {
  return share >= 99 ? share.toFixed(1) : Math.round(share).toString()
}

function barOpacity(index: number, band: Band, activeIndex: number | null) {
  if (activeIndex === null) return BAR_OPACITY
  if (index === activeIndex) return 1
  const activeBand = latencyBuckets[activeIndex].band
  return band === activeBand ? BAR_OPACITY : DIMMED
}

export function LatencyChart({
  activeIndex,
  focus,
  onActiveChange,
  className,
}: {
  activeIndex: number | null
  focus: Marker | null
  onActiveChange: (index: number | null) => void
  className?: string
}) {
  // Keep the last hovered bucket so the label holds its text while it fades out.
  const [shownIndex, setShownIndex] = useState(MEDIAN_INDEX)
  if (activeIndex !== null && activeIndex !== shownIndex) {
    setShownIndex(activeIndex)
  }
  const shown = latencyBuckets[shownIndex]
  const handleLeft = ((shownIndex + 0.5) / latencyBuckets.length) * 100
  const flipLabel = handleLeft > 70

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    const index = Math.floor(ratio * latencyBuckets.length)
    onActiveChange(Math.min(Math.max(index, 0), latencyBuckets.length - 1))
  }

  return (
    <div
      className={cn("relative h-full w-full touch-pan-y", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => onActiveChange(null)}
    >
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-full w-full [&_.recharts-bar-rectangle_path]:transition-[fill-opacity] [&_.recharts-bar-rectangle_path]:duration-300 [&_.recharts-reference-line_line]:transition-[stroke-opacity] [&_.recharts-reference-line_line]:duration-300"
      >
        <BarChart
          data={latencyBuckets}
          margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
          barCategoryGap={2}
        >
          <XAxis
            dataKey="ms"
            ticks={AXIS_TICKS}
            interval={0}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            height={AXIS_HEIGHT}
            tick={<AxisTick />}
          />
          <YAxis hide domain={[0, peak * HEADROOM]} />
          <Bar
            dataKey="requests"
            radius={[2, 2, 0, 0]}
            animationDuration={900}
            animationEasing="ease-out"
          >
            {latencyBuckets.map((bucket, index) => (
              <Cell
                key={bucket.ms}
                fill={`var(--color-${bucket.band})`}
                fillOpacity={barOpacity(index, bucket.band, activeIndex)}
              />
            ))}
          </Bar>
          <ReferenceLine
            x={bucketOf(P50_MS)}
            stroke="var(--foreground)"
            strokeDasharray="4 4"
            strokeOpacity={focus === "p99" ? MUTED_LINE : 1}
            label={
              <MarkerLabel
                text={`Typical · ${P50_MS} ms`}
                muted={focus === "p99"}
                side="right"
                row={0}
              />
            }
          />
          <ReferenceLine
            x={bucketOf(P99_MS)}
            stroke="var(--foreground)"
            strokeDasharray="4 4"
            strokeOpacity={focus === "p50" ? MUTED_LINE : 1}
            label={
              <MarkerLabel
                text={`99% under ${P99_MS} ms`}
                muted={focus === "p50"}
                side="left"
                row={1}
              />
            }
          />
        </BarChart>
      </ChartContainer>

      {/* Speed strip along the axis, so the thin red tail stays visible. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 flex h-[3px]"
        style={{ bottom: AXIS_HEIGHT - 4 }}
      >
        {BANDS.map((band, index) => (
          <span
            key={band}
            className={cn(
              "h-full transition-opacity duration-300",
              activeIndex !== null &&
                latencyBuckets[activeIndex].band !== band &&
                "opacity-20"
            )}
            style={{
              flexGrow: bandWidths[index],
              backgroundColor: BAND_COLORS[band],
            }}
          />
        ))}
      </div>

      <div
        className={cn(
          "pointer-events-none absolute top-0 border-l border-foreground transition-[left,opacity] duration-200 ease-out",
          activeIndex === null ? "opacity-0" : "opacity-100"
        )}
        style={{ left: `${handleLeft}%`, bottom: AXIS_HEIGHT }}
      >
        <div
          className={cn(
            "absolute top-14 flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-foreground tabular-nums shadow-sm",
            flipLabel ? "right-2" : "left-2"
          )}
        >
          <span
            aria-hidden
            className="size-2 rounded-full transition-colors duration-200"
            style={{ backgroundColor: BAND_COLORS[shown.band] }}
          />
          {formatShare(shown.doneBy)}% under {shown.ms + BUCKET_MS} ms
        </div>
      </div>
    </div>
  )
}
