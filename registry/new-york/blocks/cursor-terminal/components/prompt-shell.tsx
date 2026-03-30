import type { ReactNode } from "react"
import { PROMPT } from "../lib/config"

export default function PromptShell({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block size-[7px] shrink-0 rounded-full bg-[#3b8eea] ring-1 ring-white/15"
        aria-hidden
      />
      <span className="tabular-nums">{PROMPT}</span>
      {children}
    </div>
  )
}
