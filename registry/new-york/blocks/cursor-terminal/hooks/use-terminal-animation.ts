// Phase flow: idle → typing → output → done → idle (loops)
import { useEffect, useMemo, useRef, useState } from "react"

import {
  COMMAND, INIT_LINES, OUTPUT_SEQUENCE, PROMPT, TYPE_SPEED,
  type Line, type Phase, type PromptState,
} from "../lib/config"

export function useTerminalAnimation() {
  const [lines, setLines] = useState<Line[]>(INIT_LINES)
  const [typed, setTyped] = useState("")
  const [phase, setPhase] = useState<Phase>("idle")
  const [outIdx, setOutIdx] = useState(0)
  const [firstStepBlue, setFirstStepBlue] = useState(false)
  const idRef = useRef(10)
  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines, typed])

  useEffect(() => {
    if (phase !== "idle") return
    const t = setTimeout(() => setPhase("typing"), 1600)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== "typing") return
    if (typed.length < COMMAND.length) {
      const t = setTimeout(() => setTyped(COMMAND.slice(0, typed.length + 1)), TYPE_SPEED)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setLines((prev) => [...prev, { id: idRef.current++, text: COMMAND, promptLine: true, dot: "grey" }])
      setTyped("")
      setOutIdx(0)
      setPhase("output")
    }, 360)
    return () => clearTimeout(t)
  }, [phase, typed])

  useEffect(() => {
    if (phase !== "output") return
    if (outIdx >= OUTPUT_SEQUENCE.length) {
      const t = setTimeout(() => setPhase("done"), 500)
      return () => clearTimeout(t)
    }
    const item = OUTPUT_SEQUENCE[outIdx]
    if (item.type === "spinner") {
      const t = setTimeout(() => {
        const spinId = idRef.current++
        setLines((prev) => [...prev, { id: spinId, text: item.text, spinning: true }])
        spinTimerRef.current = setTimeout(() => {
          setLines((prev) =>
            prev.map((l) =>
              l.id === spinId
                ? { ...l, spinning: false, text: `✓ ${item.doneText ?? item.text}`, color: "green" as const }
                : l,
            ),
          )
          setOutIdx((i) => i + 1)
        }, item.duration)
      }, item.delay)
      return () => {
        clearTimeout(t)
        if (spinTimerRef.current) clearTimeout(spinTimerRef.current)
      }
    }
    const t = setTimeout(() => {
      setLines((prev) => [...prev, { id: idRef.current++, text: item.text, color: item.color }])
      setOutIdx((i) => i + 1)
    }, item.delay)
    return () => clearTimeout(t)
  }, [phase, outIdx])

  useEffect(() => {
    if (phase !== "done") return
    setLines((prev) => prev.map((line) => (line.promptLine ? { ...line, dot: "grey" } : line)))
    setFirstStepBlue(false)
    const blueTimer = setTimeout(() => {
      setFirstStepBlue(true)
      setLines((prev) => prev.map((line) => (line.promptLine ? { ...line, dot: "blue" } : line)))
    }, 700)
    const resetTimer = setTimeout(() => {
      idRef.current = 10
      setTyped("")
      setOutIdx(0)
      setFirstStepBlue(false)
      setLines(INIT_LINES)
      setPhase("idle")
    }, 5500)
    return () => {
      clearTimeout(blueTimer)
      clearTimeout(resetTimer)
    }
  }, [phase])

  const prompt = useMemo<PromptState>(() => {
    switch (phase) {
      case "idle":
        return { dot: "grey", showPrompt: true, showPath: true, typed: "", cursor: true, animateIn: false }
      case "typing":
        return { dot: "grey", showPrompt: true, showPath: true, typed, cursor: true, animateIn: false }
      case "output":
        return { dot: "grey", showPrompt: false, showPath: false, typed: "", cursor: false, animateIn: false }
      case "done":
        return {
          dot: "grey",
          showPrompt: true,
          showPath: true,
          typed: "",
          cursor: false,
          animateIn: true,
        }
    }
  }, [firstStepBlue, phase, typed])

  return { lines, prompt, scrollRef }
}
