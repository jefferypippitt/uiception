"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Delete } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSound } from "@/hooks/use-sound"
import { useOptionalSoundPreference } from "@/contexts/sound-preference"
import { switch005Sound } from "@/lib/switch-005"
import { gFireworkBoomGeneral1Sound } from "@/lib/g-firework-boom-general-1"
import { back001Sound } from "@/lib/back-001"
import { select006Sound } from "@/lib/select-006"
import type { WordleTileResult } from "@/lib/wordle/score"
import {
  getWordleTodayMeta,
  nextDailyPuzzleBoundaryUtcMs,
  normalizeWordleTimeZone,
} from "@/lib/wordle/daily"
import { submitWordleGuess } from "@/lib/wordle/actions"
import { toast } from "sonner"

const ROWS = 6
const COLS = 5

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
] as const

/** Client-side gap after validation errors so ENTER cannot be hammered. */
const COOLDOWN_NOT_IN_LIST_MS = 2200
const COOLDOWN_SHORT_HINT_MS = 1000

type GuessRow = { guess: string; scores: WordleTileResult[] }
const CONFETTI_COLORS = [
  "#6aaa64",
  "#c9b458",
  "#16c60c",
  "#d7ba2f",
  "#4fc1ff",
  "#ff7aa2",
] as const

