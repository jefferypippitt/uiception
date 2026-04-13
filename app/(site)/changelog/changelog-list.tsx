"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface Props {
  children: ReactNode
}

export function ChangelogList({ children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: reduce)", () => {
      for (const row of root.querySelectorAll<HTMLElement>(".cl-row")) {
        const dateEl = row.querySelector<HTMLElement>(".cl-date")
        const cardEl = row.querySelector<HTMLElement>(".cl-card")
        if (dateEl) gsap.set(dateEl, { autoAlpha: 1, y: 0 })
        if (cardEl) gsap.set(cardEl, { autoAlpha: 1, y: 0 })
      }
    })

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      for (const row of root.querySelectorAll<HTMLElement>(".cl-row")) {
        const dateEl = row.querySelector<HTMLElement>(".cl-date")
        const cardEl = row.querySelector<HTMLElement>(".cl-card")
        if (!dateEl || !cardEl) continue

        gsap
          .timeline({
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          })
          .fromTo(
            dateEl,
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }
          )
          .fromTo(
            cardEl,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" },
            "<0.08"
          )
      }
    }, root)

    return () => {
      mm.revert()
    }
  }, [])

  return (
    <div ref={containerRef} className="space-y-0">
      {children}
    </div>
  )
}
