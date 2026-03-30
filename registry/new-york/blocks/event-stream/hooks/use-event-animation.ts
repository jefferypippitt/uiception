import { useReducer, useLayoutEffect, useMemo, useRef } from "react"

import { EVENTS, TYPE_CHAR_MS, TYPE_NEWLINE_MS, VISIBLE_EVENT_BUFFER } from "../lib/config"

type AnimationState = {
  buffer: string[]
  eventIdx: number
  charIdx: number
}

type AnimationAction = { type: "advanceChar" } | { type: "completeEvent" }

function animationReducer(state: AnimationState, action: AnimationAction): AnimationState {
  switch (action.type) {
    case "advanceChar":
      return { ...state, charIdx: state.charIdx + 1 }
    case "completeEvent": {
      const content = EVENTS[state.eventIdx]
      return {
        buffer: [...state.buffer, content].slice(-VISIBLE_EVENT_BUFFER),
        charIdx: 0,
        eventIdx: (state.eventIdx + 1) % EVENTS.length,
      }
    }
    default:
      return state
  }
}

function buildDisplayText(buffer: string[], eventIdx: number, charIdx: number): string {
  const wip = EVENTS[eventIdx].slice(0, charIdx)
  if (buffer.length === 0) return wip
  return buffer.join("\n\n") + "\n\n" + wip
}

export function useEventAnimation() {
  const [{ buffer, eventIdx, charIdx }, dispatch] = useReducer(animationReducer, {
    buffer: [],
    eventIdx: 0,
    charIdx: 0,
  })
  const scrollRef = useRef<HTMLDivElement>(null)

  const text = useMemo(
    () => buildDisplayText(buffer, eventIdx, charIdx),
    [buffer, eventIdx, charIdx],
  )

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = Math.max(0, el.scrollHeight - el.clientHeight)
  }, [text])

  useLayoutEffect(() => {
    const content = EVENTS[eventIdx]

    if (charIdx >= content.length) {
      dispatch({ type: "completeEvent" })
      return
    }

    const ch = content[charIdx]
    const delay = ch === "\n" ? TYPE_NEWLINE_MS : TYPE_CHAR_MS
    const t = setTimeout(() => dispatch({ type: "advanceChar" }), delay)
    return () => clearTimeout(t)
  }, [charIdx, eventIdx])

  return { text, scrollRef }
}
