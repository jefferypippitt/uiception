import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

export type IphoneScreenProps = {
  className?: string
  minHeight?: string | number
  aspectRatio?: string
  children?: ReactNode
}

export default function IphoneScreen({
  className,
  minHeight = "26rem",
  aspectRatio = "1320 / 2740",
  children,
}: IphoneScreenProps) {
  const style = {
    ...(aspectRatio ? { aspectRatio } : {}),
    minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
  } satisfies CSSProperties

  return (
    <div
      className={cn(
        "ip17-screen relative z-1 box-border w-full overflow-hidden rounded-[3rem]",
        children ? "bg-black" : "bg-(--ip17-screen)",
        className
      )}
      style={style}
    >
      {children ? (
        <div className="ip17-screen-slot absolute inset-0 overflow-hidden rounded-[inherit]">
          {children}
        </div>
      ) : null}
    </div>
  )
}
