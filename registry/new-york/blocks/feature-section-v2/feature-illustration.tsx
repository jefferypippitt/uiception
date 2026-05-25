import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export const FEATURE_CARD_MEDIA_HEIGHT = "h-56 min-h-56"

type FeatureIllustrationProps = {
  viewBox: string
  children: ReactNode
  className?: string
  svgClassName?: string
}

export function FeatureIllustration({
  viewBox,
  children,
  className,
  svgClassName,
}: FeatureIllustrationProps) {
  return (
    <div
      className={cn(
        "size-full min-h-0 opacity-40 motion-safe:transition-opacity duration-200 ease-out group-hover/card:opacity-70",
        className
      )}
    >
      <svg
        aria-hidden
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        className={cn("text-foreground block size-full", svgClassName)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
    </div>
  )
}
