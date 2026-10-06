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

interface ChangelogGroupProps {
  children?: ReactNode
}

function ChangelogGroup({ label, children }: ChangelogGroupProps & { label: string }) {
  return (
    <section className="mt-6 first:mt-0 [&_ul]:mt-1">
      <p className="not-typeset text-sm text-muted-foreground">{label}</p>
      {children}
    </section>
  )
}

function ChangelogNew({ children }: ChangelogGroupProps) {
  return <ChangelogGroup label="New">{children}</ChangelogGroup>
}

function ChangelogImproved({ children }: ChangelogGroupProps) {
  return <ChangelogGroup label="Improved">{children}</ChangelogGroup>
}

function ChangelogFixed({ children }: ChangelogGroupProps) {
  return <ChangelogGroup label="Fixed">{children}</ChangelogGroup>
}

export const changelogMdxComponents = {
  a: ChangelogMdxLink,
  New: ChangelogNew,
  Improved: ChangelogImproved,
  Fixed: ChangelogFixed,
}
