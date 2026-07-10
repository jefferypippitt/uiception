"use client"

import { type RefObject, useLayoutEffect, useRef } from "react"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export type Hiw2V2Refs = {
  title: RefObject<HTMLElement | null>
  cards: RefObject<(HTMLDivElement | null)[]>
}

export function useHiw2V2Animations(refs: Hiw2V2Refs) {
  const refsRef = useRef(refs)
  useLayoutEffect(() => {
    refsRef.current = refs
  })

  useLayoutEffect(() => {
    let ctx: gsap.Context | null = null
    const r = () => refsRef.current

    const cardEls = (r().cards.current ?? []).filter(Boolean) as HTMLElement[]
    if (!cardEls.length) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const titleEl = r().title.current
      const allFeatures = cardEls.flatMap((card) =>
        Array.from(card.querySelectorAll<HTMLElement>("[data-hiw2-feature]"))
      )
      gsap.set([titleEl, ...cardEls, ...allFeatures].filter(Boolean), {
        clearProps: "all",
      })
      return
    }

    ctx = gsap.context(() => {
      const titleEl = r().title.current

      if (titleEl) {
        gsap.set(titleEl, { y: 28, opacity: 0 })
        gsap.to(titleEl, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleEl,
            start: "top 88%",
            once: true,
                      },
        })
      }

      cardEls.forEach((card) => {
        gsap.set(card, { y: 20, opacity: 0 })
        gsap.to(card, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 84%",
            once: true,
          },
        })
      })

      cardEls.forEach((card, i) => {
        const features = Array.from(
          card.querySelectorAll<HTMLElement>("[data-hiw2-feature]")
        )
        if (!features.length) return

        gsap.set(features, { x: -12, opacity: 0 })
        gsap.to(features, {
          x: 0,
          opacity: 1,
          stagger: 0.075,
          duration: 0.44,
          ease: "power2.out",
          delay: 0.2 + i * 0.08,
          scrollTrigger: {
            trigger: card,
            start: "top 84%",
            once: true,
                      },
        })
      })

      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    })

    return () => {
      ctx?.revert()
    }
  }, [])
}
