"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const MIN_DELAY_MS = 1400
const MAX_DELAY_MS = 3600
const TOTAL_ATTEMPTS = 5
const BEST_MS = 120
const WORST_MS = 500
const SPEED_BANDS = [
  { label: "Slow", minMs: 301, color: "#e74856" },
  { label: "Average", minMs: 241, color: "#d7ba2f" },
  { label: "Fast", minMs: 181, color: "#16a34a" },
  { label: "Elite", minMs: 0, color: "#2d8bd1" },
] as const

type Phase = "idle" | "waiting" | "ready" | "result" | "too-soon" | "completed"

function randomDelayMs(): number {
  return Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS
}

function getAverage(values: number[]): number {
  if (values.length === 0) return 0
  const total = values.reduce((acc, value) => acc + value, 0)
  return Math.round(total / values.length)
}

export default function ReactionTime() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [lastMs, setLastMs] = useState<number | null>(null)
  const [attempts, setAttempts] = useState<number[]>([])

  const timeoutRef = useRef<number | null>(null)
  const readyAtRef = useRef<number | null>(null)

  const clearPending = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    readyAtRef.current = null
  }, [])

  const startRound = useCallback(() => {
    clearPending()
    setLastMs(null)
    setPhase("waiting")
    timeoutRef.current = window.setTimeout(() => {
      readyAtRef.current = performance.now()
      setPhase("ready")
      timeoutRef.current = null
    }, randomDelayMs())
  }, [clearPending])

  const handlePrimaryAction = useCallback(() => {
    if (phase === "idle" || phase === "result" || phase === "too-soon") {
      startRound()
      return
    }

    if (phase === "waiting") {
      clearPending()
      setPhase("too-soon")
      setLastMs(null)
      return
    }

    if (phase === "ready") {
      const startedAt = readyAtRef.current
      if (startedAt == null) return
      const ms = Math.max(1, Math.round(performance.now() - startedAt))
      clearPending()
      setLastMs(ms)
      setAttempts((prev) => {
        const next = [...prev, ms]
        setPhase(next.length >= TOTAL_ATTEMPTS ? "completed" : "result")
        return next
      })
    }
  }, [clearPending, phase, startRound])

  const handlePlayAgain = useCallback(() => {
    clearPending()
    setAttempts([])
    setLastMs(null)
    setPhase("idle")
  }, [clearPending])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault()
        handlePrimaryAction()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [handlePrimaryAction])

  useEffect(() => () => clearPending(), [clearPending])

  const panelCls =
    phase === "ready"
      ? "bg-[#16c60c]"
      : phase === "waiting"
        ? "bg-[#e74856]"
        : phase === "too-soon"
          ? "bg-[#35171c]"
          : "bg-[#1a1a1a]"

  const heading =
    phase === "waiting"
      ? "Wait For Green"
      : phase === "ready"
        ? "CLICK!"
        : phase === "too-soon"
          ? "Too soon!"
        : phase === "completed"
          ? "Finished"
        : phase === "result" && lastMs != null
          ? `${lastMs} ms`
          : "Start"

  const helperText =
    phase === "result" && attempts.length >= 1 && attempts.length < TOTAL_ATTEMPTS
      ? "click to continue"
      : null

  const averageMs = getAverage(attempts)
  const percentile = Math.max(
    0,
    Math.min(100, Math.round(((WORST_MS - averageMs) / (WORST_MS - BEST_MS)) * 100))
  )
  const speedBand = SPEED_BANDS.find((band) => averageMs >= band.minMs) ?? SPEED_BANDS[0]

  return (
    <div
      className="flex h-96 min-h-0 flex-col bg-[#121212] p-0 text-[#d7dadc]"
      aria-label="Reaction time test game"
    >
      {phase === "completed" ? (
        <div className="relative flex h-full flex-col items-center justify-center bg-[#1a1a1a] p-6">
          <div className="w-full max-w-md text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[#9aa0a6]">Average Score</p>
            <p className="mt-2 font-mono text-5xl font-semibold tracking-tight text-white">{averageMs}ms</p>
          </div>

          <div className="mt-5 w-full max-w-sm">
            <p className="mb-1.5 text-left text-[11px] uppercase tracking-[0.12em] text-[#9aa0a6]">
              Percentile
            </p>
            <div className="h-7 overflow-hidden border border-white/20 bg-[#0f0f0f]">
              <div
                className="flex h-full items-center justify-between px-2 text-xs font-semibold text-white transition-all"
                style={{
                  width: `${Math.max(percentile, 8)}%`,
                  backgroundColor: speedBand.color,
                }}
              >
                <span className="truncate">{speedBand.label}</span>
                <span>{percentile}%</span>
              </div>
            </div>
          </div>

          <div className="absolute right-2 bottom-1.5 flex max-w-[50%] flex-wrap items-center justify-end gap-1 text-[10px] leading-tight">
            <button
              type="button"
              onClick={handlePlayAgain}
              className="shrink-0 rounded border border-white/20 px-1.5 py-px font-mono text-[10px] font-semibold tracking-[0.05em] outline-none hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-[#d7ba2f] focus-visible:ring-offset-1 focus-visible:ring-offset-[#121213] disabled:opacity-50"
            >
              Play Again
            </button>
          </div>

          <div className="absolute bottom-1.5 left-2 right-20">
            <p className="mb-1 text-left text-[10px] uppercase tracking-widest text-[#7f7f7f]">
              Speed Legend
            </p>
            <div className="flex items-center gap-2">
              {SPEED_BANDS.map((band) => (
                <div key={band.label} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 border border-white/20"
                    style={{ backgroundColor: band.color }}
                    aria-hidden
                  />
                  <span className="font-mono text-[9px] text-[#9aa0a6]">{band.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handlePrimaryAction}
          className={cn(
            "relative flex min-h-0 flex-1 items-center justify-center p-4 text-center outline-none transition-colors focus-visible:ring-1 focus-visible:ring-[#4fc1ff] focus-visible:ring-offset-1 focus-visible:ring-offset-[#121212]",
            panelCls
          )}
        >
          <p className="absolute top-3 left-3 text-xs font-medium tracking-wide text-[#d7dadc]">
            Attempts: {attempts.length}/{TOTAL_ATTEMPTS}
          </p>
          <div className="font-mono">
            <p className="text-[34px] font-semibold tracking-tight">{heading}</p>
            {helperText ? <p className="mt-2 text-sm text-[#d7dadc]">{helperText}</p> : null}
          </div>
        </button>
      )}
    </div>
  )
}
