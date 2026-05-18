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
  textClassName = "gc-omnibox-text",
  caretClassName = "gc-omnibox-caret",
}: OmniboxTypingTextProps) {
  return (
    <span className="gc-omnibox-typing" aria-hidden>
      <span className={cn(textClassName, !displayText && "gc-omnibox-text--measure")}>
        {displayText || "\u200b"}
      </span>
      {showCursor ? (
        <span
          className={cn(caretClassName, caretSolid && `${caretClassName}--solid`)}
          aria-hidden
        />
      ) : null}
    </span>
  )
}
