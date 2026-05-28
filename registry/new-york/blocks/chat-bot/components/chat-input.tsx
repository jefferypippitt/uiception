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
  const isLoading =
    isSending ||
    phase === "botThinking" ||
    phase === "botTyping" ||
    (phase === "paused" && !settled)
  const showCursor = phase === "userTyping"

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-full border border-(--cb-input-border) bg-(--cb-input-bg) py-2.5 pr-2.5 pl-4 transition-[border-color,opacity] duration-150",
        isSending && "opacity-50"
      )}
    >
      <Paperclip
        size={16}
        className="shrink-0 text-(--cb-input-icon)"
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 items-center">
        {value ? (
          <span className="truncate text-sm leading-normal text-(--cb-input-text)">
            {value}
          </span>
        ) : (
          <span className="text-sm leading-normal text-(--cb-input-placeholder) select-none">
            Message…
          </span>
        )}
        {showCursor && (
          <span
            className="cb-input-cursor ml-px inline-block h-3.5 w-0.5 translate-y-px rounded-0.5 bg-(--cb-input-cursor) align-text-bottom"
            aria-hidden
          />
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          className={cn(
            "flex size-8 shrink-0 cursor-default items-center justify-center rounded-full border-none bg-(--cb-send-bg) text-(--cb-send-text) transition-[opacity,transform] duration-150",
            !isSending && "opacity-[0.28]",
            isSending && "cb-send-btn-active opacity-100"
          )}
          aria-label="Send message"
          tabIndex={-1}
        >
          {isLoading ? (
            <span
              className="cb-spinner block size-3.5 rounded-full border-2 border-current/25 border-t-current"
              aria-hidden
            />
          ) : (
            <ArrowUp size={15} strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  )
}
