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
    <div className="scb-card">
      <div className="scb-body">
        <div className="scb-input" aria-hidden={!displayText && !showCursor}>
          {displayText ? <span className="scb-text">{displayText}</span> : null}
          {showCursor ? (
            <span
              className={cn("scb-caret", caretSolid && "scb-caret--solid")}
              aria-hidden
            >
              |
            </span>
          ) : null}
        </div>
      </div>

      <div className="scb-toolbar">
        <div className="scb-toolbar-left">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="scb-btn-icon h-[30px] w-[30px] min-w-[30px] rounded-lg"
            aria-label="Add context"
          >
            <Plus size={17} {...iconProps} />
          </Button>
        </div>

        <div className="scb-toolbar-right">
          <Button
            type="button"
            variant="ghost"
            className="scb-btn-mic h-[34px] w-[34px] min-w-[34px] shrink-0 rounded-[10px] p-0"
            aria-label="Voice input"
          >
            <Mic size={17} className="scb-mic-icon" />
          </Button>
        </div>
      </div>
    </div>
  )
}
