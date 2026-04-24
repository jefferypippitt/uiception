"use client"

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
  return (
    <p
      data-vt-category-title={id}
      className={cn("text-sm font-medium", className)}
      style={{ viewTransitionName: `title-${id}` } as React.CSSProperties}
    >
      {title}
    </p>
  )
}
