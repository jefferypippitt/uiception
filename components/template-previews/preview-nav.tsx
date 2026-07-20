"use client"

import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

/**
 * Host-only: rewrites absolute in-app links (/writing) to the nested
 * preview route (/view/<id>/writing). Never ships in the registry template.
 */
export function TemplatePreviewNav({
  basePath,
  children,
}: {
  basePath: string
  children: ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest("a")
      if (!anchor) return
      if (anchor.target === "_blank" || event.metaKey || event.ctrlKey) return

      const href = anchor.getAttribute("href")
      if (!href || !href.startsWith("/") || href.startsWith("//")) return
      if (href.startsWith(basePath)) return

      event.preventDefault()
      router.push(`${basePath}${href === "/" ? "" : href}`)
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [basePath, router])

  return children
}
