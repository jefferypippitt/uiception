"use client"

import { useEffect, useState } from "react"

/**
 * Integrations animation — drives a `Connect an integration…` command palette for card 04.
 *
 * Story (one loop):
 *   setup     → palette open with all 4 rows pending; cursor idle at left
 *   acting    → cursor moves down through rows (GitHub → Vercel → Supabase),
 *               landing on the Supabase row; typed query ("supa") fills the search;
 *               cursor press at the end highlights the Connect chip
 *   result    → Supabase row shows the purple `Connect` chip + chevron
 *   holding   → resolved state holds
 *   resetting → soft reset
 */

export type IntegrationsPhase =
  | "setup"
  | "acting"
  | "result"
  | "holding"
  | "resetting"

const TIMING: Record<IntegrationsPhase, number> = {
  setup: 500,
  acting: 2200,
  result: 300,
  holding: 3000,
  resetting: 320,
}

export type Integration = {
  id: "github" | "vercel" | "supabase" | "openai"
  name: string
  kind: string
}

/** Row order matches vertical layout — cursor percentages target each row's center */
export const INTEGRATIONS: readonly Integration[] = [
  { id: "github", name: "GitHub", kind: "Code" },
  { id: "vercel", name: "Vercel", kind: "Deploy" },
  { id: "supabase", name: "Supabase", kind: "Database" },
  { id: "openai", name: "OpenAI", kind: "AI" },
]

/** The target row the cursor lands on — animating in on it creates the story */
export const INTEGRATIONS_TARGET_IDX = 2

export const INTEGRATIONS_QUERY = "supa"

export function useIntegrationsAnimation(active: boolean) {
  const [phase, setPhase] = useState<IntegrationsPhase>("setup")
  const [hoverIdx, setHoverIdx] = useState(-1)
  const [typed, setTyped] = useState(0)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (!active) return

    const next: Record<IntegrationsPhase, IntegrationsPhase> = {
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
    if (!active) return

    if (phase === "setup" || phase === "resetting") {
      setHoverIdx(-1)
      setTyped(0)
      setPressed(false)
      return
    }

    if (phase === "result" || phase === "holding") {
      setHoverIdx(INTEGRATIONS_TARGET_IDX)
      setTyped(INTEGRATIONS_QUERY.length)
      setPressed(false)
      return
    }

    // acting — 3 hover ticks ending on the target row, then a press
    const stops = [0, 1, INTEGRATIONS_TARGET_IDX]
    const stepMs = TIMING.acting / (stops.length + 1)
    const timers: Array<ReturnType<typeof setTimeout>> = []

    stops.forEach((s, i) => {
      timers.push(
        setTimeout(() => setHoverIdx(s), i * stepMs),
      )
    })
    // Press feedback just before phase transitions to result
    timers.push(
      setTimeout(() => setPressed(true), TIMING.acting - 200),
    )
    timers.push(setTimeout(() => setPressed(false), TIMING.acting - 40))

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [active, phase])

  useEffect(() => {
    if (!active) return
    if (phase !== "acting") return
    const total = INTEGRATIONS_QUERY.length
    const charMs = 110
    let i = 0
    setTyped(0)
    const iv = setInterval(() => {
      i++
      setTyped(i)
      if (i >= total) clearInterval(iv)
    }, charMs)
    return () => clearInterval(iv)
  }, [active, phase])

  return {
    phase,
    hoverIdx,
    typed,
    pressed,
    query: INTEGRATIONS_QUERY.slice(0, typed),
    isActing: phase === "acting",
    isResult: phase === "result" || phase === "holding",
    isHolding: phase === "holding",
  }
}
