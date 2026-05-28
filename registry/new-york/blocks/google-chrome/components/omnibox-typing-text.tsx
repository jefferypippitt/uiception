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
  textClassName = "min-w-0 truncate text-[inherit] leading-[inherit] text-[var(--gc-omnibox-fg)] select-none",
  caretClassName = "gc-omnibox-caret",
}: OmniboxTypingTextProps) {
  return (
    <span
      className="inline-flex min-h-[calc(0.8125rem*1.2)] min-w-0 flex-1 items-center overflow-hidden text-3.25 leading-[1.2]"
      aria-hidden
    >
      <span className={cn(textClassName, !displayText && "opacity-0")}>
        {displayText || "\u200b"}
      </span>
      {showCursor ? (
        <span
          className={cn(
            caretClassName,
            "ml-px inline-block h-[calc(0.8125rem*1.2)] w-px shrink-0 bg-(--gc-omnibox-caret)",
            caretSolid && `${caretClassName}--solid`
          )}
          aria-hidden
        />
      ) : null}
    </span>
  )
}
