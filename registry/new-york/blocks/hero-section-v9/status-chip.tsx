import { cn } from "@/lib/utils"

import type { PreviewStatusState } from "./config"

export default function StatusChip({
  label,
  state,
}: {
  label: string
  state: PreviewStatusState
}) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          "relative size-1.5 shrink-0 rounded-full",
          state === "waiting" ? "bg-(--pp-dot-idle)" : "bg-(--pp-accent)",
          state === "running" && "hero-v9-status-live"
        )}
        aria-hidden
      />
      <span
        className={cn(
          "text-sm transition-colors duration-500",
          state === "waiting" ? "text-muted-foreground" : "text-foreground/80",
          state === "running" && "text-foreground"
        )}
      >
        {label}
      </span>
    </div>
  )
}
