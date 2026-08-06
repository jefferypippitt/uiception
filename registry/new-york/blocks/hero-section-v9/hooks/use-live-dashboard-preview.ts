"use client"

import { useEffect, useMemo, useState, useSyncExternalStore } from "react"

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
  pulseKey: number
}

type TaskSeed = {
  automation: string
  status: string
  state: PreviewStatusState
  minutesAgo: number
}

type DashboardState = {
  metrics: MetricSeed[]
  bars: number[]
  barPeaks: boolean[]
  barsPulseKey: number
  tasks: TaskSeed[]
  cyclePhase: number
}

export type LiveDashboardPreview = {
  metrics: ReadonlyArray<{ value: string; label: string; pulseKey: number }>
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
  barsPulseKey: number
  barPeaks: ReadonlyArray<boolean>
  queuedJobs: number
}

// Metric order is fixed by heroV9Preview.metrics: Runs completed, Success
// rate, Avg. duration, Queued jobs. These two are referenced by index
// elsewhere so the volume chart can react to and reflect them.
const RUNS_COMPLETED_METRIC_INDEX = 0
const QUEUED_JOBS_METRIC_INDEX = 3

// Each metric ticks on its own randomized cadence so the row reads like a
// live market ticker instead of four numbers changing in lockstep.
const METRIC_CADENCE_MS: ReadonlyArray<readonly [number, number]> = [
  [900, 1600], // Runs completed – fast live counter
  [4400, 6600], // Success rate – slow drift
  [2800, 4200], // Avg. duration – medium pace
  [1500, 2500], // Queued jobs – jumpy, order-book feel
]
const DEFAULT_CADENCE_MS: readonly [number, number] = [2200, 3600]
const BARS_CADENCE_MS: readonly [number, number] = [1000, 1800]
const TASKS_CADENCE_MS: readonly [number, number] = [2800, 4200]

function randomDelay([min, max]: readonly [number, number]): number {
  return min + Math.random() * (max - min)
}

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

