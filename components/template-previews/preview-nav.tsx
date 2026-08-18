"use client"

import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

/**
 * Host-only: rewrites absolute in-app links (/writing) to the nested
 * preview route (/view/<id>/writing). Never ships in the registry template.
 *
 * Capture-phase intercept so Next's <Link> does not start a view transition
 * toward the unprefixed href before we rewrite it. Forwards
 * `data-transition-types` onto router.push so typed page transitions still run.
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
      event.stopPropagation()

      const types = anchor
        .getAttribute("data-transition-types")
        ?.split(/[\s,]+/)
        .filter(Boolean)
      const url = `${basePath}${href === "/" ? "" : href}`

      if (types?.length) {
        router.push(url, { transitionTypes: types })
      } else {
        router.push(url)
      }
    }

    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [basePath, router])

  return children
}
