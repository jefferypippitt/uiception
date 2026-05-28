import { Mic, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PromptInputProps {
  displayText: string
  showCursor: boolean
  caretSolid: boolean
}

const iconProps = { strokeWidth: 1.5 } as const

export default function PromptInput({
  displayText,
  showCursor,
  caretSolid,
}: PromptInputProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-muted shadow-[0_0_0_1px_rgba(0,0,0,0.06)] dark:bg-background dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="min-h-[76px] px-3.5 pt-3.5 pb-2">
        <div
          className="scb-input flex min-h-10 flex-wrap items-start text-sm leading-normal"
          aria-hidden={!displayText && !showCursor}
        >
          {displayText ? (
            <span className="scb-text text-foreground blur-[0.22px] select-none">
              {displayText}
            </span>
          ) : null}
          {showCursor ? (
            <span
              className={cn(
                "scb-caret ml-0.5 inline-block shrink-0 translate-y-[0.06em] align-text-top text-[1.22em] leading-none font-medium text-foreground",
                caretSolid && "scb-caret--solid"
              )}
              aria-hidden
            >
              |
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-2.5 pb-2.5 pl-3">
        <div className="flex min-w-0 flex-wrap items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-[30px] w-[30px] min-w-[30px] rounded-lg text-muted-foreground hover:bg-foreground/6 hover:text-foreground"
            aria-label="Add context"
          >
            <Plus size={17} {...iconProps} />
          </Button>
        </div>

        <div className="flex min-w-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            className="h-[34px] w-[34px] min-w-[34px] shrink-0 rounded-[10px] bg-foreground p-0 text-background hover:bg-foreground hover:opacity-95"
            aria-label="Voice input"
          >
            <Mic size={17} className="text-background" />
          </Button>
        </div>
      </div>
    </div>
  )
}
