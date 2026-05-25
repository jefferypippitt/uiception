import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { FEATURE_CARD_MEDIA_HEIGHT } from "./feature-illustration"

type FeatureCardMediaProps = {
  children: ReactNode
  className?: string
}

export function FeatureCardMedia({ children, className }: FeatureCardMediaProps) {
  return (
    <div
      className={cn(
        "relative w-full shrink-0 overflow-hidden bg-background",
        FEATURE_CARD_MEDIA_HEIGHT,
        className
      )}
      aria-hidden
    >
      {children}
    </div>
  )
}
