"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"

gsap.registerPlugin(DrawSVGPlugin)

export function useStockChartAnimation() {
  const lineRef = useRef<SVGPathElement>(null)

  useLayoutEffect(() => {
    const line = lineRef.current
    if (!line) return

    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(line, { drawSVG: "100%" })
    })

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(line, { drawSVG: "0% 0%" })

      const tl = gsap.timeline({ delay: 0.4 })
      tl.to(line, {
        drawSVG: "0% 100%",
        duration: 2,
        ease: "power2.out",
      })

      return () => tl.kill()
    })

    return () => mm.revert()
  }, [])

  return { lineRef }
}
