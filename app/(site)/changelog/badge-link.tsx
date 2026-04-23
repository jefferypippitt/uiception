"use client"

import Link from "next/link"
import type { ReactNode } from "react"

interface ChangelogBadgeLinkProps {
  href: string
  className?: string
  children: ReactNode
}

export function ChangelogBadgeLink({ href, className, children }: ChangelogBadgeLinkProps) {
  const isExternal = /^https?:\/\//.test(href)

  if (isExternal) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
