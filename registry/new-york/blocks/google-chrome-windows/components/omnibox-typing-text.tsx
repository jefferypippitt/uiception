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
  textClassName = "min-w-0 truncate text-3.25 leading-[1.2] text-[var(--gcw-omnibox-typed)] select-none",
  caretClassName = "gcw-omnibox-caret",
}: OmniboxTypingTextProps) {
  return (
    <span
      className="inline-flex min-w-0 flex-1 items-center overflow-hidden"
      aria-hidden
    >
      {displayText ? (
        <span className={textClassName}>{displayText}</span>
      ) : null}
      {showCursor ? (
        <span
          className={cn(
            caretClassName,
            "ml-px inline-block h-[1.05em] w-px shrink-0 translate-y-px bg-(--gcw-omnibox-caret) align-text-bottom",
            caretSolid && `${caretClassName}--solid`
          )}
          aria-hidden
        />
      ) : null}
    </span>
  )
}
