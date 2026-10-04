"use client"

import { type RefObject, useLayoutEffect } from "react"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function usePartnersV3Motion(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = (selector: string) =>
        Array.from(root.querySelectorAll<HTMLElement>(selector))

      const heading = root.querySelector<HTMLElement>("[data-pv3-heading]")
      const words = q("[data-pv3-word]")
      const description = q("[data-pv3-description]")
      const list = root.querySelector<HTMLElement>("[data-pv3-list]")
      const items = q("[data-pv3-item]")
      if (!heading || !list || items.length === 0) return

      // Heading words brighten one by one as the section scrolls in.
      gsap.fromTo(
        words,
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: heading, start: "top 85%", end: "top 45%", scrub: 0.6 },
        }
      )
      gsap.fromTo(
        description,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: heading, start: "top 75%", end: "top 40%", scrub: 0.6 },
        }
      )

      // Partners rise in, in reading order, the first time the grid shows.
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          clearProps: "transform",
          scrollTrigger: { trigger: list, start: "top 85%", once: true },
        }
      )
    })

    return () => mm.revert()
  }, [rootRef])
}
