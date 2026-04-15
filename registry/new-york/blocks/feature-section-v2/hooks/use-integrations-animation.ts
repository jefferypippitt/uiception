"use client"

import { useEffect, useReducer, useRef, useState } from "react"

export type SyncStatus = "connected" | "syncing"

export interface Integration {
  id:     string
  name:   string
  metric: string
  base:   number
}

export const INTEGRATIONS: Integration[] = [
  { id: "github",   name: "GitHub",   metric: "commits",   base: 847  },
  { id: "vercel",   name: "Vercel",   metric: "deploys",   base: 23   },
  { id: "supabase", name: "Supabase", metric: "queries",   base: 5200 },
  { id: "openai",   name: "OpenAI",   metric: "tokens",    base: 12400},
]

const HISTORY_LEN = 24

/** Seed a believable ramp into the current counter so the first frame is not flat */
function seedHistory(base: number): number[] {
  const spread = Math.max(6, Math.round(base * 0.035))
  const start  = Math.max(0, base - spread)
  return Array.from({ length: HISTORY_LEN }, (_, i) =>
    Math.round(start + ((base - start) * i) / (HISTORY_LEN - 1)),
  )
}

type MetricsState = {
  metrics:       number[]
  metricHistory: number[][]
}

function initialMetricsState(): MetricsState {
  return {
    metrics:       INTEGRATIONS.map((i) => i.base),
    metricHistory: INTEGRATIONS.map((i) => seedHistory(i.base)),
  }
}

function tickMetrics(state: MetricsState): MetricsState {
  const next = state.metrics.map((m, i) => {
    if (i === 0) return m + Math.floor(Math.random() * 3) + 1
    if (i === 1) return m + (Math.random() < 0.35 ? 1 : 0)
    if (i === 2) return m + Math.floor(Math.random() * 150) + 50
    if (i === 3) return m + Math.floor(Math.random() * 400) + 100
    return m
  })
  const metricHistory = state.metricHistory.map((row, i) => [...row.slice(1), next[i]!])
  return { metrics: next, metricHistory }
}

function metricsReducer(state: MetricsState, _action: "tick"): MetricsState {
  return tickMetrics(state)
}

const METRIC_INTERVAL_MS = 1600
const FLASH_MS = 550

/** Rotate through rows; each sync is a short pulse then idle before the next row */
const SYNC_ORDER = [2, 3, 0, 1] as const

// ─────────────────────────────────────────────────────────────────────────────

export function useIntegrationsAnimation(active: boolean) {
  const [{ metrics, metricHistory }, dispatchTick] = useReducer(
    metricsReducer,
    undefined,
    initialMetricsState,
  )

  const [statuses, setStatuses] = useState<SyncStatus[]>(() =>
    INTEGRATIONS.map(() => "connected"),
  )
  const [flashIdx, setFlashIdx] = useState<number | null>(null)

  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const turnRef = useRef(0)

  useEffect(() => {
    if (!active) return
    const t = setInterval(() => dispatchTick("tick"), METRIC_INTERVAL_MS)
    return () => clearInterval(t)
  }, [active])

  useEffect(() => {
    if (!active) return

    let cancelled = false
    const pending: ReturnType<typeof setTimeout>[] = []

    const clearPending = () => {
      for (const id of pending) clearTimeout(id)
      pending.length = 0
    }

    const scheduleSyncCycle = () => {
      if (cancelled) return

      const idx = SYNC_ORDER[turnRef.current % SYNC_ORDER.length]!
      turnRef.current++

      setStatuses((prev) => prev.map((_, i) => (i === idx ? "syncing" : "connected")))
      setFlashIdx(idx)
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current)
      flashTimerRef.current = setTimeout(() => setFlashIdx(null), FLASH_MS)

      const pulseMs = 680 + Math.floor(Math.random() * 420)
      const gapMs   = 2000 + Math.floor(Math.random() * 1600)

      pending.push(
        setTimeout(() => {
          if (cancelled) return
          setStatuses((prev) => prev.map(() => "connected"))
        }, pulseMs),
      )

      pending.push(
        setTimeout(() => {
          if (cancelled) return
          clearPending()
          scheduleSyncCycle()
        }, pulseMs + gapMs),
      )
    }

    scheduleSyncCycle()

    return () => {
      cancelled = true
      clearPending()
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current)
      flashTimerRef.current = null
    }
  }, [active])

  return { integrations: INTEGRATIONS, metrics, metricHistory, statuses, flashIdx }
}
