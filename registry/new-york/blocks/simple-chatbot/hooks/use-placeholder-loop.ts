import { useLayoutEffect, useReducer } from "react"

import {
  BETWEEN_MS,
  DELETE_CHAR_MS_FAST,
  DELETE_CHAR_MS_SLOW,
  HOLD_MS,
  PLACEHOLDER_PROMPTS,
  TYPE_CHAR_MS_FAST,
  TYPE_CHAR_MS_SLOW,
} from "../lib/config"

function typeDelayMs(charIdx: number, len: number): number {
  if (len <= 0) return TYPE_CHAR_MS_SLOW
  const t = charIdx / len
  // Gentle ease — smoother tempo than a steep power curve
  const ease = Math.pow(1 - t, 0.28)
  return Math.round(
    TYPE_CHAR_MS_FAST + (TYPE_CHAR_MS_SLOW - TYPE_CHAR_MS_FAST) * ease
  )
}

function deleteDelayMs(charIdx: number, len: number): number {
  if (len <= 0) return DELETE_CHAR_MS_SLOW
  const t = charIdx / len
  const ease = Math.pow(t, 0.38)
  return Math.round(
    DELETE_CHAR_MS_FAST + (DELETE_CHAR_MS_SLOW - DELETE_CHAR_MS_FAST) * ease
  )
}

type Phase = "typingIn" | "hold" | "typingOut" | "between"

type State = {
  phase: Phase
  promptIdx: number
  charIdx: number
}

type Action =
  | { type: "ADVANCE_CHAR" }
  | { type: "SET_PHASE"; phase: Phase; charIdx?: number; promptIdx?: number }
  | { type: "REWIND_CHAR" }

const INITIAL: State = { phase: "typingIn", promptIdx: 0, charIdx: 0 }

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

export function usePlaceholderLoop(prompts: readonly string[] = PLACEHOLDER_PROMPTS) {
  const [state, dispatch] = useReducer(reducer, INITIAL)
  const { phase, promptIdx, charIdx } = state

  const text = prompts[promptIdx] ?? ""
  const len = text.length

  const displayText = text.slice(0, charIdx)
  const showCursor =
    phase === "typingIn" || phase === "typingOut" || phase === "between" || phase === "hold"

  const caretSolid = phase === "typingIn" || phase === "typingOut"

  useLayoutEffect(() => {
    let t: ReturnType<typeof setTimeout>

    switch (phase) {
      case "typingIn":
        if (charIdx < len) {
          t = setTimeout(() => dispatch({ type: "ADVANCE_CHAR" }), typeDelayMs(charIdx, len))
        } else {
          dispatch({ type: "SET_PHASE", phase: "hold" })
        }
        break

      case "hold":
        t = setTimeout(() => dispatch({ type: "SET_PHASE", phase: "typingOut" }), HOLD_MS)
        break

      case "typingOut":
        if (charIdx > 0) {
          t = setTimeout(
            () => dispatch({ type: "REWIND_CHAR" }),
            deleteDelayMs(charIdx, len)
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
        }, BETWEEN_MS)
        break
    }

    return () => clearTimeout(t)
  }, [phase, charIdx, len, promptIdx, prompts.length])

  return { displayText, showCursor, caretSolid }
}
