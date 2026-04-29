"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Delete } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WordleTileResult } from "@/lib/wordle-score"
import { getWordleTodayMeta } from "@/lib/wordle/client"
import { submitWordleGuess } from "@/lib/wordle/actions"

const ROWS = 6
const COLS = 5

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
] as const

type GuessRow = { guess: string; scores: WordleTileResult[] }
const CONFETTI_COLORS = ["#6aaa64", "#c9b458", "#16c60c", "#d7ba2f", "#4fc1ff", "#ff7aa2"] as const

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

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width  = W
    canvas.height = H

    const GRAVITY   = 750    
    const COUNT     = 90     
    const SPEED_MIN = 300
    const SPEED_MAX = 680
    const CONE_MIN  = 5      
    const CONE_MAX  = 65     
    const cannonY   = H * 0.66

    type Particle = {
      x: number; y: number
      vx: number; vy: number
      w: number; h: number
      rot: number; spin: number
      color: string
      alpha: number; decay: number
      isCircle: boolean
    }

    const particles: Particle[] = []

    function spawnCannon(fromLeft: boolean) {
      const dir = fromLeft ? 1 : -1
      const ox  = fromLeft ? 2 : W - 2
      for (let i = 0; i < COUNT; i++) {
        const angleDeg = CONE_MIN + Math.random() * (CONE_MAX - CONE_MIN)
        const rad      = angleDeg * Math.PI / 180
        const speed    = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN)
        particles.push({
          x:        ox,
          y:        cannonY + (Math.random() - 0.5) * 14,
          vx:       dir * Math.cos(rad) * speed,
          vy:      -Math.sin(rad) * speed,
          w:        3 + Math.random() * 5,
          h:        6 + Math.random() * 6,
          rot:      Math.random() * Math.PI * 2,
          spin:     (Math.random() - 0.5) * 18,
          color:    CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          alpha:    1,
          decay:    0.36 + Math.random() * 0.26,  
          isCircle: Math.random() < 0.2,
        })
      }
    }

    spawnCannon(true)
    spawnCannon(false)

    let raf   = 0
    let lastTs = 0

    function tick(ts: number) {
      const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : 0.016
      lastTs = ts

      ctx.clearRect(0, 0, W, H)

      let alive = false
      for (const p of particles) {
        if (p.alpha <= 0) continue
        alive = true

        p.vy    += GRAVITY * dt
        p.x     += p.vx * dt
        p.y     += p.vy * dt
        p.rot   += p.spin * dt
        p.alpha  = Math.max(0, p.alpha - p.decay * dt)

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
  const browserTimeZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    []
  )
  const [rows, setRows] = useState<GuessRow[]>([])
  const [draft, setDraft] = useState("")
  const [shake, setShake] = useState(false)
  const [hint, setHint] = useState<string | null>(null)
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing")
  const [submitting, setSubmitting] = useState(false)
  const initialMeta = useMemo(() => getWordleTodayMeta(browserTimeZone), [browserTimeZone])
  const [dayKey, setDayKey] = useState<string>(initialMeta.dayKey)
  const [puzzleNumber, setPuzzleNumber] = useState<number>(initialMeta.puzzleNumber)
  const [revealedAnswer, setRevealedAnswer] = useState<string | null>(null)
  const [nowMs, setNowMs] = useState(() => Date.now())

  const playing = status === "playing"

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
    setHint(null)
    setStatus("playing")
    setShake(false)
    setRevealedAnswer(null)
  }, [])

  useEffect(() => {
    const sync = () => {
      const t = getWordleTodayMeta(browserTimeZone)
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
    const id = window.setInterval(sync, 60_000)
    const onVis = () => {
      if (document.visibilityState === "visible") sync()
    }
    document.addEventListener("visibilitychange", onVis)
    return () => {
      window.clearInterval(id)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [browserTimeZone, resetBoard])

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const addLetter = useCallback(
    (ch: string) => {
      if (!playing || submitting || draft.length >= COLS) return
      setDraft((d) => d + ch.toLowerCase())
      setHint(null)
    },
    [playing, submitting, draft.length]
  )

  const backspace = useCallback(() => {
    if (!playing || submitting) return
    setDraft((d) => d.slice(0, -1))
  }, [playing, submitting])

  const submit = useCallback(async () => {
    if (!playing || submitting) return
    if (draft.length !== COLS) {
      setHint("Not enough letters")
      return
    }
    const w = draft.toLowerCase()
    if (!/^[a-z]{5}$/.test(w)) return

    setSubmitting(true)
    setHint(null)
    try {
      const data = await submitWordleGuess(w, rows.length, puzzleNumber, browserTimeZone)

      if (!data.ok) {
        if (data.error === "not_in_list") {
          setShake(true)
          setHint("Not in word list")
          window.setTimeout(() => setShake(false), 450)
        } else if (data.error === "bad_puzzle") {
          setHint("That puzzle is not available")
        } else {
          setHint("Could not submit guess")
        }
        return
      }

      setRows((r) => [...r, { guess: w, scores: data.scores }])
      setDraft("")
      if (data.won) setStatus("won")
      else if (data.lost && data.answer) {
        setStatus("lost")
        setRevealedAnswer(data.answer)
      }
    } catch {
      setHint("Network error — try again")
    } finally {
      setSubmitting(false)
    }
  }, [playing, submitting, draft, rows.length, puzzleNumber, browserTimeZone])

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
    if (result === "correct") return "border-[#6aaa64] bg-[#6aaa64] text-white"
    if (result === "present") return "border-[#c9b458] bg-[#c9b458] text-white"
    if (result === "absent") return "border-[#3a3a3c] bg-[#3a3a3c] text-white"
    if (hasLetter) return "border-[#565758] bg-transparent text-[#d7dadc]"
    return "border-white/10 bg-white/5 text-transparent"
  }

  function keyCapClasses(ch: string): string {
    const st = keyStates.get(ch)
    if (st === "correct") return "bg-[#6aaa64] text-white"
    if (st === "present") return "bg-[#c9b458] text-white"
    if (st === "absent") return "bg-[#3a3a3c] text-white"
    return "bg-[#818384] text-white"
  }

  const msUntilNextPuzzle = nextLocalMidnightMs(nowMs) - nowMs
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
            Next word
          </span>
          <span className="font-mono text-[12px] tabular-nums tracking-tight text-white/90 sm:text-sm">
            {nextPuzzleCountdown}
          </span>
        </div>
      </div>

      {hint ? (
        <p
          className="pt-0.5 text-center font-mono text-[10px] leading-tight font-medium tracking-[0.02em] text-[#d7dadc]"
          role="status"
        >
          {hint}
        </p>
      ) : null}

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
                          "flex aspect-square max-h-[26px] min-h-0 w-full items-center justify-center border font-mono text-[11px] font-semibold tracking-[0.02em] uppercase sm:max-h-[28px] sm:text-xs",
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
                        disabled={submitting}
                        onClick={() => void submit()}
                        className={cn(
                          "flex h-7 min-w-[40px] shrink-0 items-center justify-center rounded px-0.5 font-mono text-[8px] font-semibold tracking-widest outline-none select-none focus-visible:ring-1 focus-visible:ring-[#d7ba2f] focus-visible:ring-offset-1 focus-visible:ring-offset-[#121213] enabled:cursor-pointer disabled:opacity-50 sm:h-8 sm:min-w-[44px] sm:text-[9px]",
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
                          "flex h-7 min-w-[32px] shrink-0 items-center justify-center rounded px-1 outline-none focus-visible:ring-1 focus-visible:ring-[#d7ba2f] focus-visible:ring-offset-1 focus-visible:ring-offset-[#121213] enabled:cursor-pointer disabled:opacity-50 sm:h-8 sm:min-w-[36px]",
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
                        "flex h-7 min-w-0 flex-1 basis-0 items-center justify-center rounded font-mono text-[10px] font-semibold tracking-[0.03em] outline-none focus-visible:ring-1 focus-visible:ring-[#d7ba2f] focus-visible:ring-offset-1 focus-visible:ring-offset-[#121213] enabled:cursor-pointer disabled:opacity-50 sm:h-8 sm:text-[11px]",
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
        <div className="absolute right-2 bottom-1.5 flex items-center gap-1.5">
          <span className="font-mono text-[12px] font-semibold tabular-nums tracking-tight text-white sm:text-sm">
            {status === "won"
              ? "You won!"
              : revealedAnswer
                ? `Word: ${revealedAnswer.toUpperCase()}`
                : "You lost!"}
          </span>
          {status === "lost" && (
            <button
              type="button"
              onClick={resetBoard}
              className="shrink-0 rounded border border-white/20 px-1.5 py-px font-mono text-[11px] font-semibold tracking-wide outline-none hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-[#d7ba2f] focus-visible:ring-offset-1 focus-visible:ring-offset-[#121213] sm:text-xs"
            >
              Try Again
            </button>
          )}
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
