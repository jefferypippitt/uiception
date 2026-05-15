"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSound } from "@/hooks/use-sound"
import { useOptionalSoundPreference } from "@/contexts/sound-preference"
import { clickSoftSound } from "@/lib/click-soft"
import { click8bitSound } from "@/lib/click-8bit"
import { error008Sound } from "@/lib/error-008"

type Phase = "showing" | "input" | "gameover"

/** Shared with live grid (`getBoxClasses`). */
const TILE_QUIET = "border-white/[0.08] bg-white/[0.04]"
const TILE_INPUT_IDLE = "border-white/[0.10] bg-white/[0.05]"
const TILE_LIT =
  "border-white bg-white shadow-[0_0_24px_rgba(255,255,255,0.9)]"

function randomGridIndex(): number {
  return Math.floor(Math.random() * 9)
}

function randomSequence(length: number): number[] {
  return Array.from({ length }, () => randomGridIndex())
}

export default function SequenceMemory() {
  const soundEnabled = useOptionalSoundPreference()
  const [playSeqSound] = useSound(clickSoftSound, { volume: 0.45, soundEnabled })
  const [playClickSound] = useSound(click8bitSound, { volume: 0.35, interrupt: true, soundEnabled })
  const [playErrorSound] = useSound(error008Sound, { volume: 0.4, interrupt: true, soundEnabled })

  const [phase, setPhase] = useState<Phase>("showing")
  const [sequence, setSequence] = useState<number[]>(() => [randomGridIndex()])
  const [playerInput, setPlayerInput] = useState<number[]>([])
  const [litBox, setLitBox] = useState<number | null>(null)
  const [flashBox, setFlashBox] = useState<number | null>(null)
  const [errorBox, setErrorBox] = useState<number | null>(null)
  /** Correct tile for the step they missed (shown muted while wrong tile stays red). */
  const [expectedHintBox, setExpectedHintBox] = useState<number | null>(null)

  const pendingRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const playerFlashTimeoutRef = useRef<number | null>(null)
  const sequenceRef = useRef<number[]>([])
  const playerInputRef = useRef<number[]>([])
  const playSeqSoundRef = useRef(playSeqSound)

  useLayoutEffect(() => {
    sequenceRef.current = sequence
    playerInputRef.current = playerInput
    playSeqSoundRef.current = playSeqSound
  }, [sequence, playerInput, playSeqSound])

  function clearPlayerFlashTimer() {
    const id = playerFlashTimeoutRef.current
    if (id !== null) {
      window.clearTimeout(id)
      playerFlashTimeoutRef.current = null
    }
  }

  function clearPending() {
    pendingRef.current.forEach(clearTimeout)
    pendingRef.current = []
  }

  function after(ms: number, fn: () => void) {
    const id = setTimeout(fn, ms)
    pendingRef.current.push(id)
  }

  function flashPlayerTap(idx: number) {
    clearPlayerFlashTimer()
    setFlashBox(idx)
    playerFlashTimeoutRef.current = window.setTimeout(() => {
      playerFlashTimeoutRef.current = null
      setFlashBox((current) => (current === idx ? null : current))
    }, 220)
  }

  function restart() {
    clearPlayerFlashTimer()
    clearPending()
    const firstSeq = [randomGridIndex()]
    setSequence(firstSeq)
    setPlayerInput([])
    setLitBox(null)
    setFlashBox(null)
    setErrorBox(null)
    setExpectedHintBox(null)
    setPhase("showing")
  }

  useEffect(() => {
    if (phase !== "showing") return

    const seq = sequence
    if (seq.length === 0) return

    const SHOW_MS = 520
    const GAP_MS = 200
    const STEP = SHOW_MS + GAP_MS
    const LEAD = 400

    const ids: ReturnType<typeof setTimeout>[] = []

    seq.forEach((boxIdx, i) => {
      ids.push(
        setTimeout(() => {
          setLitBox(boxIdx)
          playSeqSoundRef.current()
        }, LEAD + i * STEP)
      )
      ids.push(
        setTimeout(() => {
          setLitBox(null)
        }, LEAD + i * STEP + SHOW_MS)
      )
    })

    ids.push(
      setTimeout(() => {
        setPhase("input")
      }, LEAD + seq.length * STEP)
    )

    pendingRef.current.push(...ids)

    return () => ids.forEach(clearTimeout)
  }, [phase, sequence])

  function handleBoxClick(idx: number) {
    if (phase !== "input") return

    const pos = playerInputRef.current.length
    const expected = sequenceRef.current[pos]

    if (idx !== expected) {
      clearPlayerFlashTimer()
      setFlashBox(idx)
      playErrorSound()
      after(150, () => {
        setFlashBox(null)
        setErrorBox(idx)
        setExpectedHintBox(expected)
      })
      after(850, () => {
        setPhase("gameover")
        setErrorBox(null)
        setExpectedHintBox(null)
      })
      return
    }

    playClickSound()
    flashPlayerTap(idx)

    const nextInput = [...playerInputRef.current, idx]
    setPlayerInput(nextInput)
    playerInputRef.current = nextInput

    if (nextInput.length === sequenceRef.current.length) {
      clearPending()
      after(650, () => {
        const newLength = sequenceRef.current.length + 1
        const nextSeq = randomSequence(newLength)
        setSequence(nextSeq)
        sequenceRef.current = nextSeq
        setPlayerInput([])
        playerInputRef.current = []
        setPhase("showing")
      })
    }
  }

  useEffect(
    () => () => {
      clearPlayerFlashTimer()
      clearPending()
    },
    []
  )

  const level = sequence.length

  function getBoxClasses(idx: number): string {
    if (errorBox === idx) {
      return "bg-red-900/50 border-red-500/70 shadow-[0_0_16px_rgba(239,68,68,0.55)]"
    }
    if (expectedHintBox === idx) {
      return "border-dashed border-white/28 bg-white/[0.05] shadow-none ring-1 ring-inset ring-white/15"
    }
    if (litBox === idx || flashBox === idx) {
      return TILE_LIT
    }
    if (phase === "input") {
      return cn(
        TILE_INPUT_IDLE,
        "hover:border-white/[0.22] hover:bg-white/[0.11]"
      )
    }
    return TILE_QUIET
  }

  return (
    <div className="relative flex h-96 min-h-0 flex-col overflow-hidden bg-black font-sans text-[#d7dadc] antialiased">
      {/* Metric strip – same typography as reaction-time; one centered column */}
      <div
        className="flex w-full min-w-0 shrink-0 items-baseline justify-center px-2.5 pt-1.5 pb-1.5 text-[10px] leading-snug sm:px-3 sm:text-[11px]"
        aria-label="Current level"
      >
        <div className="min-w-0 text-center">
          <span className="block text-[9px] font-medium tracking-wide text-white/45 uppercase sm:text-[10px]">
            Level
          </span>
          <span className="text-[11px] font-semibold tabular-nums text-white sm:text-xs">
            {String(level)}
          </span>
        </div>
      </div>

      {/* Game area */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        {phase === "gameover" ? (
          <button
            type="button"
            onClick={restart}
            className="group inline-flex items-center gap-2 text-white/90 outline-none transition-colors duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
            aria-label="Play again"
          >
            <span className="seq-memory-play-shimmer relative text-base font-semibold tracking-[0.12em] uppercase">
              Play Again
            </span>
            <ArrowRight
              className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
              aria-hidden
            />
          </button>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <span className="block h-4 text-[10px] font-medium tracking-wide text-white/45 uppercase sm:text-[11px]">
              {phase === "showing" ? "Watch the sequence" : "Your turn"}
            </span>
            <div
              className={cn(
                "grid grid-cols-3 gap-2",
                phase === "showing" && "pointer-events-none"
              )}
              role="group"
              aria-label="Sequence memory grid"
            >
              {Array.from({ length: 9 }, (_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleBoxClick(idx)}
                  disabled={phase === "showing"}
                  className={cn(
                    "h-16 w-16 border transition-all duration-80",
                    getBoxClasses(idx)
                  )}
                  aria-label={`Button ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes seqMemoryPlayShimmer {
          0% { background-position: -160% 0; }
          100% { background-position: 160% 0; }
        }
        .seq-memory-play-shimmer {
          color: transparent;
          background-image: linear-gradient(90deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.98) 45%, rgba(255,255,255,0.55) 100%);
          background-size: 220% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          animation: seqMemoryPlayShimmer 2.3s linear infinite;
        }
      `}</style>
    </div>
  )
}
