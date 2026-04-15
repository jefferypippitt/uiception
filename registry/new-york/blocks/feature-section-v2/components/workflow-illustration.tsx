"use client"

import { Fragment } from "react"
import { cn } from "@/lib/utils"

import { useFsv2IllustrationActive }   from "../hooks/use-fsv2-illustration-active"
import { useWorkflowAnimation, STEPS } from "../hooks/use-workflow-animation"
import "../styles/workflow-illustration.css"

function CheckIcon() {
  return (
    <svg width="10" height="9" viewBox="0 0 8 7" fill="none" aria-hidden>
      <path
        d="M1 3.5L3 5.5L7 1"
        stroke="#052e16"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function WorkflowIllustration() {
  const { ref, active }  = useFsv2IllustrationActive()
  const { statuses }     = useWorkflowAnimation(active)

  return (
    <div ref={ref} className="wfi-root">
      <div className="wfi-window">

        {/* ── Horizontal pipeline ── */}
        <div className="wfi-pipeline">
          <div className="wfi-row">
            {STEPS.map((step, i) => {
              const status    = statuses[i]!
              const isRunning = status === "running"
              const isDone    = status === "done"
              const isLast    = i === STEPS.length - 1

              return (
                <Fragment key={step.id}>

                  {/* Step: icon + label centered */}
                  <div className="wfi-step-col">
                    <div className={cn("wfi-icon", `wfi-icon--${status}`)}>
                      {isDone && <CheckIcon />}
                    </div>
                    <span className={cn(
                      "wfi-step-name",
                      isRunning && "wfi-step-name--running",
                      isDone    && "wfi-step-name--done",
                    )}>
                      {step.label}
                    </span>
                    <span className={cn(
                      "wfi-step-time",
                      !isDone && "wfi-step-time--hidden",
                    )}>
                      {step.badge}
                    </span>
                  </div>

                  {/* Connector between steps — outside the column */}
                  {!isLast && (
                    <div className={cn("wfi-h-connector", isDone && "wfi-h-connector--done")} />
                  )}

                </Fragment>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
