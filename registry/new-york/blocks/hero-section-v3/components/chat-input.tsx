import { cn } from "@/lib/utils"
import { Paperclip, ArrowUp } from "lucide-react"
import type { Phase } from "../hooks/use-chat-animation"

interface ChatInputProps {
  value: string
  phase: Phase
  settled: boolean
}

export default function ChatInput({ value, phase, settled }: ChatInputProps) {
  const isSending = phase === "userSending"
  const isLoading = isSending || phase === "botThinking" || phase === "botTyping" || (phase === "paused" && !settled)
  const showCursor = phase === "userTyping"

  return (
    <div className={cn("cb-input-pill", isSending && "cb-input-sending")}>
      <Paperclip size={16} className="cb-input-icon" aria-hidden />
      <div className="cb-input-field">
        {value ? (
          <span className="cb-input-text">{value}</span>
        ) : (
          <span className="cb-input-placeholder">Message…</span>
        )}
        {showCursor && <span className="cb-input-cursor" aria-hidden />}
      </div>
      <div className="cb-input-right">
        <button
          className={cn("cb-send-btn", isSending && "cb-send-btn-active")}
          aria-label="Send message"
          tabIndex={-1}
        >
          {isLoading ? <span className="cb-spinner" aria-hidden /> : <ArrowUp size={15} strokeWidth={2.5} />}
        </button>
      </div>
    </div>
  )
}
