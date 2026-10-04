import { cn } from "@/lib/utils"

import type { Partner } from "../lib/partners"

export default function PartnerIcon({
  partner,
  className,
}: {
  partner: Partner
  className?: string
}) {
  const Light = partner.light
  const Dark = partner.dark
  const shellClass = cn("inline-flex items-center justify-center", className)

  if (Dark) {
    return (
      <span className={shellClass}>
        <Light className="block h-full w-full dark:hidden" aria-hidden />
        <Dark className="hidden h-full w-full dark:block" aria-hidden />
      </span>
    )
  }

  return (
    <span className={shellClass}>
      <Light className="h-full w-full" aria-hidden />
    </span>
  )
}
