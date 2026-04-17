"use client"

import { useEffect, useState } from "react"

export type WorkflowPhase =
  | "setup"
  | "acting"
  | "result"
  | "holding"
  | "resetting"

export type RetryState = "failed" | "retrying" | null

const TIMING: Record<WorkflowPhase, number> = {
  setup:     500,
  acting:    3600,
  result:    300,
  holding:   3000,
  resetting: 320,
}

const STEP_MS   = 520
const RETRY_IDX = 2

export type WorkflowStep = {
  id: string
  label: string
  ms: string
  runColor: string
  msColor: string
}

export const WORKFLOW_STEPS: readonly WorkflowStep[] = [
  { id: "signup",    label: "User signed up",     ms: "61ms",  runColor: "text-sky-500",    msColor: "text-emerald-500" },
  { id: "email",     label: "Verify email",        ms: "18ms",  runColor: "text-amber-500",  msColor: "text-emerald-500" },
  { id: "workspace", label: "Provision workspace", ms: "820ms", runColor: "text-violet-500", msColor: "text-red-500"     },
  { id: "welcome",   label: "Send welcome",        ms: "290ms", runColor: "text-rose-500",   msColor: "text-amber-500"   },
]

export const RETRY_STEP_IDX = RETRY_IDX

export function useWorkflowAnimation(active: boolean) {
  const [phase, setPhase]           = useState<WorkflowPhase>("setup")
  const [lineIdx, setLineIdx]       = useState(0)
  const [retryState, setRetryState] = useState<RetryState>(null)

  useEffect(() => {
    if (!active) {
      setPhase("setup")
      setLineIdx(0)
      setRetryState(null)
      return
    }

    const next: Record<WorkflowPhase, WorkflowPhase> = {
      setup: "acting", acting: "result", result: "holding",
      holding: "resetting", resetting: "setup",
    }

    const t = setTimeout(() => setPhase(next[phase]), TIMING[phase])
    return () => clearTimeout(t)
  }, [active, phase])

  useEffect(() => {
    if (!active) return

    if (phase === "setup" || phase === "resetting") {
      setLineIdx(0)
      setRetryState(null)
      return
    }
    if (phase === "result" || phase === "holding") {
      setLineIdx(WORKFLOW_STEPS.length)
      setRetryState(null)
      return
    }
    if (phase !== "acting") return

    const timers: ReturnType<typeof setTimeout>[] = []
    setLineIdx(0)
    setRetryState(null)

    // Steps before the retry step
    for (let i = 1; i <= RETRY_IDX; i++) {
      timers.push(setTimeout(() => setLineIdx(i), STEP_MS * i))
    }

    // Retry sequence: running → failed → retrying → done
    const retryStart = STEP_MS * (RETRY_IDX + 1)
    timers.push(setTimeout(() => setRetryState("failed"),   retryStart))
    timers.push(setTimeout(() => setRetryState("retrying"), retryStart + 700))
    timers.push(setTimeout(() => {
      setRetryState(null)
      setLineIdx(RETRY_IDX + 1)
    }, retryStart + 1500))

    // Steps after the retry step
    for (let i = RETRY_IDX + 2; i <= WORKFLOW_STEPS.length; i++) {
      timers.push(setTimeout(
        () => setLineIdx(i),
        retryStart + 1500 + STEP_MS * (i - RETRY_IDX - 1),
      ))
    }

    return () => timers.forEach(clearTimeout)
  }, [active, phase])

  return {
    phase,
    lineIdx,
    retryState,
    isActing:  phase === "acting",
    isResult:  phase === "result" || phase === "holding",
    isHolding: phase === "holding",
  }
}
