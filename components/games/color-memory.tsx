"use client"

import { ArrowRight } from "lucide-react"
import { ThumbsUp } from "@phosphor-icons/react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSound } from "@/hooks/use-sound"
import { useOptionalSoundPreference } from "@/contexts/sound-preference"
import { click8bitSound } from "@/lib/click-8bit"
import { clickSoftSound } from "@/lib/click-soft"
import { drop003Sound } from "@/lib/drop-003"
import { type ColorMemoryHsb, getColorMemoryTodayMeta } from "@/lib/color-memory-daily"

const MEMORIZE_SECONDS = 5
const MEMORIZE_TOTAL_MS = MEMORIZE_SECONDS * 1000
const TOTAL_ATTEMPTS = 5
const READY_SET_GO_WORDS = ["READY", "SET", "GO"] as const
const READY_SET_GO_STEP_MS = 800

type Phase = "menu" | "ready-set-go" | "memorize" | "guess" | "round-result" | "result"
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

function hslToLab(h: number, s: number, l: number): [number, number, number] {
  const sl = s / 100, ll = l / 100
  const a = sl * Math.min(ll, 1 - ll)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
  }
  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  const r = toLinear(f(0)), g = toLinear(f(8)), b = toLinear(f(4))

  // Linear RGB → XYZ D65 normalized by white point
  const x = (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047
  const y =  0.2126729 * r + 0.7151522 * g + 0.0721750 * b
  const z = (0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / 1.08883

  const fLab = (t: number) => t > 0.008856 ? t ** (1 / 3) : 7.787 * t + 16 / 116
  return [
    116 * fLab(y) - 16,
    500 * (fLab(x) - fLab(y)),
    200 * (fLab(y) - fLab(z)),
  ]
}

function scoreGuess(guess: ColorMemoryHsb, target: ColorMemoryHsb): number {
  const [L1, a1, b1] = hslToLab(target.h, target.s, target.b)
  const [L2, a2, b2] = hslToLab(guess.h, guess.s, guess.b)
  const dE = Math.sqrt((L1 - L2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2)

  // Sigmoid curve: dE → 0–10 (constants from dialed.gg, tuned over 9M+ games)
  const base = 10 / (1 + (dE / 38) ** 1.6)

  const hueDist = hueDistanceDegrees(guess.h, target.h) / 180
  const avgSat = (guess.s + target.s) / 200

  // Reward correct hue even when S/B are off (hue only matters on vivid colors)
  const recovery = 0.5 * (1 - hueDist) * avgSat

  // Penalize wrong hue when S/B happen to be deceptively similar
  const sbCloseness = 1 - (Math.abs(guess.s - target.s) / 100 + Math.abs(guess.b - target.b) / 100) / 2
  const penalty = 0.4 * hueDist * sbCloseness * avgSat

  return Math.round(clamp(base + recovery - penalty, 0, 10) * 100) / 100
}

function hsbToCss({ h, s, b }: ColorMemoryHsb): string {
  return `hsl(${h} ${s}% ${b}%)`
}

function hslLuminance(h: number, s: number, l: number): number {
  const sl = s / 100
  const ll = l / 100
  const a = sl * Math.min(ll, 1 - ll)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
  }
  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  return 0.2126 * toLinear(f(0)) + 0.7152 * toLinear(f(8)) + 0.0722 * toLinear(f(4))
}

function needsDarkText({ h, s, b }: ColorMemoryHsb): boolean {
  return hslLuminance(h, s, b) > 0.179
}

const DEFAULT_GUESS: ColorMemoryHsb = { h: 180, s: 50, b: 50 }

function SplitSquare({ guess, target }: { guess: ColorMemoryHsb; target: ColorMemoryHsb }) {
  const guessDark = needsDarkText(guess)
  const targetDark = needsDarkText(target)
  return (
    <div className="relative h-24 w-24 overflow-hidden rounded-xl">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: hsbToCss(guess), clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: hsbToCss(target), clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
      />
      <p className={`absolute top-1.5 left-1.5 text-[10px] font-semibold leading-none ${guessDark ? "text-black/60" : "text-white/80"}`}>you</p>
      <p className={`absolute right-1.5 bottom-1.5 text-[10px] font-semibold leading-none ${targetDark ? "text-black/60" : "text-white/80"}`}>original</p>
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
  const lastPuzzleNumberRef = useRef(initialMeta.puzzleNumber)
  const [targets, setTargets] = useState<ColorMemoryHsb[]>(initialMeta.colors)
  const [guess, setGuess] = useState<ColorMemoryHsb>(DEFAULT_GUESS)
  const [guesses, setGuesses] = useState<ColorMemoryHsb[]>([])
  const [currentAttempt, setCurrentAttempt] = useState(1)
  const [remainingMs, setRemainingMs] = useState<number>(MEMORIZE_TOTAL_MS)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [activeSlider, setActiveSlider] = useState<"h" | "s" | "b" | null>(null)
  const [readySetGoStep, setReadySetGoStep] = useState(0)
  const soundEnabled = useOptionalSoundPreference()
  const [playClick] = useSound(clickSoftSound, { volume: 0.22, interrupt: true, soundEnabled })
  const [playUiClick] = useSound(click8bitSound, { volume: 0.3, interrupt: true, soundEnabled })
  const [playCountdownTick] = useSound(drop003Sound, { volume: 0.2, interrupt: true, soundEnabled })
  const lastSliderSoundMsRef = useRef(0)
  const lastCountdownTickRef = useRef<string | null>(null)

  const activeSliderLabel = activeSlider === "h" ? "Hue" : activeSlider === "s" ? "Saturation" : activeSlider === "b" ? "Brightness" : null

  const msUntilNextPuzzle = nextLocalMidnightMs(nowMs) - nowMs
  const nextPuzzleCountdown = formatCountdown(msUntilNextPuzzle)
  const target = targets[currentAttempt - 1] ?? targets[0]
  const score = scoreGuess(guess, target)
  const secondsLeftPrecise = Math.max(0, remainingMs / 1000)
  const countdownDisplay = secondsLeftPrecise.toFixed(2)
  const readySetGoLabel = READY_SET_GO_WORDS[readySetGoStep] ?? READY_SET_GO_WORDS[READY_SET_GO_WORDS.length - 1]

  const resetForCurrentDay = useCallback(() => {
    const nextMeta = getColorMemoryTodayMeta(browserTimeZone)
    lastPuzzleNumberRef.current = nextMeta.puzzleNumber
    setTargets(nextMeta.colors)
    setGuess(DEFAULT_GUESS)
    setGuesses([])
    setCurrentAttempt(1)
    setRemainingMs(MEMORIZE_TOTAL_MS)
    setPhase("menu")
    setReadySetGoStep(0)
  }, [browserTimeZone])

  const startMemorize = useCallback(() => {
    setGuess(DEFAULT_GUESS)
    setGuesses([])
    setCurrentAttempt(1)
    setRemainingMs(MEMORIZE_TOTAL_MS)
    setReadySetGoStep(0)
    setPhase("ready-set-go")
  }, [])

  const playSliderFeedback = useCallback(() => {
    const now = performance.now()
    if (now - lastSliderSoundMsRef.current < 35) return
    lastSliderSoundMsRef.current = now
    playClick()
  }, [playClick])

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const sync = () => {
      const nextMeta = getColorMemoryTodayMeta(browserTimeZone)
      if (nextMeta.puzzleNumber !== lastPuzzleNumberRef.current) {
        lastPuzzleNumberRef.current = nextMeta.puzzleNumber
        queueMicrotask(() => {
          setTargets(nextMeta.colors)
          setGuess(DEFAULT_GUESS)
          setGuesses([])
          setCurrentAttempt(1)
          setRemainingMs(MEMORIZE_TOTAL_MS)
          setPhase("menu")
          setReadySetGoStep(0)
        })
      }
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
    if (phase !== "ready-set-go") return

    setReadySetGoStep(0)
    playUiClick()
    const id = window.setInterval(() => {
      setReadySetGoStep((prev) => {
        if (prev >= READY_SET_GO_WORDS.length - 1) {
          window.clearInterval(id)
          setRemainingMs(MEMORIZE_TOTAL_MS)
          setPhase("memorize")
          return prev
        }
        playUiClick()
        return prev + 1
      })
    }, READY_SET_GO_STEP_MS)

    return () => window.clearInterval(id)
  }, [phase, playUiClick])

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

  useEffect(() => {
    if (phase !== "memorize") {
      lastCountdownTickRef.current = null
      return
    }
    if (secondsLeftPrecise <= 0) return
    if (lastCountdownTickRef.current === countdownDisplay) return

    lastCountdownTickRef.current = countdownDisplay
    playCountdownTick()
  }, [phase, secondsLeftPrecise, countdownDisplay, playCountdownTick])

  const targetDark = needsDarkText(target)
  const guessDark = needsDarkText(guess)

  return (
    <div
      className="relative flex h-96 min-h-0 flex-col bg-black px-1.5 py-1 text-[#e6edf3]"
      aria-label="Color memory game"
    >
      <div
        className="flex shrink-0 items-baseline gap-x-1 pb-1.5 text-[10px] leading-tight text-[#d7dadc] sm:text-[11px]"
        aria-label="Time until next daily color"
      >
        <div className="min-w-0 flex-1" aria-hidden />
        <div className="min-w-0 flex-1" aria-hidden />
        <div className="min-w-0 flex-1 text-right">
          <span className="block text-[9px] font-medium tracking-wide text-white/45 uppercase sm:text-[10px]">
            Next color
          </span>
          <span className="text-[11px] tabular-nums tracking-tight text-white/90 sm:text-xs">
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
                  <p>A new color drops every day. Study it, then match it from memory.</p>
                  <p>5 rounds. Scored on how close your eye really is.</p>
                </div>
              </div>

              <div className="mt-auto flex items-end justify-start pt-6">
                <button
                  type="button"
                  onClick={() => {
                    playUiClick()
                    startMemorize()
                  }}
                  className="group inline-flex items-center gap-2 text-white/90 outline-none transition-colors duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                  aria-label="Start daily color challenge"
                >
                  <span className="color-memory-play-shimmer relative text-base font-semibold tracking-[0.12em] uppercase">
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
                <p className={`text-sm font-medium tracking-[0.06em] ${targetDark ? "text-black/60" : "text-white/75"}`}>
                  {`${currentAttempt}/${TOTAL_ATTEMPTS}`}
                </p>
                <div className="text-right">
                  <p
                    key={countdownDisplay}
                    className={`text-[44px] font-semibold leading-none tracking-tight color-memory-countdown color-memory-ticker ${targetDark ? "text-black" : "text-white"}`}
                  >
                    {countdownDisplay.split(".")[0]}
                    <span className="opacity-30 text-[0.6em]">.{countdownDisplay.split(".")[1]}</span>
                  </p>
                  <p className={`mt-1 text-[11px] font-semibold tracking-[0.07em] uppercase ${targetDark ? "text-black/60" : "text-white"}`}>
                    Seconds to remember
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === "ready-set-go" && (
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-4">
            <div className="relative flex min-h-[300px] w-full max-w-md items-start justify-end overflow-hidden rounded-xl border border-white/15 bg-black px-4 pt-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <p
                key={readySetGoLabel}
                className="text-right text-5xl font-semibold tracking-[0.08em] text-white sm:text-6xl color-memory-ready-set-go"
              >
                {readySetGoLabel}
              </p>
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
                      track: "linear-gradient(to top, hsl(0 100% 50%), hsl(60 100% 50%), hsl(120 100% 50%), hsl(180 100% 50%), hsl(240 100% 50%), hsl(300 100% 50%), hsl(360 100% 50%))",
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
                      onChange={(next) =>
                        setGuess((prev) => {
                          if (prev[slider.key] === next) return prev
                          playSliderFeedback()
                          return { ...prev, [slider.key]: next }
                        })
                      }
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
                <p className={`absolute top-4 left-4 text-sm font-medium tracking-[0.06em] ${guessDark ? "text-black/60" : "text-white/70"}`}>{`${currentAttempt}/${TOTAL_ATTEMPTS}`}</p>

                <div className="flex items-end justify-between">
                  <p className={`text-sm font-semibold tracking-[0.06em] transition-opacity duration-150 ${guessDark ? "text-black/60" : "text-white/70"}`} style={{ opacity: activeSliderLabel ? 1 : 0 }}>
                    {activeSliderLabel ?? " "}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      playUiClick()
                      setGuesses((prev) => [...prev, guess])
                      setPhase("round-result")
                    }}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full outline-none transition focus-visible:ring-1 focus-visible:ring-offset-1 ${guessDark ? "border border-black/25 bg-black/10 text-black hover:bg-black/20 focus-visible:ring-black/30 focus-visible:ring-offset-transparent" : "border border-white/25 bg-white/15 text-white hover:bg-white/25 focus-visible:ring-white/80 focus-visible:ring-offset-black/20"}`}
                    aria-label="Submit guess"
                  >
                    <ThumbsUp className="h-6 w-6" aria-hidden />
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
                  <p className={`absolute top-3 left-3 text-xs font-medium ${guessDark ? "text-black/60" : "text-white/90"}`}>{`${currentAttempt}/${TOTAL_ATTEMPTS}`}</p>
                  <div className={`mt-8 text-left text-lg font-semibold ${guessDark ? "text-black" : "text-white"}`}>
                    <p>{`H${guess.h} S${guess.s} B${guess.b}`}</p>
                    <p className={`mt-1 text-[11px] tracking-[0.06em] ${guessDark ? "text-black/60" : "text-white/85"}`}>Your Selection</p>
                  </div>
                  <div className={`text-right ${guessDark ? "text-black" : "text-white"}`}>
                    <p className="text-7xl font-semibold leading-none">
                      {score.toFixed(2)}
                      <span className={`ml-1.5 text-2xl font-medium ${guessDark ? "text-black/50" : "text-white/50"}`}>/ 10</span>
                    </p>
                  </div>
                </div>
                <div
                  className="flex min-h-0 flex-1 items-end justify-between px-4 py-3"
                  style={{ backgroundColor: hsbToCss(target) }}
                >
                  <div className={`text-lg font-semibold ${targetDark ? "text-black" : "text-white"}`}>
                    <p>{`H${target.h} S${target.s} B${target.b}`}</p>
                    <p className={`mt-1 text-[11px] tracking-[0.06em] ${targetDark ? "text-black/60" : "text-white/85"}`}>Original</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playUiClick()
                      if (currentAttempt < TOTAL_ATTEMPTS) {
                        setCurrentAttempt((prev) => prev + 1)
                        setGuess(DEFAULT_GUESS)
                        setRemainingMs(MEMORIZE_TOTAL_MS)
                        setReadySetGoStep(0)
                        setPhase("ready-set-go")
                      } else {
                        setPhase("result")
                      }
                    }}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full outline-none transition focus-visible:ring-1 focus-visible:ring-offset-1 ${targetDark ? "border border-black/25 bg-black/10 text-black hover:bg-black/20 focus-visible:ring-black/30 focus-visible:ring-offset-transparent" : "border border-white/25 bg-white/15 text-white hover:bg-white/25 focus-visible:ring-white/80 focus-visible:ring-offset-black/20"}`}
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
                onClick={() => {
                  playUiClick()
                  resetForCurrentDay()
                }}
                className="group inline-flex items-center gap-2 text-white/90 outline-none transition-colors duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
                aria-label="Play again"
              >
                <span className="color-memory-play-shimmer relative text-base font-semibold tracking-[0.12em] uppercase">
                  Play Again
                </span>
                <ArrowRight
                  className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                  aria-hidden
                />
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes colorMemoryCountdownPulse {
          0% {
            opacity: 1;
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

        .color-memory-ticker {
          text-shadow: 0 0 18px rgba(255, 255, 255, 0.3);
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.04em;
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

        .color-memory-ready-set-go {
          animation: colorMemoryCountdownPulse 0.42s ease-out;
        }
      `}</style>
    </div>
  )
}
