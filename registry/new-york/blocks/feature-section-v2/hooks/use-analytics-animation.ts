"use client"

import { useEffect, useState } from "react"

export type AnalyticsPhase =
  | "setup"
  | "acting"
  | "result"
  | "holding"
  | "resetting"

export type AnalyticsView = "7d" | "30d"

const TIMING: Record<AnalyticsPhase, number> = {
  setup:     500,
  acting:    1400,
  result:    300,
  holding:   3200,
  resetting: 320,
}

export type AnalyticsViewConfig = {
  label:    string
  series:   readonly { day: string; v: number }[]
  target:   number
  trend:    string
  color:    string
}

export const ANALYTICS_VIEWS: Record<AnalyticsView, AnalyticsViewConfig> = {
  "7d": {
    label:  "Last 7d",
    target: 12_482,
    trend:  "+18%",
    color:  "var(--chart-1)",
    series: [
      { day: "Mon", v: 8_420  },
      { day: "Tue", v: 9_140  },
      { day: "Wed", v: 8_860  },
      { day: "Thu", v: 10_380 },
      { day: "Fri", v: 9_820  },
      { day: "Sat", v: 11_070 },
      { day: "Sun", v: 12_482 },
    ],
  },
  "30d": {
    label:  "Last 30d",
    target: 54_180,
    trend:  "+34%",
    color:  "oklch(72.3% 0.219 149.579)",
    series: [
      { day: "Mon", v: 32_410 },
      { day: "Tue", v: 36_820 },
      { day: "Wed", v: 39_150 },
      { day: "Thu", v: 44_780 },
      { day: "Fri", v: 46_200 },
      { day: "Sat", v: 50_940 },
      { day: "Sun", v: 54_180 },
    ],
  },
}

export const ANALYTICS_SERIES = ANALYTICS_VIEWS["7d"].series

export function useAnalyticsAnimation(active: boolean) {
  const [phase, setPhase] = useState<AnalyticsPhase>("setup")
  const [view, setView]   = useState<AnalyticsView>("7d")
  const [users, setUsers] = useState(ANALYTICS_VIEWS["7d"].target)

  const config = ANALYTICS_VIEWS[view]

  useEffect(() => {
    if (!active) return

    const next: Record<AnalyticsPhase, AnalyticsPhase> = {
      setup: "acting", acting: "result", result: "holding",
      holding: "resetting", resetting: "setup",
    }

    const nextPhase = next[phase]
    const t = setTimeout(() => {
      if (nextPhase === "acting") setView(v => v === "7d" ? "30d" : "7d")
      setPhase(nextPhase)
    }, TIMING[phase])

    return () => clearTimeout(t)
  }, [active, phase])

  useEffect(() => {
    if (!active) return
    if (phase === "setup" || phase === "resetting") return
    if (phase === "result" || phase === "holding") {
      setUsers(config.target)
      return
    }
    const startedAt = performance.now()
    const duration  = TIMING.acting
    let raf = 0
    const tick = (now: number) => {
      const t      = Math.min(1, (now - startedAt) / duration)
      const eased  = 1 - (1 - t) ** 3
      setUsers(Math.round(eased * config.target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, phase, view])

  return {
    phase,
    view,
    users,
    config,
    isActing:  phase === "acting",
    isResult:  phase === "result" || phase === "holding",
    isHolding: phase === "holding",
  }
}
