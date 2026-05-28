import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

export type MacbookScreenProps = {
  className?: string
  minHeight?: string | number
  aspectRatio?: string
  children?: ReactNode
}

export default function MacbookScreen({
  className,
  minHeight = "20rem",
  aspectRatio,
  children,
}: MacbookScreenProps) {
  const style = {
    ...(aspectRatio ? { aspectRatio } : {}),
    minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
  } satisfies CSSProperties

  return (
    <div
      className={cn(
        "relative z-1 box-border w-full overflow-hidden rounded border-8 border-b-4.5 border-(--mbp-bezel) bg-transparent",
        className
      )}
      style={style}
    >
      {children ? (
        <div className="mbp-screen-slot absolute inset-0 flex size-full overflow-hidden">
          {children}
        </div>
      ) : null}
    </div>
  )
}
