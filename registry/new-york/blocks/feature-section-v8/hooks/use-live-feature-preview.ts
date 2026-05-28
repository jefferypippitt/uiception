"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import {
  jitterIntervalMs,
  tickInitialDelayMs,
  tickIntervalMs,
} from "../lib/animation-timing"
import type { MiniAppScreenZone } from "../lib/build-feature-preview"

function randomBarHeight(): number {
  return 28 + Math.floor(Math.random() * 72)
}

function jitterLiveStreamBar(
  zone: Extract<MiniAppScreenZone, { type: "live-stream" }>,
  barIndex: number
): Extract<MiniAppScreenZone, { type: "live-stream" }> {
  const bars = zone.bars.slice()
  bars[barIndex] = randomBarHeight()
  return { ...zone, bars }
}

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
  mq.addEventListener("change", onStoreChange)
  return () => mq.removeEventListener("change", onStoreChange)
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function getReducedMotionServer() {
  return false
}

export type LiveFeaturePreview = {
  zone: MiniAppScreenZone
  pulseKey: number
  activeNodeIndex: number
  activeRowIndex: number
}

function tickBars(bars: ReadonlyArray<number>): number[] {
  const next = bars.slice(1)
  next.push(28 + Math.floor(Math.random() * 72))
  return next
}

function tickLiveStream(
  zone: Extract<MiniAppScreenZone, { type: "live-stream" }>
): Extract<MiniAppScreenZone, { type: "live-stream" }> {
  const runStat = zone.stats[0]
  const latencyStat = zone.stats[1]
  const runValue = Number.parseInt(runStat.value.replace(/\D/g, ""), 10) || 600
  const latencyValue = Number.parseFloat(latencyStat.value.replace(/[^\d.]/g, "")) || 2

  const nextLatency = Math.min(
    9.9,
    Math.max(1.0, latencyValue + (Math.random() - 0.5) * 0.35)
  )

  return {
    ...zone,
    stats: [
      {
        ...runStat,
        value: `${runValue + 4 + Math.floor(Math.random() * 14)}`,
      },
      {
        ...latencyStat,
        value: `${nextLatency.toFixed(1)}s`,
      },
    ],
    bars: tickBars(zone.bars),
  }
}

function tickSignalFlow(
  zone: Extract<MiniAppScreenZone, { type: "signal-flow" }>
): Extract<MiniAppScreenZone, { type: "signal-flow" }> {
  return {
    ...zone,
    nodes: zone.nodes.map((node) => ({
      ...node,
      volume: Math.max(6, node.volume + Math.floor(Math.random() * 11) - 4),
    })),
    dotGrid: zone.dotGrid.map((row) =>
      row.map((active) => (Math.random() > 0.78 ? !active : active))
    ),
  }
}

function tickHealthSplit(
  zone: Extract<MiniAppScreenZone, { type: "health-split" }>
): Extract<MiniAppScreenZone, { type: "health-split" }> {
  const depthMetric = zone.metrics[0]
  const uptimeMetric = zone.metrics[1]
  const depth = Number.parseInt(depthMetric.value, 10) || 20
  const uptime = Number.parseFloat(uptimeMetric.value.replace(/[^\d.]/g, "")) || 97
  const nextUptime = Math.min(
    99.9,
    Math.max(95.0, uptime + (Math.random() > 0.55 ? -0.1 : 0.06))
  )

  return {
    ...zone,
    metrics: [
      {
        ...depthMetric,
        value: `${Math.max(6, depth + Math.floor(Math.random() * 5) - 2)}`,
      },
      {
        ...uptimeMetric,
        value: `${nextUptime.toFixed(1)}%`,
      },
    ],
    areaPoints: tickBars(zone.areaPoints),
  }
}

function tickQueueTime(time: string, stepMinutes = 1): string {
  const [hours, minutes] = time.split(":").map((part) => Number.parseInt(part, 10))
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time

  let total = hours * 60 + minutes + stepMinutes
  if (total >= 24 * 60) total -= 24 * 60

  const nextHours = Math.floor(total / 60)
  const nextMinutes = total % 60
  return `${nextHours}:${nextMinutes.toString().padStart(2, "0")}`
}

