"use client"

import { cn } from "@/lib/utils"

import PromptInput from "./prompt-input"
import { PLACEHOLDER_PROMPTS } from "../lib/config"
import { usePlaceholderLoop } from "../hooks/use-placeholder-loop"
import "../styles/simple-chatbot.css"

type SimpleChatbotProps = {
  className?: string
  prompts?: readonly string[]
}

export default function SimpleChatbot({
  className,
  prompts = PLACEHOLDER_PROMPTS,
}: SimpleChatbotProps) {
  const { displayText, showCursor, caretSolid } = usePlaceholderLoop(prompts)

  return (
    <div
      className={cn(
        "scb-root scb-page mx-auto flex w-full max-w-3xl min-w-0 justify-center px-3.5 py-[18px]",
        className
      )}
    >
      <div className="w-full max-w-[720px]">
        <PromptInput
          displayText={displayText}
          showCursor={showCursor}
          caretSolid={caretSolid}
        />
      </div>
    </div>
  )
}
