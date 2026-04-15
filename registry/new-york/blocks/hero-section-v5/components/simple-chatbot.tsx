"use client"

import PromptInput from "./prompt-input"
import { usePlaceholderLoop } from "../hooks/use-placeholder-loop"
import "../styles/simple-chatbot.css"

export default function SimpleChatbot() {
  const { displayText, showCursor, caretSolid } = usePlaceholderLoop()

  return (
    <div className="scb-root scb-page">
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
