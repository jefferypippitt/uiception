"use client"

import { ArrowRight, RotateCcw } from "lucide-react"
import { Crosshair } from "@phosphor-icons/react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { type ColorMemoryHsb, getColorMemoryTodayMeta } from "@/lib/color-memory-daily"

const MEMORIZE_SECONDS = 5
const MEMORIZE_TOTAL_MS = MEMORIZE_SECONDS * 1000
const TOTAL_ATTEMPTS = 5

type Phase = "menu" | "memorize" | "guess" | "round-result" | "result"
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function formatCountdown(msRemaining: number): string {
  const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

function nextLocalMidnightMs(nowMs: number): number {
  const now = new Date(nowMs)
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0
  ).getTime()
}

function hueDistanceDegrees(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360
  return diff > 180 ? 360 - diff : diff
}

function scoreGuess(guess: ColorMemoryHsb, target: ColorMemoryHsb): number {
  const hueError = hueDistanceDegrees(guess.h, target.h) / 180
  const satError = Math.abs(guess.s - target.s) / 100
  const brightError = Math.abs(guess.b - target.b) / 100
  const avgError = (hueError + satError + brightError) / 3
  const score = 10 * (1 - avgError)
  return Math.round(clamp(score, 0, 10) * 100) / 100
}

function hsbToCss({ h, s, b }: ColorMemoryHsb): string {
  return `hsl(${h} ${s}% ${b}%)`
}

const DEFAULT_GUESS: ColorMemoryHsb = { h: 180, s: 50, b: 50 }

function SplitSquare({ guess, target }: { guess: ColorMemoryHsb; target: ColorMemoryHsb }) {
  return (
    <div className="relative h-24 w-24 overflow-hidden rounded-xl">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: hsbToCss(guess), clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: hsbToCss(target), clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
      />
      <p className="absolute bottom-1.5 left-1.5 font-mono text-[10px] font-semibold leading-none text-white/80">you</p>
    </div>
  )
}

function VerticalSlider({
  min,
  max,
  value,
  onChange,
  label,
  onActiveChange,
}: {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
  label: string
  onActiveChange?: (active: boolean) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  const valueFromClientY = useCallback(
    (clientY: number) => {
      const el = trackRef.current
      if (!el) return value
      const rect = el.getBoundingClientRect()
      const ratio = 1 - (clientY - rect.top) / rect.height
      return Math.round(clamp(min + ratio * (max - min), min, max))
    },
    [min, max, value]
  )

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    const el = trackRef.current
    if (!el) return
    el.setPointerCapture(e.pointerId)
    onActiveChange?.(true)
    onChange(valueFromClientY(e.clientY))
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons === 0) return
    onChange(valueFromClientY(e.clientY))
  }

  const handlePointerUp = () => {
    onActiveChange?.(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") { e.preventDefault(); onActiveChange?.(true); onChange(clamp(value + 1, min, max)) }
    else if (e.key === "ArrowDown") { e.preventDefault(); onActiveChange?.(true); onChange(clamp(value - 1, min, max)) }
    else if (e.key === "Home") { e.preventDefault(); onActiveChange?.(true); onChange(min) }
    else if (e.key === "End") { e.preventDefault(); onActiveChange?.(true); onChange(max) }
  }

  const thumbPercent = ((value - min) / (max - min)) * 100

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-orientation="vertical"
      className="relative h-full w-full cursor-pointer select-none outline-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
    >
      <div
        className="pointer-events-none absolute left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
        style={{ bottom: `calc(${thumbPercent}% - 10px)` }}
        aria-hidden
      />
    </div>
  )
}

