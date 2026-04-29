"use client"

import { RotateCcw } from "lucide-react"
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
          ? "bg-[#d7ba2f]"
          : "bg-black"

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

  const sessionBestMs =
    attempts.length > 0 ? Math.min(...attempts) : null
  const attemptsLabel = `${attempts.length}/${TOTAL_ATTEMPTS}`
  const bestDisplay =
    sessionBestMs != null ? `${sessionBestMs}\u00a0ms` : "—"

  return (
    <div
      className="flex h-96 min-h-0 flex-col overflow-hidden bg-black text-[#d7dadc]"
      aria-label="Reaction time test game"
    >
      <div
        className="flex w-full min-w-0 shrink-0 items-baseline justify-between gap-4 border-b border-white/8 px-2.5 pt-1.5 pb-1.5 text-[11px] leading-tight sm:px-3 sm:text-xs"
        aria-label="Attempts and best time this session"
      >
        <div className="min-w-0 text-left">
          <span className="block text-[10px] font-medium tracking-wide text-white/45 uppercase sm:text-[11px]">
            Attempts
          </span>
          <span className="font-mono text-[12px] font-semibold tabular-nums text-white sm:text-sm">
            {attemptsLabel}
          </span>
        </div>
        <div className="min-w-0 text-right">
          <span className="block text-[10px] font-medium tracking-wide text-white/45 uppercase sm:text-[11px]">
            Best
          </span>
          <span className="font-mono text-[12px] tabular-nums tracking-tight text-white/90 sm:text-sm">
            {bestDisplay}
          </span>
        </div>
      </div>

      {phase === "completed" ? (
        <div className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-center bg-black px-2.5 py-4 sm:px-3">
          <div className="flex w-full max-w-sm flex-col gap-5">
            <div className="text-center">
              <span className="block text-[10px] font-medium tracking-wide text-white/45 uppercase sm:text-[11px]">
                Average score
              </span>
              <p className="mt-1.5 font-mono text-4xl font-semibold tabular-nums tracking-tight text-white sm:text-5xl">
                {averageMs}
                <span className="ml-1 text-white/85">ms</span>
              </p>
            </div>

            <div className="w-full">
              <p className="mb-1.5 text-left text-[10px] font-medium tracking-wide text-white/45 uppercase sm:text-[11px]">
                Percentile
              </p>
              <div className="h-8 overflow-hidden rounded-sm border border-white/15 bg-[#0f0f0f]">
                <div
                  className="flex h-full min-w-0 items-center justify-between gap-2 px-2.5 font-mono text-[11px] font-semibold tabular-nums tracking-tight text-white transition-[width] duration-300 sm:text-sm"
                  style={{
                    width: `${Math.max(percentile, 8)}%`,
                    backgroundColor: speedBand.color,
                  }}
                >
                  <span className="min-w-0 truncate">{speedBand.label}</span>
                  <span className="shrink-0">{percentile}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute right-2.5 bottom-3 sm:right-3">
            <button
              type="button"
              onClick={handlePlayAgain}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white outline-none transition hover:bg-white/25 focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:ring-offset-1 focus-visible:ring-offset-black/20"
              aria-label="Play again"
            >
              <RotateCcw className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="absolute bottom-1.5 left-2.5 right-20 sm:left-3">
            <p className="mb-1 text-left text-[10px] font-medium tracking-wide text-white/45 uppercase sm:text-[11px]">
              Speed legend
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {SPEED_BANDS.map((band) => (
                <div key={band.label} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-6 shrink-0 rounded-full border border-white/20"
                    style={{ backgroundColor: band.color }}
                    aria-hidden
                  />
                  <span className="font-mono text-[11px] font-semibold tabular-nums tracking-tight text-white/90 sm:text-sm">
                    {band.label}
                  </span>
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
            "relative flex min-h-0 w-full min-w-0 flex-1 items-center justify-center rounded-none border-0 px-3 py-6 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#4fc1ff] focus-visible:ring-inset sm:px-4",
            panelCls
          )}
        >
          <div className="font-mono">
            <p className="text-[34px] font-semibold tracking-tight">{heading}</p>
            {helperText ? <p className="mt-2 text-sm text-[#d7dadc]">{helperText}</p> : null}
          </div>
        </button>
      )}
    </div>
  )
}
