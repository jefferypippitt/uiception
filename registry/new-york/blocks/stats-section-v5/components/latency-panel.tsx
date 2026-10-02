"use client"

import { useState } from "react"

import { BAND_COLORS, latencyBuckets, markerFor, stats } from "../lib/config"
import { LatencyChart } from "./latency-chart"

export default function LatencyPanel() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const focus =
    activeIndex === null ? null : markerFor(latencyBuckets[activeIndex].band)

  return (
    <>
      <div
        aria-hidden
        className="mt-12 h-56 text-muted-foreground sm:h-64 md:mt-16 md:h-80"
      >
        <LatencyChart
          activeIndex={activeIndex}
          focus={focus}
          onActiveChange={setActiveIndex}
        />
      </div>

      <dl className="mt-12 grid grid-cols-2 border-t border-l border-border md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex flex-col gap-2 border-r border-b border-border p-4 md:p-6"
          >
            <dt className="flex items-start gap-2 text-sm text-muted-foreground">
              {stat.marker && (
                <span
                  aria-hidden
                  className="mt-2.5 w-4 shrink-0 border-t-2 border-dashed"
                  style={{ borderColor: BAND_COLORS[stat.marker] }}
                />
              )}
              {stat.label}
            </dt>
            <dd className="text-3xl font-semibold tracking-tight text-foreground tabular-nums md:text-4xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </>
  )
}