export default function ColorMemory() {
  const browserTimeZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    []
  )
  const initialMeta = useMemo(() => getColorMemoryTodayMeta(browserTimeZone), [browserTimeZone])
  const [phase, setPhase] = useState<Phase>("menu")
  const [dayKey, setDayKey] = useState(initialMeta.dayKey)
  const [puzzleNumber, setPuzzleNumber] = useState(initialMeta.puzzleNumber)
  const [targets, setTargets] = useState<ColorMemoryHsb[]>(initialMeta.colors)
  const [guess, setGuess] = useState<ColorMemoryHsb>(DEFAULT_GUESS)
  const [guesses, setGuesses] = useState<ColorMemoryHsb[]>([])
  const [currentAttempt, setCurrentAttempt] = useState(1)
  const [remainingMs, setRemainingMs] = useState<number>(MEMORIZE_TOTAL_MS)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [activeSlider, setActiveSlider] = useState<"h" | "s" | "b" | null>(null)

  const activeSliderLabel = activeSlider === "h" ? "Hue" : activeSlider === "s" ? "Saturation" : activeSlider === "b" ? "Brightness" : null

  const msUntilNextPuzzle = nextLocalMidnightMs(nowMs) - nowMs
  const nextPuzzleCountdown = formatCountdown(msUntilNextPuzzle)
  const target = targets[currentAttempt - 1] ?? targets[0]
  const score = scoreGuess(guess, target)
  const secondsLeft = Math.max(0, Math.ceil(remainingMs / 1000))

  const resetForCurrentDay = useCallback(() => {
    const nextMeta = getColorMemoryTodayMeta(browserTimeZone)
    setDayKey(nextMeta.dayKey)
    setPuzzleNumber(nextMeta.puzzleNumber)
    setTargets(nextMeta.colors)
    setGuess(DEFAULT_GUESS)
    setGuesses([])
    setCurrentAttempt(1)
    setRemainingMs(MEMORIZE_TOTAL_MS)
    setPhase("menu")
  }, [browserTimeZone])

  const startMemorize = useCallback(() => {
    setGuess(DEFAULT_GUESS)
    setGuesses([])
    setCurrentAttempt(1)
    setRemainingMs(MEMORIZE_TOTAL_MS)
    setPhase("memorize")
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const sync = () => {
      const nextMeta = getColorMemoryTodayMeta(browserTimeZone)
      setPuzzleNumber((prev) => {
        if (nextMeta.puzzleNumber !== prev) {
          queueMicrotask(() => {
            setDayKey(nextMeta.dayKey)
            setTargets(nextMeta.colors)
            setGuess(DEFAULT_GUESS)
            setGuesses([])
            setCurrentAttempt(1)
            setRemainingMs(MEMORIZE_TOTAL_MS)
            setPhase("menu")
          })
          return nextMeta.puzzleNumber
        }
        return prev
      })
    }

    const id = window.setInterval(sync, 60_000)
    const onVisibility = () => {
      if (document.visibilityState === "visible") sync()
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      window.clearInterval(id)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [browserTimeZone])

  useEffect(() => {
    if (phase !== "memorize") return
    const startedAt = performance.now()
    const endAt = startedAt + MEMORIZE_TOTAL_MS

    const id = window.setInterval(() => {
      const nextRemaining = Math.max(0, Math.round(endAt - performance.now()))
      setRemainingMs(nextRemaining)
      if (nextRemaining <= 0) {
        window.clearInterval(id)
        setPhase("guess")
      }
    }, 33)

    return () => window.clearInterval(id)
  }, [phase])

  const formattedLocalDate = (() => {
    const [year, month, day] = dayKey.split("-")
    return month && day && year ? `${month}-${day}-${year}` : dayKey
  })()

  return (
    <div
      className="relative flex h-96 min-h-0 flex-col bg-black px-1.5 py-1 text-[#e6edf3]"
      aria-label="Color memory game"
    >
      <div
        className="flex shrink-0 items-baseline gap-x-1 border-b border-white/8 pb-1.5 text-[11px] leading-tight text-[#d7dadc] sm:text-xs"
        aria-label="Daily puzzle and reset time"
      >
        <div className="min-w-0 flex-1 text-left">
          <span className="block text-[10px] font-medium tracking-wide text-white/45 uppercase sm:text-[11px]">
            Daily
          </span>
          <span className="font-mono text-[12px] font-semibold tabular-nums text-white sm:text-sm">
            #{puzzleNumber}
          </span>
        </div>
        <div className="min-w-0 flex-1 border-x border-white/6 px-1.5 text-center sm:px-2">
          <span className="block text-[10px] font-medium tracking-wide text-white/45 uppercase sm:text-[11px]">
            Local
          </span>
          <span className="font-mono text-[12px] tabular-nums text-white/90 sm:text-sm">
            {formattedLocalDate}
          </span>
        </div>
        <div className="min-w-0 flex-1 text-right">
          <span className="block text-[10px] font-medium tracking-wide text-white/45 uppercase sm:text-[11px]">
            Next color
          </span>
          <span className="font-mono text-[12px] tabular-nums tracking-tight text-white/90 sm:text-sm">
            {nextPuzzleCountdown}
          </span>
        </div>
      </div>

      <div className="mx-2 my-1 flex min-h-0 flex-1 overflow-hidden rounded-lg">
        {phase === "menu" && (
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-4">
            <div className="flex min-h-[300px] w-full max-w-md flex-col rounded-xl border border-white/15 bg-white/4 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <div className="flex flex-col gap-3 text-left">
                <h2 className="font-sans text-3xl font-semibold tracking-tight text-white sm:text-[2rem]">COLOR MEMORY</h2>
                <div className="max-w-[34ch] space-y-2 text-base leading-relaxed font-medium text-white/75">
                  <p>Memorize each color before it disappears.</p>
                  <p>5 rounds. Match fast. Score high.</p>
                </div>
              </div>

              <div className="mt-auto flex items-end justify-start pt-6">
                <button
                  type="button"
                  onClick={startMemorize}
                  className="group inline-flex items-center gap-2 text-white/90 outline-none transition-colors duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                  aria-label="Start daily color challenge"
                >
                  <span className="color-memory-play-shimmer relative font-mono text-base font-semibold tracking-[0.12em] uppercase">
                    PLAY
                  </span>
                  <ArrowRight
                    className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                    aria-hidden
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === "memorize" && (
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-4">
            <div className="relative flex min-h-[300px] w-full max-w-md flex-col overflow-hidden rounded-xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.3)]" style={{ backgroundColor: hsbToCss(target) }}>
              <div className="flex items-start justify-between px-4 pt-4">
                <p className="font-mono text-sm font-medium tracking-[0.06em] text-white/75">
                  {`${currentAttempt}/${TOTAL_ATTEMPTS}`}
                </p>
              </div>

              <div className="flex min-h-0 flex-1 items-center justify-end px-5 pb-5">
                <div className="text-right text-white">
                  <p key={secondsLeft} className="font-mono text-[92px] font-semibold leading-[0.9] tracking-tight color-memory-countdown">
                    {secondsLeft}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white/95">Seconds to remember</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === "guess" && (
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-4">
            <div className="flex min-h-[300px] w-full max-w-md overflow-hidden rounded-xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <div className="flex w-[120px] shrink-0 gap-px bg-black/20">
                {(
                  [
                    {
                      key: "h",
                      label: "Hue",
                      min: 0,
                      max: 359,
                      track: "linear-gradient(to top, #ff0000, #ff8a00, #ffee00, #19ff00, #00f6ff, #0019ff, #cc00ff, #ff0000)",
                    },
                    {
                      key: "s",
                      label: "Saturation",
                      min: 0,
                      max: 100,
                      track: `linear-gradient(to top, hsl(${guess.h} 0% ${guess.b}%), hsl(${guess.h} 100% ${guess.b}%))`,
                    },
                    {
                      key: "b",
                      label: "Brightness",
                      min: 0,
                      max: 100,
                      track: `linear-gradient(to top, hsl(${guess.h} ${guess.s}% 0%), hsl(${guess.h} ${guess.s}% 100%))`,
                    },
                  ] as const
                ).map((slider) => (
                  <div key={slider.key} className="relative flex flex-1 overflow-hidden">
                    <div className="absolute inset-0" style={{ background: slider.track }} />
                    <VerticalSlider
                      min={slider.min}
                      max={slider.max}
                      value={guess[slider.key]}
                      onChange={(next) => setGuess((prev) => ({ ...prev, [slider.key]: next }))}
                      label={slider.label}
                      onActiveChange={(active) => setActiveSlider(active ? slider.key : null)}
                    />
                  </div>
                ))}
              </div>

              <div
                className="relative flex min-h-0 flex-1 flex-col justify-end p-5"
                style={{ backgroundColor: hsbToCss(guess) }}
                aria-label="Current guessed color preview"
              >
                <p className="absolute top-4 left-4 font-mono text-sm font-medium tracking-[0.06em] text-black/70">{`${currentAttempt}/${TOTAL_ATTEMPTS}`}</p>

                <div className="flex items-end justify-between">
                  <p className="font-mono text-sm font-semibold tracking-[0.06em] text-black/70 transition-opacity duration-150" style={{ opacity: activeSliderLabel ? 1 : 0 }}>
                    {activeSliderLabel ?? " "}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setGuesses((prev) => [...prev, guess])
                      setPhase("round-result")
                    }}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/20 bg-white/15 text-black outline-none transition hover:bg-white/25 focus-visible:ring-1 focus-visible:ring-black/30 focus-visible:ring-offset-1"
                    aria-label="Submit guess"
                  >
                    <Crosshair className="h-6 w-6" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === "round-result" && (
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-4">
            <div className="flex min-h-[300px] w-full max-w-md flex-col overflow-hidden rounded-xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <div className="flex min-h-0 flex-1 flex-col">
                <div
                  className="relative flex min-h-0 flex-[1.15] items-center justify-between px-4 py-3"
                  style={{ backgroundColor: hsbToCss(guess) }}
                >
                  <p className="absolute top-3 left-3 font-mono text-xs font-medium text-white/90">{`${currentAttempt}/${TOTAL_ATTEMPTS}`}</p>
                  <div className="mt-8 text-left font-mono text-lg font-semibold text-white">
                    <p>{`H${guess.h} S${guess.s} B${guess.b}`}</p>
                    <p className="mt-1 text-[11px] tracking-[0.06em] text-white/85">Your Selection</p>
                  </div>
                  <div className="text-right text-white">
                    <p className="font-mono text-7xl font-semibold leading-none">{score.toFixed(2)}</p>
                  </div>
                </div>
                <div
                  className="flex min-h-0 flex-1 items-end justify-between px-4 py-3"
                  style={{ backgroundColor: hsbToCss(target) }}
                >
                  <div className="font-mono text-lg font-semibold text-white">
                    <p>{`H${target.h} S${target.s} B${target.b}`}</p>
                    <p className="mt-1 text-[11px] tracking-[0.06em] text-white/85">Original</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (currentAttempt < TOTAL_ATTEMPTS) {
                        setCurrentAttempt((prev) => prev + 1)
                        setGuess(DEFAULT_GUESS)
                        setRemainingMs(MEMORIZE_TOTAL_MS)
                        setPhase("memorize")
                      } else {
                        setPhase("result")
                      }
                    }}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white outline-none transition hover:bg-white/25 focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:ring-offset-1 focus-visible:ring-offset-black/20"
                    aria-label={currentAttempt < TOTAL_ATTEMPTS ? "Next round" : "See results"}
                  >
                    <ArrowRight className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === "result" && (
          <div className="flex min-h-0 flex-1 flex-col p-6">
            <div className="flex flex-1 items-center justify-center">
              <div className="flex gap-2">
                {guesses.map((g, i) => (
                  <SplitSquare key={i} guess={g} target={targets[i]} />
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={resetForCurrentDay}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white outline-none transition hover:bg-white/25 focus-visible:ring-1 focus-visible:ring-white/80 focus-visible:ring-offset-1 focus-visible:ring-offset-black/20"
                aria-label="Play again"
              >
                <RotateCcw className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes colorMemoryCountdownPulse {
          0% {
            opacity: 0.3;
            transform: scale(1.2) translateY(-8px);
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .color-memory-countdown {
          animation: colorMemoryCountdownPulse 0.85s ease-out;
        }

        @keyframes colorMemoryPlayShimmer {
          0% {
            background-position: -160% 0;
          }
          100% {
            background-position: 160% 0;
          }
        }

        .color-memory-play-shimmer {
          color: transparent;
          background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.98) 45%, rgba(255, 255, 255, 0.55) 100%);
          background-size: 220% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          animation: colorMemoryPlayShimmer 2.3s linear infinite;
        }
      `}</style>
    </div>
  )
}
