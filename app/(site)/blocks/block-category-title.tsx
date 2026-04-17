"use client"

import { useEffect, useRef } from "react"

export function BlockCategoryTitle({ id, title }: { id: string; title: string }) {
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
      className="text-sm font-medium"
      style={{ viewTransitionName: `title-${id}` } as React.CSSProperties}
    >
      {title}
    </p>
  )
}
