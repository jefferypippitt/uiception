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
      for (const entry of root.querySelectorAll<HTMLElement>(".cl-entry")) {
        gsap.set(entry, { autoAlpha: 1, y: 0 })
      }
    })

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      for (const entry of root.querySelectorAll<HTMLElement>(".cl-entry")) {
        gsap.fromTo(
          entry,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: entry,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
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
