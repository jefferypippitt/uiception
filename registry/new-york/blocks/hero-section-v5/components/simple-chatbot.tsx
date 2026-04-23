"use client"

import { cn } from "@/lib/utils"

import PromptInput from "./prompt-input"
import { usePlaceholderLoop } from "../hooks/use-placeholder-loop"
import "../styles/simple-chatbot.css"

export default function SimpleChatbot({ className }: { className?: string }) {
  const { displayText, showCursor, caretSolid } = usePlaceholderLoop()

  return (
    <div className={cn("scb-root scb-page mx-auto w-full min-w-0 max-w-3xl", className)}>
      <div className="scb-page-inner">
        <PromptInput
          displayText={displayText}
          showCursor={showCursor}
          caretSolid={caretSolid}
        />
      </div>
    </div>
  )
}
