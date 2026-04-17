"use client"

/**
 * Product surface: Automation run detail — queued steps resolve into a finished run.
 * Body: compact run table (Step · Status · Duration); run id + status live in the footer.
 * Accent (one element): green `~12 min` in the footer when the run completes.
 * No cursor — read-only run viewer.
 */

import { ChevronDown, Loader, Play, RotateCw } from "lucide-react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

import { useFsv2IllustrationActive } from "../hooks/use-fsv2-illustration-active"
import {
  useWorkflowAnimation,
  WORKFLOW_STEPS,
  RETRY_STEP_IDX,
} from "../hooks/use-workflow-animation"

export default function WorkflowIllustration() {
  const active = useFsv2IllustrationActive()
  const [playing, setPlaying] = useState(false)
  const { lineIdx, isResult, phase, retryState } = useWorkflowAnimation(playing)

  useEffect(() => {
    if (!active || playing) return
    const t = setTimeout(() => setPlaying(true), 800)
    return () => clearTimeout(t)
  }, [active, playing])

  useEffect(() => {
    if (phase === "resetting") setPlaying(false)
  }, [phase])

  return (
    <div className="flex size-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex min-h-0 flex-1 flex-col px-2.5 pt-2.5">
        <div className="flex min-h-0 flex-1 flex-col gap-0.5">
          {WORKFLOW_STEPS.map((step, i) => {
            const isRetryStep = i === RETRY_STEP_IDX
            const failed    = isRetryStep && retryState === "failed"
            const retrying  = isRetryStep && retryState === "retrying"
            const done      = isResult || (i < lineIdx && !(failed || retrying))
            const running   = !isResult && i === lineIdx && !failed && !retrying
            const pending   = !done && !running && !failed && !retrying
            const showArrow = i < WORKFLOW_STEPS.length - 1

            return (
              <div key={step.id}>
                <div
                  className={cn(
                    "grid grid-cols-[minmax(0,1fr)_4.5rem_2.75rem] items-center gap-x-1.5 rounded-sm px-1 py-0.5 text-[10.5px] leading-tight transition-colors duration-200",
                    (running || failed || retrying) && "bg-muted/60",
                    done && "bg-muted/25",
                  )}
                >
                  <span
                    className={cn(
                      "min-w-0 truncate",
                      pending ? "text-muted-foreground/70" : "text-foreground",
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="flex justify-end">
                    {failed ? (
                      <span className="text-[10px] font-medium text-red-500">Failed</span>
                    ) : retrying ? (
                      <span className="inline-flex items-center justify-end gap-1 text-amber-500">
                        <RotateCw className="size-2.5 shrink-0 motion-safe:animate-spin" aria-hidden />
                        <span className="text-[10px] font-medium">Retrying</span>
                      </span>
                    ) : running ? (
                      <span className={cn("inline-flex items-center justify-end", step.runColor)}>
                        <RotateCw className="size-2.5 shrink-0 motion-safe:animate-spin" aria-hidden />
                      </span>
                    ) : done ? (
                      <span className="text-[10px] font-medium text-emerald-500">Done</span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground/40">—</span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-right font-mono tabular-nums text-[10px]",
                      done     ? step.msColor
                      : failed ? "text-red-500/60"
                      : retrying ? "text-amber-500/60"
                      : running  ? "text-muted-foreground/50"
                      : "text-muted-foreground/30",
                    )}
                  >
                    {done ? step.ms : (running || retrying) ? "…" : "—"}
                  </span>
                </div>
                {showArrow && (
                  <div className="flex justify-center py-0.5" aria-hidden>
                    <ChevronDown className="size-2.5 text-muted-foreground/40" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid h-6 shrink-0 grid-cols-3 items-center border-t border-border px-2.5 text-[10px]">
        <span className="font-mono tabular-nums text-muted-foreground">Run #482</span>
        <span className="flex items-center justify-center gap-1">
          {!playing && !isResult ? (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="inline-flex items-center justify-center rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Run workflow"
            >
              <Play className="size-3 fill-current" aria-hidden />
            </button>
          ) : isResult ? (
            <span className="text-foreground">All steps completed</span>
          ) : (
            <>
              <Loader className="size-3 shrink-0 text-muted-foreground motion-safe:animate-spin" aria-hidden />
              <span className="text-muted-foreground">Executing steps</span>
            </>
          )}
        </span>
        <span className="flex items-center justify-end gap-1">
          {isResult ? (
            <>
              <span className="text-muted-foreground">Total</span>
              <span className="font-mono tabular-nums text-green-500">~12 min</span>
            </>
          ) : (
            <span className="text-muted-foreground/40">—</span>
          )}
        </span>
      </div>
    </div>
  )
}
