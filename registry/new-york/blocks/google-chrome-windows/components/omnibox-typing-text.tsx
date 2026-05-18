import { cn } from "@/lib/utils"

type OmniboxTypingTextProps = {
  displayText: string
  showCursor: boolean
  caretSolid: boolean
  textClassName?: string
  caretClassName?: string
}

export default function OmniboxTypingText({
  displayText,
  showCursor,
  caretSolid,
  textClassName = "gcw-omnibox-text",
  caretClassName = "gcw-omnibox-caret",
}: OmniboxTypingTextProps) {
  return (
    <span className="gcw-omnibox-typing" aria-hidden>
      {displayText ? <span className={textClassName}>{displayText}</span> : null}
      {showCursor ? (
        <span
          className={cn(caretClassName, caretSolid && `${caretClassName}--solid`)}
          aria-hidden
        />
      ) : null}
    </span>
  )
}
