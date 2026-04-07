import { Lightbulb } from "lucide-react"
import type { Phase } from "../hooks/use-chat-animation"

interface ThinkLabelProps {
  phase: Phase
  thinkSeconds: number
}

export default function ThinkLabel({ phase, thinkSeconds }: ThinkLabelProps) {
  if (phase === "botThinking") {
    return (
      <div className="cb-think-row">
        <Lightbulb size={13} className="cb-think-icon cb-think-pulse" aria-hidden />
        <span className="cb-think-text">Thinking…</span>
      </div>
    )
  }

  if (phase === "botTyping" || phase === "paused") {
    return (
      <div className="cb-think-row">
        <Lightbulb size={13} className="cb-think-icon" aria-hidden />
        <span className="cb-think-text">Thought for {thinkSeconds}s</span>
      </div>
    )
  }

  return null
}
