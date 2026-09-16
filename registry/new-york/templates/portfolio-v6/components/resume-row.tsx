import { Minus } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

function DateLabel({ date }: { date: string }) {
  const [start, end] = date.split(" — ")
  if (end === undefined) return <>{date}</>

  return (
    <span className="inline-flex items-center gap-1">
      <span>{start}</span>
      <Minus className="size-3 shrink-0 text-muted-foreground/60" />
      <span>{end}</span>
    </span>
  )
}

export function ResumeRow({
  date,
  children,
  className,
}: {
  date: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-1 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6",
        className
      )}
      data-resume-row
    >
      <div
        className="pt-0.5 text-left text-sm tabular-nums text-muted-foreground"
        data-resume-date
      >
        <DateLabel date={date} />
      </div>
      <div className="min-w-0" data-resume-copy>
        {children}
      </div>
    </div>
  )
}
