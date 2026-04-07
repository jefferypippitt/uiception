interface MessageBubbleProps {
  role: "user" | "bot"
  text: string
  isTyping?: boolean
}

export default function MessageBubble({ role, text, isTyping }: MessageBubbleProps) {
  if (role === "user") {
    return (
      <div className="cb-user-row">
        <div className="cb-user-bubble">{text}</div>
      </div>
    )
  }

  return (
    <p className="cb-bot-text">
      {text}
      {isTyping && <span className="cb-bot-cursor" aria-hidden />}
    </p>
  )
}
