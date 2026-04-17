"use client"

import { useEffect, useState } from "react"

/**
 * Experiment animation — drives the A/B experiment mini mock (`experiment-illustration.tsx`).
 *
 * Story (one loop):
 *   setup     → split 0%; A fixed, B skeleton; Ready + Safe
 *   acting    → split 0% → 87% (rAF-driven); Run badge; B skeleton
 *   result    → split 100%; B fills + green; Wins · B wins footer
 *   holding   → resolved state holds long enough to read
 *   resetting → soft reset before the next loop
 */

export type ExperimentPhase =
  | "setup"
  | "ship"
  | "measure"
  | "result"
  | "holding"
  | "resetting"

const TIMING: Record<ExperimentPhase, number> = {
  setup: 760,
  ship: 980,
  measure: 1300,
  result: 400,
  holding: 3300,
  resetting: 320,
}

const ACTING_TARGET_PCT = 87

export function useExperimentAnimation(active: boolean) {
  const [phase, setPhase] = useState<ExperimentPhase>("setup")
  const [progressPct, setProgressPct] = useState(0)

  // Phase cycler
  useEffect(() => {
    if (!active) return

    const next: Record<ExperimentPhase, ExperimentPhase> = {
      setup: "ship",
      ship: "measure",
      measure: "result",
      result: "holding",
      holding: "resetting",
      resetting: "setup",
    }

    const t = setTimeout(() => setPhase(next[phase]), TIMING[phase])
    return () => clearTimeout(t)
  }, [active, phase])

  // Progress bar driver — tied to the current phase.
  useEffect(() => {
    if (!active || phase !== "measure") return
    const startedAt = performance.now()
    const duration = TIMING.measure
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration)
      setProgressPct(Math.round(t * ACTING_TARGET_PCT))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, phase])

  return {
    phase,
    isShipping: phase === "ship",
    isMeasuring: phase === "measure",
    isResult: phase === "result" || phase === "holding",
    isHolding: phase === "holding",
    progressPct:
      phase === "setup" || phase === "resetting"
        ? 0
        : phase === "result" || phase === "holding"
          ? 100
          : progressPct,
    cursorVisible: phase === "ship" || phase === "measure" || phase === "result" || phase === "holding",
    pressed: phase === "ship" || phase === "result",
    cursor:
      phase === "ship"
        ? { x: 29, y: 28 }
        : phase === "measure"
          ? { x: 69, y: 28 }
          : phase === "result" || phase === "holding"
            ? { x: 79, y: 82 }
            : { x: 10, y: 90 },
  }
}
