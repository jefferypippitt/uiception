"use client"

import { useEffect, useState } from "react"

/**
 * Funnel animation — drives the analytics-dashboard mockup for card 01.
 *
 * Story (one loop):
 *   setup     → skeleton funnel bars + cohort line
 *   acting    → same; caption switches to “Aggregating…”
 *   result    → horizontal funnel bar chart
 *   holding   → chart holds to read
 *   resetting → soft reset before the next loop
 */

export type FunnelPhase =
  | "setup"
  | "acting"
  | "result"
  | "holding"
  | "resetting"

const TIMING: Record<FunnelPhase, number> = {
  setup: 760,
  acting: 1550,
  result: 420,
  holding: 3400,
  resetting: 320,
}

export function useFunnelAnimation(active: boolean) {
  const [phase, setPhase] = useState<FunnelPhase>("setup")
  const [actingScanIndex, setActingScanIndex] = useState(0)

  useEffect(() => {
    if (!active) return

    const next: Record<FunnelPhase, FunnelPhase> = {
      setup: "acting",
      acting: "result",
      result: "holding",
      holding: "resetting",
      resetting: "setup",
    }

    const t = setTimeout(() => setPhase(next[phase]), TIMING[phase])
    return () => clearTimeout(t)
  }, [active, phase])

  useEffect(() => {
    if (!active || phase !== "acting") return
    const t = setInterval(() => {
      setActingScanIndex((prev) => (prev + 1) % 4)
    }, 300)
    return () => clearInterval(t)
  }, [active, phase])

  const scanIndex = phase === "acting" ? actingScanIndex : 0

  return {
    phase,
    scanIndex,
    isActing: phase === "acting",
    isResult: phase === "result" || phase === "holding",
    isHolding: phase === "holding",
    showSkeleton: phase === "setup" || phase === "acting",
  }
}
