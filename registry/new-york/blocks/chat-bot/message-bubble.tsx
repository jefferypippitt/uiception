interface MessageBubbleProps {
  role: "user" | "bot"
  text: string
  isTyping?: boolean
}

export default function MessageBubble({
  role,
  text,
  isTyping,
}: MessageBubbleProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="cb-user-bubble max-w-[80%] rounded-full bg-(--cb-user-bubble-bg) px-4.5 py-2.5 text-sm leading-normal text-(--cb-user-bubble-text)">
          {text}
        </div>
      </div>
    )
  }

  return (
    <p className="m-0 text-[13px] leading-[1.65] tracking-[0.01em] whitespace-pre-line text-(--cb-bot-text)">
      {text}
      {isTyping ? (
        <span
          className="cb-bot-cursor ml-1.5 inline-block h-[1.05em] w-px shrink-0 translate-y-[0.1em] rounded-full bg-(--cb-bot-text) align-baseline"
          aria-hidden
        />
      ) : null}
    </p>
  )
}
