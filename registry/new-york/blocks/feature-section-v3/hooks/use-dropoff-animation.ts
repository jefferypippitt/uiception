"use client"

import { useEffect, useState } from "react"

/**
 * Three-phase story — each phase maps to a checkout step (plain-language UI).
 *
 * enter    → Ready; skeleton; Start row
 * phone    → Checking badge; Phone row + Phone UI; alert copy (no spinner)
 * review   → Found badge; compact alert; Review row faded
 * holding  → hold to read
 * resetting→ soft reset
 */

export type DropoffPhase =
  | "setup"
  | "hoverPhone"
  | "openReason"
  | "result"
  | "holding"
  | "resetting"

const TIMING: Record<DropoffPhase, number> = {
  setup: 900,
  hoverPhone: 980,
  openReason: 1120,
  result: 400,
  holding: 3300,
  resetting: 280,
}

export function useDropoffAnimation(active: boolean) {
  const [phase, setPhase] = useState<DropoffPhase>("setup")

  useEffect(() => {
    if (!active) return

    const next: Record<DropoffPhase, DropoffPhase> = {
      setup: "hoverPhone",
      hoverPhone: "openReason",
      openReason: "result",
      result: "holding",
      holding: "resetting",
      resetting: "setup",
    }

    const t = setTimeout(() => setPhase(next[phase]), TIMING[phase])
    return () => clearTimeout(t)
  }, [active, phase])

  const showPhone = phase === "hoverPhone" || phase === "openReason" || phase === "result" || phase === "holding"
  const showReasonPanel = phase === "openReason" || phase === "result" || phase === "holding"
  const isResult = phase === "result" || phase === "holding"

  const cursorVisible = phase !== "setup" && phase !== "resetting"
  const pressed = phase === "openReason" || phase === "result"
  const cursor =
    phase === "hoverPhone"
      ? { x: 73, y: 45 }
      : phase === "openReason"
        ? { x: 74, y: 62 }
        : phase === "result" || phase === "holding"
          ? { x: 81, y: 79 }
          : { x: 10, y: 90 }

  return {
    phase,
    cursor,
    cursorVisible,
    pressed,
    showPhone,
    showReasonPanel,
    isResult,
  }
}
