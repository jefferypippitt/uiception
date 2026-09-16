"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"

import { cn } from "@/lib/utils"

import { ThemeSwitcher } from "./theme-switcher"

// Path checks use `includes` so the pill still lights up under the host
// preview route (/view/portfolio-v6/writing), not only on a clean install.
const tabs = [
  {
    href: "/",
    label: "About",
    match: (path: string) => !path.includes("/writing"),
  },
  {
    href: "/writing",
    label: "Writing",
    match: (path: string) => path.includes("/writing"),
  },
] as const

export function SiteNav() {
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const pillPos = useRef({ x: 0, width: 0, primed: false })

  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const mm = gsap.matchMedia()
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        nav,
        { y: 14, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out" }
      )
    })

    return () => mm.revert()
  }, [])

  useLayoutEffect(() => {
    const tabsEl = tabsRef.current
    const pill = pillRef.current
    const activeIndex = tabs.findIndex((tab) => tab.match(pathname))
    const link = linkRefs.current[activeIndex]
    if (!tabsEl || !pill || !link) return

    const x = link.offsetLeft
    const width = link.offsetWidth
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!pillPos.current.primed || reduce) {
      gsap.set(pill, { x, width, autoAlpha: 1 })
    } else {
      gsap.to(pill, {
        x,
        width,
        duration: 0.34,
        ease: "power2.out",
        overwrite: "auto",
      })
    }

    pillPos.current = { x, width, primed: true }

    const onResize = () => {
      const current = linkRefs.current[tabs.findIndex((tab) => tab.match(pathname))]
      if (!current) return
      gsap.set(pill, { x: current.offsetLeft, width: current.offsetWidth })
    }

    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [pathname])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <nav
        ref={navRef}
        aria-label="Site"
        className="pointer-events-auto flex items-center gap-3 rounded-full border border-border/60 bg-background/90 p-1 shadow-sm backdrop-blur-md"
      >
        <div ref={tabsRef} className="relative flex items-center">
          <span
            ref={pillRef}
            aria-hidden
            className="absolute top-0 left-0 h-full rounded-full bg-foreground"
          />
          {tabs.map((tab, i) => {
            const active = tab.match(pathname)
            return (
              <Link
                key={tab.href}
                ref={(node) => {
                  linkRefs.current[i] = node
                }}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative z-10 rounded-full px-4 py-1.5 text-sm transition-colors",
                  active
                    ? "text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
        <ThemeSwitcher />
      </nav>
    </div>
  )
}
