"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { MouseEvent, ReactNode } from "react"

interface ChangelogBadgeLinkProps {
  href: string
  className?: string
  children: ReactNode
}

type StartViewTransition = (callback?: () => void | Promise<void>) => {
  finished: Promise<void>
}

export function ChangelogBadgeLink({ href, className, children }: ChangelogBadgeLinkProps) {
  const router = useRouter()
  const isExternal = /^https?:\/\//.test(href)

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Preserve default browser behavior for modified/middle clicks.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return
    }
    const startViewTransition = (document as any).startViewTransition?.bind(document) as StartViewTransition | undefined
    if (isExternal || typeof startViewTransition !== "function") return

    e.preventDefault()
    const html = document.documentElement
    html.classList.add("badge-nav")
    const transition = startViewTransition(() => {
      router.push(href)
    })
    transition.finished.finally(() => html.classList.remove("badge-nav"))
  }

  if (isExternal) {
    return (
      <a href={href} onClick={handleClick} className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}
