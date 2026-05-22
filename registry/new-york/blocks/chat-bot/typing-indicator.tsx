import { Lightbulb } from "lucide-react"
import type { Phase } from "./use-chat-animation"

interface ThinkLabelProps {
  phase: Phase
  thinkSeconds: number
}

export default function ThinkLabel({ phase, thinkSeconds }: ThinkLabelProps) {
  if (phase === "botThinking") {
    return (
      <div className="flex items-center gap-1.5">
        <Lightbulb
          size={13}
          className="cb-think-pulse shrink-0 text-(--cb-think-color)"
          aria-hidden
        />
        <span className="text-[11px] text-(--cb-think-color)">
          Thinking…
        </span>
      </div>
    )
  }

  if (phase === "botTyping" || phase === "paused") {
    return (
      <div className="flex items-center gap-1.5">
        <Lightbulb
          size={13}
          className="shrink-0 text-(--cb-think-color)"
          aria-hidden
        />
        <span className="text-[11px] text-(--cb-think-color)">
          Thought for {thinkSeconds}s
        </span>
      </div>
    )
  }

  return null
}
