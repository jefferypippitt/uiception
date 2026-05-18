"use client"

import { useEffect, useState } from "react"

/**
 * Integrations animation — drives a `Connect an integration…` command palette for card 04.
 *
 * Story (one loop):
 *   setup      → palette open, empty list, cursor idle
 *   typing     → "supa" types into the search bar; no results yet
 *   appearing  → all 4 rows stagger in (realistic search-result reveal)
 *   hovering   → cursor walks GitHub → Vercel → Supabase
 *   connecting → Supabase row shows the purple `Connect` chip; cursor slides to the button and clicks
 *   holding    → resolved state holds
 *   resetting  → soft reset
 */

export type IntegrationsPhase =
  | "setup"
  | "typing"
  | "appearing"
  | "hovering"
  | "connecting"
  | "loading"
  | "resetting"

const TIMING: Record<IntegrationsPhase, number> = {
  setup: 500,
  typing: 1100,
  appearing: 700,
  hovering: 1300,
  connecting: 600,
  loading: 2200,
  resetting: 300,
}

const PHASE_NEXT: Record<IntegrationsPhase, IntegrationsPhase> = {
  setup: "typing",
  typing: "appearing",
  appearing: "hovering",
  hovering: "connecting",
  connecting: "loading",
  loading: "resetting",
  resetting: "setup",
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
  const [visibleCount, setVisibleCount] = useState(0)

  // Phase timer
  useEffect(() => {
    if (!active) {
      setPhase("setup")
      return
    }
    const t = setTimeout(() => setPhase(PHASE_NEXT[phase]), TIMING[phase])
    return () => clearTimeout(t)
  }, [active, phase])

  // Phase → derived state
  useEffect(() => {
    if (!active) return

    if (phase === "setup" || phase === "resetting") {
      setHoverIdx(-1)
      setTyped(0)
      setPressed(false)
      setVisibleCount(0)
      return
    }

    if (phase === "typing") {
      setHoverIdx(-1)
      setVisibleCount(0)
      setTyped(0)
      const timers: ReturnType<typeof setTimeout>[] = []
      for (let i = 1; i <= INTEGRATIONS_QUERY.length; i++) {
        timers.push(setTimeout(() => setTyped(i), 200 + i * 210))
      }
      return () => timers.forEach(clearTimeout)
    }

    if (phase === "appearing") {
      setHoverIdx(-1)
      setTyped(INTEGRATIONS_QUERY.length)
      setVisibleCount(0)
      const timers: ReturnType<typeof setTimeout>[] = []
      for (let i = 0; i < INTEGRATIONS.length; i++) {
        timers.push(setTimeout(() => setVisibleCount(i + 1), 60 + i * 150))
      }
      return () => timers.forEach(clearTimeout)
    }

    if (phase === "hovering") {
      setVisibleCount(INTEGRATIONS.length)
      setPressed(false)
      // Walk GitHub → Vercel → Supabase
      const stops = [0, 1, INTEGRATIONS_TARGET_IDX]
      const stepMs = 320
      const timers: ReturnType<typeof setTimeout>[] = []
      stops.forEach((s, i) => {
        timers.push(setTimeout(() => setHoverIdx(s), i * stepMs))
      })
      return () => timers.forEach(clearTimeout)
    }

    if (phase === "connecting") {
      // Connect chip appears; cursor slides to button and clicks
      setHoverIdx(INTEGRATIONS_TARGET_IDX)
      setVisibleCount(INTEGRATIONS.length)
      const timers: ReturnType<typeof setTimeout>[] = [
        setTimeout(() => setPressed(true), 350),
        setTimeout(() => setPressed(false), 500),
      ]
      return () => timers.forEach(clearTimeout)
    }

    if (phase === "loading") {
      setHoverIdx(INTEGRATIONS_TARGET_IDX)
      setVisibleCount(INTEGRATIONS.length)
      setPressed(false)
    }
  }, [active, phase])

  return {
    phase,
    hoverIdx,
    typed,
    pressed,
    visibleCount,
    query: INTEGRATIONS_QUERY.slice(0, typed),
    isResult: phase === "connecting" || phase === "loading",
    cursorOnConnect: phase === "connecting" || phase === "loading",
    isLoading: phase === "loading",
  }
}
