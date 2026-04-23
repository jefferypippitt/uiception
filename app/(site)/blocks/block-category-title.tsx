"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export function BlockCategoryTitle({
  id,
  title,
  className,
}: {
  id: string
  title: string
  className?: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        el.style.setProperty(
          "view-transition-name",
          entry.isIntersecting ? `title-${id}` : "none"
        )
      },
      { threshold: 0 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [id])

  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium", className)}
      style={{ viewTransitionName: `title-${id}` } as React.CSSProperties}
    >
      {title}
    </p>
  )
}
