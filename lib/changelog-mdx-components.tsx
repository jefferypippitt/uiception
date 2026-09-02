import Link from "next/link"
import type { AnchorHTMLAttributes, ReactNode } from "react"

const linkClassName =
  "text-blue-600 no-underline hover:underline underline-offset-4 dark:text-blue-400"

interface ChangelogMdxLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string
  children?: ReactNode
}

function ChangelogMdxLink({ href = "", children, ...props }: ChangelogMdxLinkProps) {
  const isExternal = /^https?:\/\//.test(href)

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName} {...props}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={linkClassName} {...props}>
      {children}
    </Link>
  )
}

export const changelogMdxComponents = {
  a: ChangelogMdxLink,
}
