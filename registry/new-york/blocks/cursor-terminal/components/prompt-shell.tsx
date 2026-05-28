import { PROMPT } from "../lib/config"
import type { PromptState } from "../lib/config"
import { cn } from "@/lib/utils"

type Props = Pick<PromptState, "dot" | "showPath">

export default function PromptShell({ dot, showPath }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "inline-block size-[7px] shrink-0 rounded-full ring-1 ring-white/15",
          dot === "blue" ? "bg-[#3b8eea]" : "bg-[#767676]"
        )}
        aria-hidden
      />
      {showPath && <span className="tabular-nums">{PROMPT}</span>}
    </div>
  )
}