function tickDataTable(
  zone: Extract<MiniAppScreenZone, { type: "data-table" }>
): Extract<MiniAppScreenZone, { type: "data-table" }> {
  const rows = zone.rows.map((row) => {
    const updated = row.cells[2]
    if (!updated?.includes(":")) return row

    return {
      cells: [row.cells[0], row.cells[1], tickQueueTime(updated)] as [
        string,
        string,
        string,
      ],
    }
  })

  const nextSummary = zone.queueSummary.replace(/next (\d+:\d+)/, (_, time) => {
    return `next ${tickQueueTime(time)}`
  })

  return {
    ...zone,
    queueSummary: nextSummary,
    rows,
  }
}

function tickZone(zone: MiniAppScreenZone): MiniAppScreenZone {
  switch (zone.type) {
    case "live-stream":
      return tickLiveStream(zone)
    case "signal-flow":
      return tickSignalFlow(zone)
    case "health-split":
      return tickHealthSplit(zone)
    case "data-table":
      return tickDataTable(zone)
    case "dashboard":
      return {
        ...zone,
        bars: zone.bars ? tickBars(zone.bars) : undefined,
        dotGrid: zone.dotGrid
          ? zone.dotGrid.map((row) =>
              row.map((active) => (Math.random() > 0.8 ? !active : active))
            )
          : undefined,
      }
    case "chart-dashboard":
      return {
        ...zone,
        chart: {
          ...zone.chart,
          heights: zone.chart.heights ? tickBars(zone.chart.heights) : zone.chart.heights,
          points: zone.chart.points ? tickBars(zone.chart.points) : zone.chart.points,
        },
        dotGrid: zone.dotGrid
          ? zone.dotGrid.map((row) =>
              row.map((active) => (Math.random() > 0.8 ? !active : active))
            )
          : undefined,
      }
    default:
      return zone
  }
}

function createInitialPreview(zone: MiniAppScreenZone): LiveFeaturePreview {
  return {
    zone,
    pulseKey: 0,
    activeNodeIndex: 0,
    activeRowIndex: 0,
  }
}

export function useLiveFeaturePreview(
  initialZone: MiniAppScreenZone,
  enabled: boolean,
  instanceId: string
): LiveFeaturePreview {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer
  )

  const isLive = enabled && !reducedMotion

  const zoneRef = useRef(initialZone)
  const pulseRef = useRef(0)
  const nodeRef = useRef(0)
  const rowRef = useRef(0)

  const [preview, setPreview] = useState<LiveFeaturePreview>(() =>
    createInitialPreview(initialZone)
  )

  useEffect(() => {
    if (!isLive) {
      return
    }

    zoneRef.current = initialZone
    pulseRef.current = 0
    nodeRef.current = 0
    rowRef.current = 0

    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) {
        setPreview(createInitialPreview(initialZone))
      }
    })

    const tickMs = tickIntervalMs(instanceId)
    const initialDelay = tickInitialDelayMs(instanceId)

    const runTick = () => {
      zoneRef.current = tickZone(zoneRef.current)
      pulseRef.current += 1
      nodeRef.current = (nodeRef.current + 1) % 3
      rowRef.current =
        zoneRef.current.type === "data-table"
          ? (rowRef.current + 1) % zoneRef.current.rows.length
          : 0

      setPreview({
        zone: zoneRef.current,
        pulseKey: pulseRef.current,
        activeNodeIndex: nodeRef.current,
        activeRowIndex: rowRef.current,
      })
    }

    let intervalId: number | undefined
    const startTimeout = window.setTimeout(() => {
      runTick()
      intervalId = window.setInterval(runTick, tickMs)
    }, initialDelay)

    return () => {
      cancelled = true
      window.clearTimeout(startTimeout)
      if (intervalId !== undefined) window.clearInterval(intervalId)
    }
  }, [isLive, initialZone, instanceId])

  useEffect(() => {
    if (!isLive || initialZone.type !== "live-stream") {
      return
    }

    const jitterMs = jitterIntervalMs(instanceId)

    const jitterInterval = window.setInterval(() => {
      const zone = zoneRef.current
      if (zone.type !== "live-stream" || zone.bars.length === 0) return

      const updates = 1 + (Math.random() > 0.55 ? 1 : 0)
      let nextZone = zone

      for (let count = 0; count < updates; count += 1) {
        const barIndex = Math.floor(Math.random() * nextZone.bars.length)
        nextZone = jitterLiveStreamBar(nextZone, barIndex)
      }

      zoneRef.current = nextZone
      setPreview((current) => ({ ...current, zone: nextZone }))
    }, jitterMs)

    return () => window.clearInterval(jitterInterval)
  }, [isLive, initialZone.type, instanceId])

  if (!isLive) {
    return createInitialPreview(initialZone)
  }

  return preview
}
