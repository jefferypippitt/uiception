import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

export type MacbookScreenProps = {
  className?: string
  /** Minimum height when the screen is empty (default `20rem`) */
  minHeight?: string | number
  /** e.g. `"16 / 10"` — keeps the display opening proportional when set */
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
    <div className={cn("mbp-screen", className)} style={style}>
      {children ? <div className="mbp-screen-slot">{children}</div> : null}
    </div>
  )
}
