"use client"

import { useLayoutEffect, useState } from "react"
import { cn } from "@/lib/utils"

import { LifelineDesktop } from "./lifeline-desktop"
import { LifelineVertical } from "./lifeline-vertical"
import { LIFELINE_MOBILE_BREAKPOINT } from "./lifeline-layout"
import type { LifelineProps } from "./types"
import "./lifeline.css"

export function Lifeline(props: LifelineProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useLayoutEffect(() => {
    const query = window.matchMedia(
      `(min-width: ${LIFELINE_MOBILE_BREAKPOINT}px)`,
    )
    const update = () => setIsMobile(!query.matches)

    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  if (isMobile === null) {
    return <div className="invisible h-full" aria-hidden="true" />
  }

  if (isMobile) {
    return (
      <div
        className={
          props.mode === "embed"
            ? cn(
                "lifeline-typeset h-full overflow-y-auto pt-5",
                props.className,
              )
            : "lifeline-typeset pt-5"
        }
      >
        <LifelineVertical {...props} />
      </div>
    )
  }

  return (
    <LifelineDesktop
      {...props}
      className={cn("lifeline-typeset py-5", props.className)}
    />
  )
}