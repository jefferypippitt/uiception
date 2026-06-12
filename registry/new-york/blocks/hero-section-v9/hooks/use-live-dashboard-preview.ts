"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import type { PreviewStatusState, ProductPreviewConfig } from "../lib/config"

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

type MetricKind = "k" | "percent" | "minutes" | "integer"

type MetricSeed = {
  label: string
  kind: MetricKind
  value: number
}

type TaskSeed = {
  automation: string
  status: string
  state: PreviewStatusState
  minutesAgo: number
}

export type LiveDashboardPreview = {
  metrics: ReadonlyArray<{ value: string; label: string }>
  panels: ProductPreviewConfig["panels"] & {
    tasks: ProductPreviewConfig["panels"]["tasks"] & {
      rows: ReadonlyArray<{
        automation: string
        status: string
        lastRun: string
        state: PreviewStatusState
      }>
    }
  }
  pulseKey: number
}

const TICK_MS = 3200

function detectMetricKind(value: string): MetricKind {
  if (value.includes("%")) return "percent"
  if (/min/i.test(value)) return "minutes"
  if (/k/i.test(value)) return "k"
  return "integer"
}

function parseMetricValue(value: string, kind: MetricKind): number {
  const numeric = Number.parseFloat(value.replace(/[^\d.]/g, ""))
  if (kind === "k") return numeric * 1000
  return numeric
}

function formatMetricValue(value: number, kind: MetricKind): string {
  switch (kind) {
    case "k":
      return `${(value / 1000).toFixed(1)}K`
    case "percent":
      return `${value.toFixed(1)}%`
    case "minutes":
      return `${value.toFixed(1)} Min`
    default:
      return `${Math.round(value)}`
  }
}

function formatLastRun(minutesAgo: number): string {
  if (minutesAgo <= 0) return "just now"
  if (minutesAgo === 1) return "1 min ago"
  return `${minutesAgo} min ago`
}

function seedMetrics(
  metrics: ProductPreviewConfig["metrics"]
): MetricSeed[] {
  return metrics.map((metric) => {
    const kind = detectMetricKind(metric.value)
    return {
      label: metric.label,
      kind,
      value: parseMetricValue(metric.value, kind),
    }
  })
}

function seedTasks(
  rows: ProductPreviewConfig["panels"]["tasks"]["rows"]
): TaskSeed[] {
  return rows.map((row) => ({
    automation: row.automation,
    status: row.status,
    state: row.state,
    minutesAgo: Number.parseInt(row.lastRun, 10) || 1,
  }))
}

function tickMetrics(metrics: MetricSeed[]): MetricSeed[] {
  return metrics.map((metric) => {
    let next = metric.value

    switch (metric.kind) {
      case "k":
        next += 8 + Math.floor(Math.random() * 18)
        break
      case "percent":
        next += Math.random() > 0.65 ? -0.1 : 0.05
        next = Math.min(99.9, Math.max(98.4, next))
        break
      case "minutes":
        next += (Math.random() - 0.5) * 0.12
        next = Math.min(2.2, Math.max(1.1, next))
        break
      default:
        next += Math.floor(Math.random() * 3) - 1
        next = Math.max(24, next)
        break
    }

    return { ...metric, value: next }
  })
}

function tickBars(bars: ReadonlyArray<number>): number[] {
  const next = bars.slice(1)
  next.push(42 + Math.floor(Math.random() * 54))
  return next
}

function tickTasks(tasks: TaskSeed[], cyclePhase: number): TaskSeed[] {
  return tasks.map((task, index) => {
    let { status, state, minutesAgo } = task

    minutesAgo = state === "running" ? minutesAgo : minutesAgo + 1

    if (index === 1) {
      return { ...task, status, state, minutesAgo: Math.max(0, minutesAgo - 1) }
    }

    if (cyclePhase === 0 && index === 2 && state !== "running") {
      status = "Running"
      state = "running"
      minutesAgo = 0
    } else if (cyclePhase === 2 && index === 2 && state === "running") {
      status = "Completed"
      state = "success"
      minutesAgo = 1
    } else if (cyclePhase === 4 && index === 0 && state !== "running") {
      status = "Running"
      state = "running"
      minutesAgo = 0
    } else if (cyclePhase === 6 && index === 0 && state === "running") {
      status = "Completed"
      state = "success"
      minutesAgo = 1
    }

    return { ...task, status, state, minutesAgo }
  })
}

function buildPreview(
  config: ProductPreviewConfig,
  metrics: MetricSeed[],
  bars: number[],
  tasks: TaskSeed[],
  pulseKey: number
): LiveDashboardPreview {
  return {
    metrics: metrics.map((metric) => ({
      label: metric.label,
      value: formatMetricValue(metric.value, metric.kind),
    })),
    panels: {
      activity: {
        title: config.panels.activity.title,
        bars,
      },
      tasks: {
        legendTitle: config.panels.tasks.legendTitle,
        legend: config.panels.tasks.legend,
        tableTitle: config.panels.tasks.tableTitle,
        rows: tasks.map((task) => ({
          automation: task.automation,
          status: task.status,
          state: task.state,
          lastRun: formatLastRun(task.minutesAgo),
        })),
      },
    },
    pulseKey,
  }
}

export function useLiveDashboardPreview(
  config: ProductPreviewConfig
): LiveDashboardPreview {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer
  )

  const metricsRef = useRef(seedMetrics(config.metrics))
  const barsRef = useRef([...config.panels.activity.bars])
  const tasksRef = useRef(seedTasks(config.panels.tasks.rows))
  const cycleRef = useRef(0)

  const [preview, setPreview] = useState<LiveDashboardPreview>(() =>
    buildPreview(
      config,
      seedMetrics(config.metrics),
      [...config.panels.activity.bars],
      seedTasks(config.panels.tasks.rows),
      0
    )
  )

  useEffect(() => {
    if (reducedMotion) {
      setPreview(
        buildPreview(
          config,
          metricsRef.current,
          barsRef.current,
          tasksRef.current,
          0
        )
      )
      return
    }

    const interval = window.setInterval(() => {
      metricsRef.current = tickMetrics(metricsRef.current)
      barsRef.current = tickBars(barsRef.current)
      cycleRef.current = (cycleRef.current + 1) % 8
      tasksRef.current = tickTasks(tasksRef.current, cycleRef.current)

      setPreview((current) =>
        buildPreview(
          config,
          metricsRef.current,
          barsRef.current,
          tasksRef.current,
          current.pulseKey + 1
        )
      )
    }, TICK_MS)

    return () => window.clearInterval(interval)
  }, [config, reducedMotion])

  return preview
}
