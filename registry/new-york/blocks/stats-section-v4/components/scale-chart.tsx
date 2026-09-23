"use client"

import * as React from "react"
import { Bar, ComposedChart, Line, XAxis, YAxis } from "recharts"

import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

import { CHART_COLOR, weeklyInstalls } from "../lib/config"

const chartConfig = {
  installs: { label: "Installs", color: CHART_COLOR },
} satisfies ChartConfig

const peak = Math.max(...weeklyInstalls.map((point) => point.installs))

export function ScaleChart({ className }: { className?: string }) {
  const gradientId = `ssv4-bars-${React.useId().replace(/:/g, "")}`

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("aspect-auto h-full w-full", className)}
    >
      <ComposedChart
        data={weeklyInstalls}
        margin={{ left: 0, right: 0, top: 32, bottom: 0 }}
        barCategoryGap={0}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-installs)"
              stopOpacity={0.35}
            />
            <stop
              offset="100%"
              stopColor="var(--color-installs)"
              stopOpacity={0.03}
            />
          </linearGradient>
        </defs>
        <XAxis dataKey="week" hide />
        <YAxis hide domain={[0, peak]} />
        <Bar
          dataKey="installs"
          fill={`url(#${gradientId})`}
          barSize={1}
          isAnimationActive={false}
        />
        <Line
          dataKey="installs"
          type="monotone"
          stroke="var(--color-installs)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ChartContainer>
  )
}
