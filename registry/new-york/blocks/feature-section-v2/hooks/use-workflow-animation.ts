"use client"

// Phase flow: idle → running (steps 0..N in sequence) → done → idle (loops)

import { useEffect, useState } from "react"

export type StepStatus = "pending" | "running" | "done"

export interface WorkflowStep {
  id:       string
  label:    string
  detail:   string
  badge:    string
  duration: number   // ms the step stays "running"
}

type Phase = "idle" | "running" | "done"

// ─────────────────────────────────────────────────────────────────────────────

export const STEPS: WorkflowStep[] = [
  { id: "signup",  label: "User Signed Up",  detail: "POST /hooks/auth/signup",      badge: "1ms",   duration: 850  },
  { id: "account", label: "Account Created", detail: "workspace provisioned",        badge: "38ms",  duration: 700  },
  { id: "email",   label: "Welcome Email",   detail: "via sendgrid  →  delivered",   badge: "94ms",  duration: 900  },
  { id: "slack",   label: "Slack Notified",  detail: "channel  #new-customers",      badge: "210ms", duration: 750  },
  { id: "trial",   label: "Trial Started",   detail: "14-day trial activated",       badge: "5ms",   duration: 650  },
]

const IDLE_MS = 900
const DONE_MS = 2600

// ─────────────────────────────────────────────────────────────────────────────

export function useWorkflowAnimation(active: boolean) {
  const [phase,    setPhase]    = useState<Phase>("idle")
  const [statuses, setStatuses] = useState<StepStatus[]>(STEPS.map(() => "pending"))
  const [current,  setCurrent]  = useState(-1)

  const allDone = phase === "done"

  // idle → start
  useEffect(() => {
    if (!active || phase !== "idle") return
    const t = setTimeout(() => {
      setStatuses(STEPS.map(() => "pending"))
      setCurrent(0)
      setPhase("running")
    }, IDLE_MS)
    return () => clearTimeout(t)
  }, [phase, active])

  // running: animate the current step, then advance
  useEffect(() => {
    if (!active || phase !== "running" || current < 0) return

    // Mark current step as running
    setStatuses((prev) => prev.map((s, i) => (i === current ? "running" : s)))

    const step = STEPS[current]!
    const t = setTimeout(() => {
      // Resolve step to done
      setStatuses((prev) => prev.map((s, i) => (i === current ? "done" : s)))

      if (current + 1 < STEPS.length) {
        setCurrent(current + 1)
      } else {
        setPhase("done")
        setCurrent(-1)
      }
    }, step.duration)

    return () => clearTimeout(t)
  }, [phase, current, active])

  // done → reset
  useEffect(() => {
    if (!active || phase !== "done") return
    const t = setTimeout(() => {
      setPhase("idle")
    }, DONE_MS)
    return () => clearTimeout(t)
  }, [phase, active])

  return { steps: STEPS, statuses, allDone }
}