function formatCountdown(msRemaining: number): string {
  const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`
}

function rankTile(a: WordleTileResult): number {
  if (a === "correct") return 3
  if (a === "present") return 2
  return 1
}

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H

    const GRAVITY = 750
    const COUNT = 90
    const SPEED_MIN = 300
    const SPEED_MAX = 680
    const CONE_MIN = 5
    const CONE_MAX = 65
    const cannonY = H * 0.66

    type Particle = {
      x: number
      y: number
      vx: number
      vy: number
      w: number
      h: number
      rot: number
      spin: number
      color: string
      alpha: number
      decay: number
      isCircle: boolean
    }

    const particles: Particle[] = []

    function spawnCannon(fromLeft: boolean) {
      const dir = fromLeft ? 1 : -1
      const ox = fromLeft ? 2 : W - 2
      for (let i = 0; i < COUNT; i++) {
        const angleDeg = CONE_MIN + Math.random() * (CONE_MAX - CONE_MIN)
        const rad = (angleDeg * Math.PI) / 180
        const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN)
        particles.push({
          x: ox,
          y: cannonY + (Math.random() - 0.5) * 14,
          vx: dir * Math.cos(rad) * speed,
          vy: -Math.sin(rad) * speed,
          w: 3 + Math.random() * 5,
          h: 6 + Math.random() * 6,
          rot: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 18,
          color:
            CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          alpha: 1,
          decay: 0.36 + Math.random() * 0.26,
          isCircle: Math.random() < 0.2,
        })
      }
    }

    spawnCannon(true)
    spawnCannon(false)

    let raf = 0
    let lastTs = 0

    function tick(ts: number) {
      const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : 0.016
      lastTs = ts

      ctx.clearRect(0, 0, W, H)

      let alive = false
      for (const p of particles) {
        if (p.alpha <= 0) continue
        alive = true

        p.vy += GRAVITY * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.rot += p.spin * dt
        p.alpha = Math.max(0, p.alpha - p.decay * dt)

        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color

        if (p.isCircle) {
          ctx.beginPath()
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          const tumble = Math.max(0.15, Math.abs(Math.cos(p.rot * 2.8)))
          ctx.fillRect(-p.w / 2, -(p.h * tumble) / 2, p.w, p.h * tumble)
        }

        ctx.restore()
      }

      if (alive) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10"
      style={{ width: "100%", height: "100%" }}
    />
  )
}

type SavedState = {
  rows: GuessRow[]
  status: "playing" | "won" | "lost"
  revealedAnswer: string | null
}

const EMPTY_SAVED: SavedState = {
  rows: [],
  status: "playing",
  revealedAnswer: null,
}

function loadDayState(dayKey: string): SavedState {
  try {
    const raw = localStorage.getItem(`wordle-${dayKey}`)
    if (!raw) return EMPTY_SAVED
    const p = JSON.parse(raw) as Record<string, unknown>
    return {
      rows: Array.isArray(p.rows) ? (p.rows as GuessRow[]) : [],
      status: p.status === "won" || p.status === "lost" ? p.status : "playing",
      revealedAnswer:
        typeof p.revealedAnswer === "string" ? p.revealedAnswer : null,
    }
  } catch {
    return EMPTY_SAVED
  }
}

function mergeKeyStates(
  prev: Map<string, WordleTileResult>,
  guess: string,
  scores: WordleTileResult[]
): Map<string, WordleTileResult> {
  const next = new Map(prev)
  for (let i = 0; i < COLS; i++) {
    const ch = guess[i]!.toUpperCase()
    const s = scores[i]!
    const cur = next.get(ch)
    if (!cur || rankTile(s) > rankTile(cur)) next.set(ch, s)
  }
  return next
}

export default function Wordle() {
  const soundEnabled = useOptionalSoundPreference()
  const [playLetterInput] = useSound(switch005Sound, {
    volume: 0.35,
    interrupt: true,
    soundEnabled,
  })
  const [playWin] = useSound(gFireworkBoomGeneral1Sound, {
    volume: 0.5,
    interrupt: false,
    soundEnabled,
  })
  const [playBackspace] = useSound(back001Sound, {
    volume: 0.35,
    interrupt: true,
    soundEnabled,
  })
  const [playNotInList] = useSound(select006Sound, {
    volume: 0.4,
    interrupt: true,
    soundEnabled,
  })

  const [visitorTimeZone] = useState<string>(() => {
    const raw = Intl.DateTimeFormat().resolvedOptions().timeZone?.trim()
    return normalizeWordleTimeZone(raw || undefined)
  })
  /** When > Date.now(), submit (Enter + button) is ignored and ENTER is disabled. */
  const [submitCooldownUntilMs, setSubmitCooldownUntilMs] = useState(0)
  const [initMeta] = useState(() => getWordleTodayMeta(visitorTimeZone))
  const [savedState] = useState(() => loadDayState(initMeta.dayKey))
  const [dayKey, setDayKey] = useState(initMeta.dayKey)
  const [puzzleNumber, setPuzzleNumber] = useState(initMeta.puzzleNumber)
  const [rows, setRows] = useState<GuessRow[]>(savedState.rows)
  const [draft, setDraft] = useState("")
  const [shake, setShake] = useState(false)
  const [status, setStatus] = useState<"playing" | "won" | "lost">(
    savedState.status
  )
  const [submitting, setSubmitting] = useState(false)
  const [revealedAnswer, setRevealedAnswer] = useState<string | null>(
    savedState.revealedAnswer
  )
  const [nowMs, setNowMs] = useState(() => Date.now())

  const playing = status === "playing"

  useEffect(() => {
    if (rows.length === 0 && status === "playing") return
    try {
      localStorage.setItem(
        `wordle-${dayKey}`,
        JSON.stringify({ rows, status, revealedAnswer })
      )
    } catch {
      /* storage full or unavailable */
    }
  }, [rows, status, revealedAnswer, dayKey])

  useEffect(() => {
    if (submitCooldownUntilMs <= 0) return
    const ms = submitCooldownUntilMs - Date.now()
    if (ms <= 0) {
      setSubmitCooldownUntilMs(0)
      return
    }
    const id = window.setTimeout(() => setSubmitCooldownUntilMs(0), ms)
    return () => window.clearTimeout(id)
  }, [submitCooldownUntilMs])

  const submitOnCooldown = Date.now() < submitCooldownUntilMs

  const keyStates = useMemo(() => {
    let m = new Map<string, WordleTileResult>()
    for (const { guess, scores } of rows) {
      m = mergeKeyStates(m, guess, scores)
    }
    return m
  }, [rows])

  const resetBoard = useCallback(() => {
    setRows([])
    setDraft("")
    setStatus("playing")
    setShake(false)
    setRevealedAnswer(null)
    setSubmitCooldownUntilMs(0)
  }, [])

  useEffect(() => {
    const sync = () => {
      const t = getWordleTodayMeta(visitorTimeZone)
      setPuzzleNumber((prev) => {
        if (t.puzzleNumber !== prev) {
          queueMicrotask(() => {
            resetBoard()
            setDayKey(t.dayKey)
          })
          return t.puzzleNumber
        }
        return prev
      })
    }
    sync()
    const id = window.setInterval(sync, 60_000)
    const onVis = () => {
      if (document.visibilityState === "visible") sync()
    }
    document.addEventListener("visibilitychange", onVis)
    return () => {
      window.clearInterval(id)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [visitorTimeZone, resetBoard])

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const addLetter = useCallback(
    (ch: string) => {
      if (!playing || submitting || draft.length >= COLS) return
      setDraft((d) => d + ch.toLowerCase())
      playLetterInput()
    },
    [playing, submitting, draft.length, playLetterInput]
  )

  const backspace = useCallback(() => {
    if (!playing || submitting) return
    setDraft((d) => d.slice(0, -1))
    playBackspace()
  }, [playing, submitting, playBackspace])

  const submit = useCallback(async () => {
    if (!playing || submitting || submitOnCooldown) return
    if (draft.length !== COLS) {
      setSubmitCooldownUntilMs(Date.now() + COOLDOWN_SHORT_HINT_MS)
      toast("Not enough letters", { id: "wordle-hint" })
      return
    }
    const w = draft.toLowerCase()
    if (!/^[a-z]{5}$/.test(w)) return

    setSubmitting(true)
    try {
      const data = await submitWordleGuess(
        w,
        rows.length,
        puzzleNumber,
        visitorTimeZone
      )

      if (!data.ok) {
        if (data.error === "not_in_list") {
          setSubmitCooldownUntilMs(Date.now() + COOLDOWN_NOT_IN_LIST_MS)
          setShake(true)
          toast("Not in word list", { id: "wordle-hint" })
          playNotInList()
          window.setTimeout(() => setShake(false), 450)
        } else if (data.error === "bad_puzzle") {
          setSubmitCooldownUntilMs(Date.now() + COOLDOWN_SHORT_HINT_MS)
          toast.error("That puzzle is not available", { id: "wordle-hint" })
        } else {
          setSubmitCooldownUntilMs(Date.now() + COOLDOWN_SHORT_HINT_MS)
          toast.error("Could not submit guess", { id: "wordle-hint" })
        }
        return
      }

      if (data.won) {
        window.setTimeout(() => playWin(), 130)
      }

      setRows((r) => [...r, { guess: w, scores: data.scores }])
      setDraft("")
      if (data.won) setStatus("won")
      else if (data.lost && data.answer) {
        setStatus("lost")
        setRevealedAnswer(data.answer)
      }
    } catch {
      toast.error("Network error — try again", { id: "wordle-hint" })
    } finally {
      setSubmitting(false)
    }
  }, [
    playing,
    submitting,
    submitOnCooldown,
    draft,
    rows.length,
    puzzleNumber,
    visitorTimeZone,
    playWin,
    playNotInList,
  ])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === "Enter") {
        e.preventDefault()
        void submit()
        return
      }
      if (e.key === "Backspace") {
        e.preventDefault()
        backspace()
        return
      }
      if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault()
        addLetter(e.key)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [addLetter, backspace, submit])

  function tileClasses(
    result: WordleTileResult | undefined,
    hasLetter: boolean
  ): string {
    if (result === "correct")
      return "border-green-800/50 bg-green-950 text-green-300"
    if (result === "present")
      return "border-amber-700/50 bg-amber-950 text-amber-300"
    if (result === "absent")
      return "border-white/[0.06] bg-white/[0.04] text-white/25"
    if (hasLetter) return "border-white/30 bg-white/[0.07] text-white/90"
    return "border-white/[0.07] bg-white/[0.03] text-transparent"
  }

  function keyCapClasses(ch: string): string {
    const st = keyStates.get(ch)
    if (st === "correct")
      return "bg-green-950 border border-green-800/40 text-green-300"
    if (st === "present")
      return "bg-amber-950 border border-amber-700/40 text-amber-300"
    if (st === "absent")
      return "bg-white/[0.03] border border-white/5 text-white/20"
    return "bg-white/[0.07] border border-white/10 text-white/70 hover:bg-white/[0.12] hover:text-white/90"
  }

  const msUntilNextPuzzle =
    nextDailyPuzzleBoundaryUtcMs(new Date(nowMs), visitorTimeZone) - nowMs
  const nextPuzzleCountdown = formatCountdown(msUntilNextPuzzle)
  const formattedLocalDate = (() => {
    const [year, month, day] = dayKey.split("-")
    return month && day && year ? `${month}-${day}-${year}` : dayKey
  })()

  return (
    <div
      data-wordle-root
      className="relative flex h-96 min-h-0 flex-col bg-black px-1.5 py-1 text-[#d7dadc]"
      aria-label="Word guessing game"
    >
      <div
        className="flex shrink-0 items-baseline gap-x-1 pb-1.5 text-[11px] leading-tight text-[#d7dadc] sm:text-xs"
        aria-label="Daily puzzle and reset time"
      >
        <div className="min-w-0 flex-1 text-left">
          <span className="block text-[10px] font-medium tracking-wide text-white/45 uppercase sm:text-[11px]">
            Daily
          </span>
          <span className="font-mono text-[12px] font-semibold text-white tabular-nums sm:text-sm">
            #{puzzleNumber}
          </span>
        </div>
        <div className="min-w-0 flex-1 px-1.5 text-center sm:px-2">
          <span className="block text-[10px] font-medium tracking-wide text-white/45 uppercase sm:text-[11px]">
            Local
          </span>
          <span className="font-mono text-[12px] text-white/90 tabular-nums sm:text-sm">
            {formattedLocalDate}
          </span>
        </div>
        <div className="min-w-0 flex-1 text-right">
          <span className="block text-[10px] font-medium tracking-wide text-white/45 uppercase sm:text-[11px]">
            Next word
          </span>
          <span className="font-mono text-[12px] tracking-tight text-white/90 tabular-nums sm:text-sm">
            {nextPuzzleCountdown}
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="flex w-full max-w-[320px] flex-col items-center gap-3">
          <div
            className={cn(
              "flex w-full max-w-[220px] flex-col gap-1",
              shake && "wordle-shake"
            )}
          >
            {Array.from({ length: ROWS }, (_, row) => {
              const committed = rows[row]
              const scores = committed?.scores
              const isCurrent = row === rows.length && playing
              return (
                <div key={row} className="grid w-full grid-cols-5 gap-1">
                  {Array.from({ length: COLS }, (_, col) => {
                    let letter: string | null = null
                    let result: WordleTileResult | undefined
                    if (committed) {
                      letter = committed.guess[col] ?? null
                      result = scores?.[col]
                    } else if (isCurrent) {
                      letter = draft[col] ?? null
                    }
                    const has = letter != null && letter !== ""
                    const display = letter?.toUpperCase() ?? ""
                    return (
                      <div
                        key={col}
                        className={cn(
                          "flex aspect-square max-h-[26px] min-h-0 w-full items-center justify-center rounded-sm border font-mono text-[11px] font-medium tracking-wide uppercase sm:max-h-[28px] sm:text-xs",
                          tileClasses(result, has)
                        )}
                      >
                        {display}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          <div className="flex w-full max-w-[min(100%,320px)] shrink-0 flex-col gap-1">
            {KEYBOARD_ROWS.map((row, ri) => (
              <div
                key={ri}
                className={cn("flex justify-center gap-1", ri === 1 && "px-1")}
              >
                {row.map((key) => {
                  if (key === "ENTER") {
                    return (
                      <button
                        key={key}
                        type="button"
                        disabled={submitting || submitOnCooldown}
                        onClick={() => void submit()}
                        className={cn(
                          "flex h-7 min-w-[40px] shrink-0 items-center justify-center rounded-md px-0.5 font-mono text-[8px] font-medium tracking-[0.18em] transition-colors outline-none select-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-1 focus-visible:ring-offset-black enabled:cursor-pointer disabled:opacity-40 sm:h-8 sm:min-w-[44px] sm:text-[9px]",
                          keyCapClasses("")
                        )}
                      >
                        ENTER
                      </button>
                    )
                  }
                  if (key === "BACK") {
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-label="Backspace"
                        disabled={submitting}
                        onClick={backspace}
                        className={cn(
                          "flex h-7 min-w-[32px] shrink-0 items-center justify-center rounded-md px-1 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-1 focus-visible:ring-offset-black enabled:cursor-pointer disabled:opacity-40 sm:h-8 sm:min-w-[36px]",
                          keyCapClasses("")
                        )}
                      >
                        <Delete
                          className="h-3.5 w-3.5"
                          strokeWidth={2.5}
                          aria-hidden
                        />
                      </button>
                    )
                  }
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={submitting}
                      onClick={() => addLetter(key)}
                      className={cn(
                        "flex h-7 min-w-0 flex-1 basis-0 items-center justify-center rounded-md font-mono text-[10px] font-medium tracking-wide transition-colors outline-none select-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-1 focus-visible:ring-offset-black enabled:cursor-pointer disabled:opacity-40 sm:h-8 sm:text-[11px]",
                        keyCapClasses(key)
                      )}
                    >
                      {key}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {status === "won" && <ConfettiCanvas />}

      {(status === "won" || status === "lost") && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
          <p className="font-mono text-7xl font-bold tracking-[0.25em] text-white/32 uppercase sm:text-8xl">
            {status === "won" ? "congrats" : (revealedAnswer ?? "")}
          </p>
        </div>
      )}

      <style jsx global>{`
        @keyframes wordleShake {
          0%,
          100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-6px);
          }
          40% {
            transform: translateX(6px);
          }
          60% {
            transform: translateX(-4px);
          }
          80% {
            transform: translateX(4px);
          }
        }
        .wordle-shake {
          animation: wordleShake 0.45s ease-in-out;
        }
      `}</style>
    </div>
  )
}
