import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

export type StudioDisplayScreenProps = {
  className?: string
  minHeight?: string | number
  aspectRatio?: string
  children?: ReactNode
}

export default function StudioDisplayScreen({
  className,
  minHeight = "15rem",
  aspectRatio,
  children,
}: StudioDisplayScreenProps) {
  const style = {
    ...(aspectRatio ? { aspectRatio } : {}),
    minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
  } satisfies CSSProperties

  return (
    <div
      className={cn(
        "relative z-1 box-border w-full overflow-hidden rounded-md border-10 border-(--msd-bezel) bg-(--msd-screen)",
        className
      )}
      style={style}
    >
      {children ? (
        <div className="msd-screen-slot absolute inset-0 flex size-full overflow-hidden">
          {children}
        </div>
      ) : null}
    </div>
  )
}
