import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function ResumeSection({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn("flex flex-col gap-5", className)} data-resume-section>
      <h2
        className="text-sm font-semibold tracking-tight text-foreground"
        data-resume-heading
      >
        {title}
      </h2>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  )
}
