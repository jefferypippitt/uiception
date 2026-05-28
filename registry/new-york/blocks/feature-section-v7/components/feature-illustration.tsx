import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

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
        "flex size-full min-h-0 items-center justify-center opacity-40 motion-safe:transition-opacity duration-200 ease-out group-hover:opacity-70",
        className
      )}
    >
      <svg
        aria-hidden
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        className={cn("h-full w-full max-h-full max-w-full text-foreground", svgClassName)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
    </div>
  )
}
