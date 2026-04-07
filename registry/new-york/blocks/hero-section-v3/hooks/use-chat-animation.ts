import { useReducer, useLayoutEffect, useMemo, useRef } from "react"

import {
  EXCHANGE,
  TYPE_CHAR_MS,
  PRE_SEND_DELAY_MS,
  SEND_FLASH_MS,
  BOT_THINK_MS,
  BOT_TYPE_CHAR_MS,
  LOOP_PAUSE_MS,
} from "../lib/config"

export type Phase =
  | "userTyping"
  | "userSending"
  | "botThinking"
  | "botTyping"
  | "paused"

type State = {
  phase: Phase
  charIdx: number
  userSent: boolean
  thinkSeconds: number
  settled: boolean
}

type Action =
  | { type: "ADVANCE_CHAR" }
  | { type: "SET_PHASE"; phase: Phase; charIdx?: number; userSent?: boolean }
  | { type: "TICK_THINK" }
  | { type: "SET_SETTLED" }
  | { type: "RESET" }

const INITIAL: State = { phase: "userTyping", charIdx: 0, userSent: false, thinkSeconds: 0, settled: false }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADVANCE_CHAR":
      return { ...state, charIdx: state.charIdx + 1 }
    case "SET_PHASE":
      return {
        phase: action.phase,
        charIdx: action.charIdx ?? state.charIdx,
        userSent: action.userSent ?? state.userSent,
        thinkSeconds: action.phase === "botThinking" ? 0 : state.thinkSeconds,
        settled: false,
      }
    case "TICK_THINK":
      return { ...state, thinkSeconds: state.thinkSeconds + 1 }
    case "SET_SETTLED":
      return { ...state, settled: true }
    case "RESET":
      return INITIAL
    default:
      return state
  }
}

export function useChatAnimation() {
  const [state, dispatch] = useReducer(reducer, INITIAL)
  const { phase, charIdx, userSent, thinkSeconds, settled } = state
  const scrollRef = useRef<HTMLDivElement>(null)

  const { question, answer } = EXCHANGE

  // ── Derived display values ─────────────────────────────────────────────────

  const inputText = useMemo(() => {
    if (phase === "userTyping") return question.slice(0, charIdx)
    if (phase === "userSending") return question
    return ""
  }, [phase, charIdx, question])

  const userMessage: string | null = userSent ? question : null

  const botText = useMemo((): string | null => {
    if (phase === "botTyping") return answer.slice(0, charIdx)
    if (phase === "paused") return answer
    return null
  }, [phase, charIdx, answer])

  // ── Animation driver ───────────────────────────────────────────────────────

  useLayoutEffect(() => {
    let t: ReturnType<typeof setTimeout>

    switch (phase) {
      case "userTyping":
        if (charIdx < question.length) {
          t = setTimeout(() => dispatch({ type: "ADVANCE_CHAR" }), TYPE_CHAR_MS)
        } else {
          t = setTimeout(
            () => dispatch({ type: "SET_PHASE", phase: "userSending" }),
            PRE_SEND_DELAY_MS,
          )
        }
        break

      case "userSending":
        t = setTimeout(
          () =>
            dispatch({
              type: "SET_PHASE",
              phase: "botThinking",
              charIdx: 0,
              userSent: true,
            }),
          SEND_FLASH_MS,
        )
        break

      case "botThinking":
        t = setTimeout(
          () => dispatch({ type: "SET_PHASE", phase: "botTyping", charIdx: 0 }),
          BOT_THINK_MS,
        )
        break

      case "botTyping":
        if (charIdx < answer.length) {
          t = setTimeout(() => dispatch({ type: "ADVANCE_CHAR" }), BOT_TYPE_CHAR_MS)
        } else {
          t = setTimeout(
            () => dispatch({ type: "SET_PHASE", phase: "paused" }),
            400,
          )
        }
        break

      case "paused":
        t = setTimeout(() => dispatch({ type: "RESET" }), LOOP_PAUSE_MS)
        break
    }

    return () => clearTimeout(t)
  }, [phase, charIdx, question, answer])

  // ── Think-seconds ticker ───────────────────────────────────────────────────

  useLayoutEffect(() => {
    if (phase !== "botThinking") return
    const id = setInterval(() => dispatch({ type: "TICK_THINK" }), 1000)
    return () => clearInterval(id)
  }, [phase])

  // ── Settle after chips animate in (~500ms into paused) ─────────────────────

  useLayoutEffect(() => {
    if (phase !== "paused") return
    const t = setTimeout(() => dispatch({ type: "SET_SETTLED" }), 1150)
    return () => clearTimeout(t)
  }, [phase])

  // ── Auto-scroll ────────────────────────────────────────────────────────────

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight - el.clientHeight
  }, [userMessage, botText, phase])

  return { phase, inputText, userMessage, botText, scrollRef, thinkSeconds, settled }
}
