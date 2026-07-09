import type { ComponentType } from "react"

import { cn } from "@/lib/utils"

import type { FeatureItem } from "../lib/features"
import { FeatureCardCorners } from "./feature-card-corners"

export default function FeatureCard({
  item,
  active,
  onHoverIntent,
  onActivate,
}: {
  item: FeatureItem
  active: boolean
  /** Debounced hover — used so sweeping cards does not thrash the morph. */
  onHoverIntent: () => void
  /** Immediate commit — focus / click for a11y. */
  onActivate: () => void
}) {
  return (
    <button
      type="button"
      onMouseEnter={onHoverIntent}
      onFocus={onActivate}
      onClick={onActivate}
      className={cn(
        "relative w-full cursor-pointer border border-dashed bg-transparent p-4 text-left motion-safe:transition-colors duration-200 sm:p-5",
        "border-border/80 hover:border-primary/45 focus-visible:border-primary/55 focus-visible:outline-none",
        active && "border-primary/50 bg-primary/3"
      )}
      aria-pressed={active}
    >
      <FeatureCardCorners active={active} />
      <div className="flex flex-col gap-1">
        <h3
          className={cn(
            "m-0 text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-foreground sm:text-base",
            active && "text-primary"
          )}
        >
          {item.title}
        </h3>
        <p className="m-0 text-[0.8125rem] leading-relaxed text-muted-foreground sm:text-sm">
          {item.description}
        </p>
      </div>
    </button>
  )
}

export type FeatureIllustrationComponent = ComponentType<{
  active?: boolean
  className?: string
}>
