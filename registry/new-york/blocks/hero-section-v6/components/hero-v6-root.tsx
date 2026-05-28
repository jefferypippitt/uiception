"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"

import HeroContent from "./hero-content"
import { HeroV6Image } from "./hero-v6-image"
import ShaderImageBg from "./shader-image-bg"

export function HeroV6Root() {
  const rootRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const media = mediaRef.current
    const frame = frameRef.current
    if (!root || !media || !frame) return

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const reveals = gsap.utils.toArray<HTMLElement>(
      "[data-hero-v6-reveal]",
      root
    )
    const words = gsap.utils.toArray<HTMLElement>("[data-hero-v6-word]", root)

    if (reduceMotion) {
      gsap.set([...words, ...reveals, media, frame], {
        clearProps: "all",
        autoAlpha: 1,
      })
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(words, { autoAlpha: 0, y: 26, force3D: true })
      gsap.set(reveals, { autoAlpha: 0, y: 20, force3D: true })
      gsap.set(media, {
        autoAlpha: 0,
        y: 42,
        scale: isDesktop ? 0.985 : 0.995,
        transformOrigin: "50% 50%",
        force3D: true,
      })
      gsap.set(frame, {
        autoAlpha: 0,
        scale: 0.97,
        force3D: true,
      })

      const allEls = [...words, ...reveals, media, frame]

      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.48 },
        onComplete: () => {
          gsap.set(allEls, { clearProps: "willChange" })
        },
      })

      tl.to(words, {
        autoAlpha: 1,
        y: 0,
        ease: "power2.out",
        stagger: { each: 0.04, from: "start" },
        force3D: true,
        clearProps: "transform",
      })
        .to(
          reveals[0],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.42,
            ease: "power2.out",
            force3D: true,
            clearProps: "transform",
          },
          ">-0.06"
        )
        .to(
          reveals[1],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            force3D: true,
            clearProps: "transform",
          },
          ">-0.04"
        )
        .to(
          media,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.62,
            ease: "power3.out",
            force3D: true,
            clearProps: "transform",
          },
          ">-0.02"
        )
        .to(
          frame,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.56,
            ease: "power2.out",
            force3D: true,
            clearProps: "transform",
          },
          "<"
        )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <HeroContent />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-4">
        <div
          ref={mediaRef}
          className="hero-v6-media-shell relative mt-4 aspect-video w-full max-sm:mt-3.5 sm:mt-6"
        >
          <ShaderImageBg ref={frameRef} />
          <div className="hero-v6-media-image absolute inset-4 sm:inset-5 md:inset-7">
            <div className="relative size-full overflow-hidden rounded-sm border border-slate-900/22 bg-[#f5f5f5]">
              <HeroV6Image />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
