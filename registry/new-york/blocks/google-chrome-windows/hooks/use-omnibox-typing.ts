import { useEffect, useLayoutEffect, useReducer, useRef, useSyncExternalStore } from "react"

import {
  BETWEEN_MS,
  DELETE_CHAR_MS_FAST,
  DELETE_CHAR_MS_SLOW,
  HOLD_MS,
  START_DELAY_MS,
  TYPE_CHAR_MS_FAST,
  TYPE_CHAR_MS_SLOW,
} from "../lib/typing-animation"

export type OmniboxTypingOptions = {
  /** Phrases to cycle through in the omnibox */
  prompts: readonly string[]
  typeCharMsFast?: number
  typeCharMsSlow?: number
  deleteCharMsFast?: number
  deleteCharMsSlow?: number
  holdMs?: number
  betweenMs?: number
  startDelayMs?: number
  /** When false, stops after the first phrase is typed (no delete/retype cycle). */
  loop?: boolean
  /** Fired when a phrase finishes typing (entering hold). */
  onTypedComplete?: () => void
  /** Fired when the omnibox is cleared (entering between). */
  onTypedCleared?: () => void
}

type Phase = "idle" | "typingIn" | "hold" | "typingOut" | "between"

type State = {
  phase: Phase
  promptIdx: number
  charIdx: number
}

type Action =
  | { type: "ADVANCE_CHAR" }
  | { type: "SET_PHASE"; phase: Phase; charIdx?: number; promptIdx?: number }
  | { type: "REWIND_CHAR" }

function jitter(ms: number, spread = 0.1): number {
  const delta = ms * spread * (Math.random() * 2 - 1)
  return Math.max(10, Math.round(ms + delta))
}

function typeDelayMs(charIdx: number, len: number, fast: number, slow: number): number {
  if (len <= 0) return slow
  const t = charIdx / len
  const ease = Math.pow(1 - t, 0.32)
  return jitter(Math.round(fast + (slow - fast) * ease))
}

function deleteDelayMs(charIdx: number, len: number, fast: number, slow: number): number {
  if (len <= 0) return slow
  const t = charIdx / len
  const ease = Math.pow(t, 0.4)
  return jitter(Math.round(fast + (slow - fast) * ease))
}

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
  mq.addEventListener("change", onStoreChange)
  return () => mq.removeEventListener("change", onStoreChange)
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function getReducedMotionServer() {
  return false
}

export function useOmniboxTyping({
  prompts,
  typeCharMsFast = TYPE_CHAR_MS_FAST,
  typeCharMsSlow = TYPE_CHAR_MS_SLOW,
  deleteCharMsFast = DELETE_CHAR_MS_FAST,
  deleteCharMsSlow = DELETE_CHAR_MS_SLOW,
  holdMs = HOLD_MS,
  betweenMs = BETWEEN_MS,
  startDelayMs = START_DELAY_MS,
  loop = true,
  onTypedComplete,
  onTypedCleared,
}: OmniboxTypingOptions) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer,
  )

  const [state, dispatch] = useReducer(reducer, {
    phase: "idle",
    promptIdx: 0,
    charIdx: 0,
  })

  const { phase, promptIdx, charIdx } = state
  const text = prompts[promptIdx] ?? ""
  const len = text.length

  const displayText = reducedMotion ? (prompts[0] ?? "") : text.slice(0, charIdx)
  const showCursor = !reducedMotion && !(loop === false && phase === "hold")
  const caretSolid = phase === "typingIn" || phase === "typingOut"
  const isActive =
    !reducedMotion &&
    (phase === "typingIn" || phase === "hold" || phase === "typingOut" || charIdx > 0)

  const prevPhaseRef = useRef<Phase>(phase)

  useEffect(() => {
    const prev = prevPhaseRef.current
    prevPhaseRef.current = phase

    if (reducedMotion) return
    if (phase === "hold" && prev !== "hold") onTypedComplete?.()
    if (phase === "between" && prev !== "between") onTypedCleared?.()
  }, [phase, reducedMotion, onTypedComplete, onTypedCleared])

  useLayoutEffect(() => {
    if (reducedMotion || prompts.length === 0) return

    let t: ReturnType<typeof setTimeout>

    switch (phase) {
      case "idle":
        t = setTimeout(() => dispatch({ type: "SET_PHASE", phase: "typingIn" }), startDelayMs)
        break

      case "typingIn":
        if (charIdx < len) {
          t = setTimeout(
            () => dispatch({ type: "ADVANCE_CHAR" }),
            typeDelayMs(charIdx, len, typeCharMsFast, typeCharMsSlow),
          )
        } else {
          dispatch({ type: "SET_PHASE", phase: "hold" })
        }
        break

      case "hold":
        if (loop) {
          t = setTimeout(() => dispatch({ type: "SET_PHASE", phase: "typingOut" }), holdMs)
        }
        break

      case "typingOut":
        if (charIdx > 0) {
          t = setTimeout(
            () => dispatch({ type: "REWIND_CHAR" }),
            deleteDelayMs(charIdx, len, deleteCharMsFast, deleteCharMsSlow),
          )
        } else {
          dispatch({ type: "SET_PHASE", phase: "between", charIdx: 0 })
        }
        break

      case "between":
        t = setTimeout(() => {
          const next = (promptIdx + 1) % prompts.length
          dispatch({
            type: "SET_PHASE",
            phase: "typingIn",
            charIdx: 0,
            promptIdx: next,
          })
        }, betweenMs)
        break
    }

    return () => clearTimeout(t)
  }, [
    reducedMotion,
    phase,
    charIdx,
    len,
    promptIdx,
    prompts.length,
    typeCharMsFast,
    typeCharMsSlow,
    deleteCharMsFast,
    deleteCharMsSlow,
    holdMs,
    betweenMs,
    startDelayMs,
    loop,
  ])

  return { displayText, showCursor, caretSolid, isActive }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADVANCE_CHAR":
      return { ...state, charIdx: state.charIdx + 1 }
    case "REWIND_CHAR":
      return { ...state, charIdx: Math.max(0, state.charIdx - 1) }
    case "SET_PHASE":
      return {
        phase: action.phase,
        charIdx: action.charIdx ?? state.charIdx,
        promptIdx: action.promptIdx ?? state.promptIdx,
      }
    default:
      return state
  }
}
