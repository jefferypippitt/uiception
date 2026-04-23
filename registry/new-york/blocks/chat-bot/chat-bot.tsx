"use client"

import { cn } from "@/lib/utils"
import { RotateCcw, Copy, Share2, ThumbsUp, ThumbsDown, CornerDownRight } from "lucide-react"
import { useChatAnimation } from "./hooks/use-chat-animation"
import MessageBubble from "./components/message-bubble"
import ThinkLabel from "./components/typing-indicator"
import ChatInput from "./components/chat-input"
import { SUGGESTIONS } from "./lib/config"
import "./styles/chat-bot.css"

export default function ChatBot({ className }: { className?: string }) {
  const { phase, inputText, userMessage, botText, thinkSeconds, settled } = useChatAnimation()
  const showMessages = userMessage !== null
  const isPaused = phase === "paused"

  return (
    <div className={cn("cb-root mx-auto w-full min-w-0 max-w-3xl", className)}>
      <div className="cb-layout">

        {/* Messages panel */}
        <div className={cn("cb-messages-panel", showMessages && "cb-messages-panel--visible")}>

          {userMessage && (
            <MessageBubble role="user" text={userMessage} />
          )}

          <div className="cb-bot-area">
            <ThinkLabel phase={phase} thinkSeconds={thinkSeconds} />

            {botText !== null && (
              <MessageBubble
                role="bot"
                text={botText}
                isTyping={phase === "botTyping"}
              />
            )}

            {/* Reveal container — always in DOM so height animates, children mount at paused so animations retrigger */}
            <div className={cn("cb-reveal", isPaused && "cb-reveal--open")}>
              <div className="cb-reveal-inner">
                {isPaused && (
                  <>
                    <div className="cb-actions">
                      <button className="cb-action-btn" aria-label="Retry"><RotateCcw size={14} /></button>
                      <button className="cb-action-btn" aria-label="Copy"><Copy size={14} /></button>
                      <button className="cb-action-btn" aria-label="Share"><Share2 size={14} /></button>
                      <button className="cb-action-btn" aria-label="Thumbs up"><ThumbsUp size={14} /></button>
                      <button className="cb-action-btn" aria-label="Thumbs down"><ThumbsDown size={14} /></button>
                    </div>
                    <div className="cb-suggestions">
                      {SUGGESTIONS.map((s) => (
                        <button key={s} className="cb-chip">
                          <CornerDownRight size={12} className="cb-chip-icon" aria-hidden />
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

        {/* Input bar */}
        <ChatInput value={inputText} phase={phase} settled={settled} />

      </div>
    </div>
  )
}