function seedMetrics(metrics: ProductPreviewConfig["metrics"]): MetricSeed[] {
  return metrics.map((metric) => {
    const kind = detectMetricKind(metric.value)
    return {
      label: metric.label,
      kind,
      value: parseMetricValue(metric.value, kind),
      pulseKey: 0,
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

function tickMetricValue(metric: MetricSeed): number {
  let next = metric.value

  switch (metric.kind) {
    case "k":
      next += 3 + Math.random() * 7
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

  return next
}

// Only bumps pulseKey when the *displayed* value actually changes, so a
// metric card doesn't replay its tick animation on ticks that move the raw
// number by an amount too small to show up in the formatted text.
function applyMetricValue(metric: MetricSeed, value: number): MetricSeed {
  const changed =
    formatMetricValue(value, metric.kind) !==
    formatMetricValue(metric.value, metric.kind)

  return {
    ...metric,
    value,
    pulseKey: changed ? metric.pulseKey + 1 : metric.pulseKey,
  }
}

const BARS_MIN = 15
const BARS_MAX = 98
const BARS_BASELINE = 58

type BarEvent = "burst" | "lull" | "normal"

function clampBar(value: number): number {
  return Math.min(BARS_MAX, Math.max(BARS_MIN, Math.round(value)))
}

function nextBarTick(bars: ReadonlyArray<number>): { value: number; event: BarEvent } {
  const last = bars[bars.length - 1]
  const prev = bars[bars.length - 2] ?? last
  const momentum = last - prev

  const roll = Math.random()

  if (roll < 0.06) {
    // a batch job lands: quick burst in run volume
    return { value: clampBar(last + 14 + Math.random() * 22), event: "burst" }
  }

  if (roll < 0.12) {
    // queue drains out: sudden lull
    return { value: clampBar(last - (14 + Math.random() * 22)), event: "lull" }
  }

  // otherwise drift with some carried momentum, gently pulled back to baseline
  const meanPull = (BARS_BASELINE - last) * 0.08
  const carried = momentum * 0.35
  const noise = (Math.random() - 0.5) * 16
  return { value: clampBar(last + meanPull + carried + noise), event: "normal" }
}

// Peaks shift through the window alongside their bar so a burst stays
// marked as it scrolls left, then falls off once it exits the window —
// this is what ties the accent bars to "Runs completed" (see below).
function tickBars(
  bars: ReadonlyArray<number>,
  peaks: ReadonlyArray<boolean>
): { bars: number[]; peaks: boolean[]; event: BarEvent } {
  const tick = nextBarTick(bars)
  return {
    bars: [...bars.slice(1), tick.value],
    peaks: [...peaks.slice(1), tick.event === "burst"],
    event: tick.event,
  }
}

// Bumps a single metric out of its own cadence, so a notable moment in the
// volume chart (a burst or a lull) visibly ripples into the metrics row
// instead of the two panels just simulating side by side.
function bumpMetric(
  metrics: MetricSeed[],
  index: number,
  nextValue: (value: number) => number
): MetricSeed[] {
  const current = metrics[index]
  if (!current) return metrics
  const next = metrics.slice()
  next[index] = applyMetricValue(current, nextValue(current.value))
  return next
}

// Reacts to a volume burst by pulling a currently idle automation into
// "Running" early, tying the Status overview table to the volume chart.
function startIdleTask(tasks: TaskSeed[]): TaskSeed[] {
  const candidateIndex = tasks.findIndex(
    (task, index) => index !== 1 && task.state !== "running"
  )
  if (candidateIndex === -1) return tasks

  const next = tasks.slice()
  next[candidateIndex] = {
    ...next[candidateIndex],
    status: "Running",
    state: "running",
    minutesAgo: 0,
  }
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

function seedState(config: ProductPreviewConfig): DashboardState {
  const bars = config.panels.activity.bars
  const seedMaxIndex = bars.reduce(
    (best, height, index) => (height > bars[best] ? index : best),
    0
  )

  return {
    metrics: seedMetrics(config.metrics),
    bars: [...bars],
    barPeaks: bars.map((_, index) => index === seedMaxIndex),
    barsPulseKey: 0,
    tasks: seedTasks(config.panels.tasks.rows),
    cyclePhase: 0,
  }
}

function buildPreview(
  config: ProductPreviewConfig,
  state: DashboardState
): LiveDashboardPreview {
  return {
    metrics: state.metrics.map((metric) => ({
      label: metric.label,
      value: formatMetricValue(metric.value, metric.kind),
      pulseKey: metric.pulseKey,
    })),
    panels: {
      activity: {
        title: config.panels.activity.title,
        bars: state.bars,
      },
      tasks: {
        legendTitle: config.panels.tasks.legendTitle,
        legend: config.panels.tasks.legend,
        tableTitle: config.panels.tasks.tableTitle,
        rows: state.tasks.map((task) => ({
          automation: task.automation,
          status: task.status,
          state: task.state,
          lastRun: formatLastRun(task.minutesAgo),
        })),
      },
    },
    barsPulseKey: state.barsPulseKey,
    barPeaks: state.barPeaks,
    queuedJobs: state.metrics[QUEUED_JOBS_METRIC_INDEX]?.value ?? 0,
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

  const [state, setState] = useState<DashboardState>(() => seedState(config))

  useEffect(() => {
    if (reducedMotion) return

    const timeouts = new Set<number>()

    function scheduleMetric(index: number) {
      const cadence = METRIC_CADENCE_MS[index] ?? DEFAULT_CADENCE_MS
      const id = window.setTimeout(() => {
        timeouts.delete(id)
        setState((prev) => {
          const current = prev.metrics[index]
          if (!current) return prev
          const metrics = prev.metrics.slice()
          metrics[index] = applyMetricValue(current, tickMetricValue(current))
          return { ...prev, metrics }
        })
        scheduleMetric(index)
      }, randomDelay(cadence))
      timeouts.add(id)
    }

    function scheduleBars() {
      const id = window.setTimeout(() => {
        timeouts.delete(id)
        setState((prev) => {
          const { bars, peaks, event } = tickBars(prev.bars, prev.barPeaks)
          let metrics = prev.metrics
          let tasks = prev.tasks

          if (event === "burst") {
            // a burst in volume reads as a wave of runs landing at once
            metrics = bumpMetric(
              metrics,
              RUNS_COMPLETED_METRIC_INDEX,
              (value) => value + 40 + Math.random() * 70
            )
            metrics = bumpMetric(metrics, QUEUED_JOBS_METRIC_INDEX, (value) =>
              Math.max(24, value - (3 + Math.random() * 6))
            )
            tasks = startIdleTask(tasks)
          } else if (event === "lull") {
            // a lull means fewer runs draining the queue, so it backs up
            metrics = bumpMetric(
              metrics,
              QUEUED_JOBS_METRIC_INDEX,
              (value) => value + 2 + Math.random() * 5
            )
          }

          return {
            ...prev,
            bars,
            barPeaks: peaks,
            barsPulseKey: prev.barsPulseKey + 1,
            metrics,
            tasks,
          }
        })
        scheduleBars()
      }, randomDelay(BARS_CADENCE_MS))
      timeouts.add(id)
    }

    function scheduleTasks() {
      const id = window.setTimeout(() => {
        timeouts.delete(id)
        setState((prev) => {
          const cyclePhase = (prev.cyclePhase + 1) % 8
          return { ...prev, tasks: tickTasks(prev.tasks, cyclePhase), cyclePhase }
        })
        scheduleTasks()
      }, randomDelay(TASKS_CADENCE_MS))
      timeouts.add(id)
    }

    config.metrics.forEach((_, index) => scheduleMetric(index))
    scheduleBars()
    scheduleTasks()

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id))
    }
  }, [config, reducedMotion])

  return useMemo(() => buildPreview(config, state), [config, state])
}
