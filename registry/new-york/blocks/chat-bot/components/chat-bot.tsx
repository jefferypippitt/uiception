"use client"

import { cn } from "@/lib/utils"
import {
  RotateCcw,
  Copy,
  Share2,
  ThumbsUp,
  ThumbsDown,
  CornerDownRight,
} from "lucide-react"
import { useChatAnimation } from "../hooks/use-chat-animation"
import MessageBubble from "./message-bubble"
import ThinkLabel from "./typing-indicator"
import ChatInput from "./chat-input"
import { SUGGESTIONS } from "../lib/config"
import "../styles/chat-bot.css"

export default function ChatBot({ className }: { className?: string }) {
  const { phase, inputText, userMessage, botText, thinkSeconds, settled } =
    useChatAnimation()
  const showMessages = userMessage !== null
  const isPaused = phase === "paused"

  return (
    <div
      className={cn(
        "cb-root mx-auto flex w-full max-w-3xl min-w-0 justify-center px-6 py-12",
        className
      )}
    >
      <div className="flex w-full max-w-[600px] flex-col gap-7">
        <div
          className={cn(
            "pointer-events-none flex translate-y-5 flex-col gap-6 opacity-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
            showMessages && "pointer-events-auto translate-y-0 opacity-100"
          )}
        >
          {userMessage && <MessageBubble role="user" text={userMessage} />}

          <div className="flex flex-col gap-2.5">
            <ThinkLabel phase={phase} thinkSeconds={thinkSeconds} />

            {botText !== null && (
              <MessageBubble
                role="bot"
                text={botText}
                isTyping={phase === "botTyping"}
              />
            )}

            <div className={cn("cb-reveal", isPaused && "cb-reveal--open")}>
              <div className="cb-reveal-inner">
                {isPaused && (
                  <>
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        className="cb-action-btn flex size-9 cursor-default items-center justify-center rounded-2.5 border-none bg-transparent text-(--cb-action-color) transition-[color,background] duration-150 hover:bg-(--cb-action-hover-bg) hover:text-(--cb-action-hover-color)"
                        aria-label="Retry"
                      >
                        <RotateCcw size={14} />
                      </button>
                      <button
                        type="button"
                        className="cb-action-btn flex size-9 cursor-default items-center justify-center rounded-2.5 border-none bg-transparent text-(--cb-action-color) transition-[color,background] duration-150 hover:bg-(--cb-action-hover-bg) hover:text-(--cb-action-hover-color)"
                        aria-label="Copy"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        type="button"
                        className="cb-action-btn flex size-9 cursor-default items-center justify-center rounded-2.5 border-none bg-transparent text-(--cb-action-color) transition-[color,background] duration-150 hover:bg-(--cb-action-hover-bg) hover:text-(--cb-action-hover-color)"
                        aria-label="Share"
                      >
                        <Share2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="cb-action-btn flex size-9 cursor-default items-center justify-center rounded-2.5 border-none bg-transparent text-(--cb-action-color) transition-[color,background] duration-150 hover:bg-(--cb-action-hover-bg) hover:text-(--cb-action-hover-color)"
                        aria-label="Thumbs up"
                      >
                        <ThumbsUp size={14} />
                      </button>
                      <button
                        type="button"
                        className="cb-action-btn flex size-9 cursor-default items-center justify-center rounded-2.5 border-none bg-transparent text-(--cb-action-color) transition-[color,background] duration-150 hover:bg-(--cb-action-hover-bg) hover:text-(--cb-action-hover-color)"
                        aria-label="Thumbs down"
                      >
                        <ThumbsDown size={14} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="cb-chip flex w-fit cursor-default items-center gap-2 rounded-3 border border-(--cb-chip-border) bg-transparent px-2.5 py-2 pr-3.5 text-left text-[11px] text-(--cb-chip-text) transition-[border-color] duration-150 hover:border-(--cb-chip-border)"
                        >
                          <CornerDownRight
                            size={12}
                            className="shrink-0 text-(--cb-chip-icon)"
                            aria-hidden
                          />
                          {s}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <ChatInput value={inputText} phase={phase} settled={settled} />
      </div>
    </div>
  )
}
