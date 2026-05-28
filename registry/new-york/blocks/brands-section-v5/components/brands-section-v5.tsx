"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"

import Marquee from "./marquee"
import { brands } from "../lib/brands"

import "../styles/brands-section-v5.css"

type Props = {
  animated?: boolean
}

export default function BrandsSectionV5({ animated = false }: Props) {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (!animated) return
    const section = sectionRef.current
    if (!section) return

    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(section.querySelectorAll(".bs5-box, .bs5-label, .bs5-slot"), {
        clearProps: "all",
        autoAlpha: 1,
      })
    })

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const box = section.querySelector(".bs5-box")
      const label = section.querySelector(".bs5-label")
      const marquee = section.querySelector(".bs5-marquee-wrap")
      const slots = section.querySelectorAll(".bs5-slot")
      if (!box || !label || !marquee || slots.length === 0) return

      gsap.set(box, { autoAlpha: 0, y: 20, force3D: true })
      gsap.set(label, { autoAlpha: 0, y: 14, force3D: true })
      gsap.set(marquee, { autoAlpha: 0, y: 12, force3D: true })
      gsap.set(slots, { autoAlpha: 0, y: 10, force3D: true })

      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.36 },
      })

      tl.to(box, {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        force3D: true,
        clearProps: "transform",
      })
        .to(
          label,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.34,
            ease: "power2.out",
            force3D: true,
            clearProps: "transform",
          },
          ">-0.02"
        )
        .to(
          marquee,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.34,
            ease: "power2.out",
            force3D: true,
            clearProps: "transform",
          },
          ">-0.1"
        )
        .to(
          slots,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.26,
            stagger: { each: 0.035, from: "start" },
            ease: "power1.out",
            force3D: true,
            clearProps: "transform",
          },
          ">-0.08"
        )
    })

    return () => mm.revert()
  }, [animated])

  return (
    <section ref={sectionRef} className="pt-0 pb-16 md:pb-20 lg:pb-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="bs5-box flex items-stretch overflow-hidden rounded-none border border-border">
          <div className="bs5-label flex shrink-0 items-center border-r border-border px-5 py-6">
            <p className="text-base leading-snug text-muted-foreground">
              <span className="block">
                Trusted by <span className="text-foreground">2000+</span>
              </span>
              <span className="block">Top companies</span>
            </p>
          </div>
          <Marquee brands={brands} />
        </div>
      </div>
    </section>
  )
}
