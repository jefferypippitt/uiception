import type { ComponentType } from "react"
import { cn } from "@/lib/utils"

export type CompanyIconId = string

export interface CompanyIconEntry {
  icon: ComponentType<{ className?: string }>
  darkIcon?: ComponentType<{ className?: string }>
  sizeClassName?: string
}

const registry: Record<string, CompanyIconEntry> = {}

export function registerCompanyIcons(
  entries: Record<string, CompanyIconEntry>,
) {
  Object.assign(registry, entries)
}

export function CompanyIcon({
  id,
  label,
  className,
}: {
  id: CompanyIconId
  label: string
  className?: string
}) {
  const entry = registry[id]

  if (entry) {
    const Icon = entry.icon
    const DarkIcon = entry.darkIcon
    return (
      <span
        className={cn("inline-flex shrink-0 items-center justify-center text-foreground transition-colors duration-300",
          entry.sizeClassName ?? "h-4 w-4",
          className,
        )}
        aria-label={label}
        title={label}
      >
        {DarkIcon ? (
          <>
            <Icon className="h-full w-full dark:hidden" aria-hidden="true" />
            <DarkIcon
              className="hidden h-full w-full dark:block"
              aria-hidden="true"
            />
          </>
        ) : (
          <Icon className="h-full w-full" aria-hidden="true" />
        )}
      </span>
    )
  }

  return (
    <span
      title={label}
      aria-label={label}
      className={cn("inline-flex h-5 w-5 select-none items-center justify-center rounded-full text-[10px] font-semibold uppercase leading-none ring-1 ring-current/30",
        className,
      )}
    >
      {label.charAt(0)}
    </span>
  )
}
