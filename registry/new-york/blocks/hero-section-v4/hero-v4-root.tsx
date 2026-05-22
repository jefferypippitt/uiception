"use client"

import type { ReactNode } from "react"
import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { MotionConfig, motion } from "motion/react"

import HeroContent from "./hero-content"
import { HeroHalftoneImage } from "./hero-halftone-image"

const MEDIA_DELAY_S = 1.1

export function HeroV4Root({ children }: { children?: ReactNode }) {
  const copyRootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = copyRootRef.current
    if (!root) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(
        root.querySelectorAll("[data-hero-v4-reveal], [data-hero-v4-word]"),
        {
          clearProps: "all",
        }
      )
      return
    }

    const ctx = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>("[data-hero-v4-reveal]")
      const words = gsap.utils.toArray<HTMLElement>("[data-hero-v4-word]")

      const tl = gsap.timeline()

      tl.fromTo(
        words,
        { opacity: 0, filter: "blur(9px)", x: 20 },
        {
          opacity: 1,
          filter: "blur(0px)",
          x: 0,
          duration: 0.54,
          stagger: { each: 0.08, from: "start" },
          ease: "power3.out",
          clearProps: "transform,filter",
        }
      )

      tl.fromTo(
        reveals[0],
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
          clearProps: "transform",
        },
        "-=0.22"
      )

      tl.fromTo(
        reveals[1],
        { opacity: 0, y: 10, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.48,
          ease: "power2.out",
          clearProps: "transform",
        },
        "-=0.28"
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div ref={copyRootRef} className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          {children}
          <HeroContent />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pt-4">
        <motion.div
          className="hero-v4__media relative aspect-video w-full overflow-hidden rounded-xl"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: MEDIA_DELAY_S,
            duration: 0.72,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <HeroHalftoneImage />
        </motion.div>
      </div>
    </MotionConfig>
  )
}
