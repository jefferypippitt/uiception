"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  type ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { useFsv2IllustrationActive } from "../hooks/use-fsv2-illustration-active"
import { useAnalyticsAnimation } from "../hooks/use-analytics-animation"

export default function AnalyticsIllustration() {
  const active = useFsv2IllustrationActive()
  const { phase, view, users, config, isResult } = useAnalyticsAnimation(active)
  const showChart = phase === "acting" || phase === "result" || phase === "holding"

  const chartConfig = {
    v: { label: "Sessions", color: config.color },
  } satisfies ChartConfig

  return (
    <div className="flex size-full flex-col overflow-hidden rounded-lg border border-border bg-card px-2.5 pt-2.5 pb-2">
      <div className="mb-1.5 flex shrink-0 items-baseline gap-2">
        <span className="font-mono text-[18px] font-semibold leading-none tabular-nums text-foreground">
          {users.toLocaleString()}
        </span>
        {isResult && (
          <span className="inline-flex items-center gap-0.5 rounded-sm bg-muted px-1 py-px text-[10px] font-medium tabular-nums text-foreground">
            <TrendingUp className="size-2.5" aria-hidden />
            {config.trend}
          </span>
        )}
        <span className="ml-auto text-[10px] text-muted-foreground">{config.label}</span>
      </div>

      <ChartContainer
        id="fsv2-analytics"
        key={view}
        config={chartConfig}
        className="aspect-auto size-full"
      >
        <AreaChart
          data={config.series as unknown as Array<{ day: string; v: number }>}
          margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
        >
          <defs>
            <linearGradient id="fsv2-analytics-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-v)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--color-v)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            strokeDasharray="2 4"
            className="stroke-border/70"
          />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            height={14}
            padding={{ left: 6, right: 6 }}
            tick={{ fontSize: 9, fill: "currentColor" }}
            className="fill-muted-foreground text-muted-foreground"
            interval={0}
          />
          <YAxis hide domain={["dataMin - 1500", "dataMax + 500"]} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                labelClassName="text-[10px]"
                className="px-2 py-1 text-[10px]"
              />
            }
          />
          {showChart && (
            <Area
              dataKey="v"
              type="monotone"
              stroke="var(--color-v)"
              strokeWidth={1.5}
              fill="url(#fsv2-analytics-fill)"
              isAnimationActive
              animationDuration={700}
              animationEasing="ease-out"
              dot={false}
              activeDot={{ r: 2.5 }}
            />
          )}
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
