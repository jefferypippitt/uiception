"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

import { useCountUp } from "../hooks/use-count-up"
import { BRANDS, formatInt, type SeriesData, type SeriesId } from "../lib/series"
import { StatCell } from "./stat-cell"

function BrandIcon({ id, className }: { id: SeriesId; className?: string }) {
  const brand = BRANDS.find((b) => b.id === id) ?? BRANDS[0]
  const Icon = brand.Icon
  const DarkIcon = brand.DarkIcon

  if (Icon === DarkIcon) {
    return <Icon className={className} aria-hidden />
  }

  return (
    <span className={cn("relative flex shrink-0", className)}>
      <Icon className="h-full w-full dark:hidden" aria-hidden />
      <DarkIcon
        className="absolute inset-0 hidden h-full w-full dark:block"
        aria-hidden
      />
    </span>
  )
}

export default function DownloadsPanel({
  seriesData,
}: {
  seriesData: SeriesData[]
}) {
  const [seriesId, setSeriesId] = React.useState<SeriesId>(BRANDS[0].id)
  const anchorRef = useComboboxAnchor()
  const gradientId = "ssv2-area-gradient"

  const activeBrand = BRANDS.find((b) => b.id === seriesId) ?? BRANDS[0]
  const activeData = seriesData.find((d) => d.id === seriesId) ?? {
    id: seriesId,
    total: 0,
    weeklyDownloads: 0,
    stars: 0,
    contributors: 0,
    points: [],
  }

  const lastI = Math.max(activeData.points.length - 1, 1)

  const chartConfig = React.useMemo<ChartConfig>(
    () => ({ v: { label: "Cumulative Downloads", color: activeBrand.color } }),
    [activeBrand.color]
  )

  const total = useCountUp(activeData.total)
  const weekly = useCountUp(activeData.weeklyDownloads)
  const stars = useCountUp(activeData.stars)
  const contributors = useCountUp(activeData.contributors)

  const motion = (blur: number): React.CSSProperties =>
    blur > 0
      ? {
          filter: `blur(${blur.toFixed(2)}px)`,
          transform: `translate3d(0, ${(-blur * 0.35).toFixed(2)}px, 0)`,
          willChange: "filter, transform",
        }
      : {}

  return (
    <div
      className={cn(
        "mt-10 grid overflow-hidden border border-border/80 bg-background",
        "md:grid-cols-2"
      )}
    >
      <div className="flex flex-col justify-center gap-3 border-b border-border/80 p-6 md:border-r md:border-b-0 md:p-10">
        <p className="text-sm font-medium text-muted-foreground">
          Total downloads
        </p>
        <p
          className="text-4xl font-semibold tracking-tighter tabular-nums sm:text-5xl md:text-6xl lg:text-7xl"
          style={motion(total.blur)}
        >
          {formatInt(total.value)}
        </p>
      </div>

      <div className="flex flex-col gap-5 border-b border-border/80 p-6 md:border-b-0 md:p-10">
        <Combobox
          value={seriesId}
          onValueChange={(v) => {
            if (BRANDS.some((b) => b.id === v)) {
              setSeriesId(v as SeriesId)
            }
          }}
        >
          <div ref={anchorRef} className="w-fit">
            <ComboboxTrigger
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-full border border-border/80 bg-muted/30 px-3 text-sm font-medium",
                "shadow-xs transition-colors outline-none hover:bg-muted/50",
                "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              )}
            >
              <BrandIcon id={seriesId} className="size-4" />
              <ComboboxValue>
                {(val) =>
                  BRANDS.find((b) => b.id === val)?.label ?? "Pick package"
                }
              </ComboboxValue>
            </ComboboxTrigger>
          </div>

          <ComboboxContent anchor={anchorRef} className="min-w-56 p-0">
            <ComboboxList className="p-1">
              {BRANDS.map((brand) => (
                <ComboboxItem key={brand.id} value={brand.id}>
                  <BrandIcon id={brand.id} className="size-4" />
                  {brand.label}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[220px] w-full md:h-[260px]"
        >
          <AreaChart
            accessibilityLayer
            data={activeData.points}
            margin={{ left: 0, right: 4, top: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-v)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-v)"
                  stopOpacity={0.03}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              className="stroke-border/40"
            />
            <XAxis
              dataKey="i"
              type="number"
              domain={[0, lastI]}
              ticks={[0, lastI]}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(v) => (v === 0 ? "18mo ago" : "Today")}
              className="text-xs"
            />
            <YAxis hide domain={["auto", "auto"]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel indicator="line" />}
            />
            <Area
              name="Downloads"
              dataKey="v"
              type="monotone"
              fill={`url(#${gradientId})`}
              stroke="var(--color-v)"
              strokeWidth={2}
              isAnimationActive
            />
          </AreaChart>
        </ChartContainer>
      </div>

      <div className="col-span-full grid divide-border/80 border-t border-border/80 sm:grid-cols-3 sm:divide-x">
        <StatCell
          value={formatInt(weekly.value)}
          label="Weekly npm downloads"
          valueStyle={motion(weekly.blur)}
        />
        <StatCell
          value={formatInt(stars.value)}
          label="GitHub stars"
          valueStyle={motion(stars.blur)}
        />
        <StatCell
          value={formatInt(contributors.value)}
          label="Contributors"
          valueStyle={motion(contributors.blur)}
        />
      </div>
    </div>
  )
}
