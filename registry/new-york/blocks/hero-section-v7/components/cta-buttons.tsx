"use client"

import { useLayoutEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"

import { cn } from "@/lib/utils"

import type { HeroV7Cta } from "../lib/config"
import { heroV7Content } from "../lib/config"

const CHAR_STAGGER = 0.03
const DURATION = 0.45
const EASE = "power3.out"

function playIn(row1: HTMLElement[], row2: HTMLElement[]) {
  gsap.killTweensOf([...row1, ...row2])
  gsap.to(row1, {
    yPercent: -100,
    duration: DURATION,
    stagger: CHAR_STAGGER,
    ease: EASE,
    overwrite: "auto",
  })
  gsap.to(row2, {
    yPercent: 0,
    duration: DURATION,
    stagger: CHAR_STAGGER,
    ease: EASE,
    overwrite: "auto",
  })
}

function playOut(row1: HTMLElement[], row2: HTMLElement[]) {
  gsap.killTweensOf([...row1, ...row2])
  gsap.to(row1, {
    yPercent: 0,
    duration: DURATION,
    stagger: { each: CHAR_STAGGER, from: "end" },
    ease: EASE,
    overwrite: "auto",
  })
  gsap.to(row2, {
    yPercent: 100,
    duration: DURATION,
    stagger: { each: CHAR_STAGGER, from: "end" },
    ease: EASE,
    overwrite: "auto",
  })
}

function useStaggerCtaAnimation(label: string) {
  const linkRef = useRef<HTMLAnchorElement>(null)

  useLayoutEffect(() => {
    const link = linkRef.current
    if (!link) return

    const row1 = gsap.utils.toArray<HTMLElement>(
      ".hero-v7-cta__stagger-text:not(.hero-v7-cta__stagger-text--second) .hero-v7-cta__char",
      link
    )
    const row2 = gsap.utils.toArray<HTMLElement>(
      ".hero-v7-cta__stagger-text--second .hero-v7-cta__char",
      link
    )

    if (row1.length === 0 || row2.length === 0) return

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (reduced) {
      gsap.set([...row1, ...row2], { clearProps: "all" })
      return
    }

    gsap.set(row1, { yPercent: 0 })
    gsap.set(row2, { yPercent: 100 })

    let over = false
    let pressed = false

    const sync = () => {
      if (over || pressed) playIn(row1, row2)
      else playOut(row1, row2)
    }

    const onEnter = () => {
      over = true
      sync()
    }

    const onLeave = () => {
      over = false
      pressed = false
      sync()
    }

    const onDown = (event: PointerEvent) => {
      if (!event.isPrimary) return
      if (event.pointerType === "mouse" && event.button !== 0) return
      pressed = true
      if (event.pointerType === "touch" || event.pointerType === "pen") {
        try {
          link.setPointerCapture(event.pointerId)
        } catch {

        }
      }
      sync()
    }

    const onUp = (event: PointerEvent) => {
      pressed = false
      try {
        if (link.hasPointerCapture(event.pointerId)) {
          link.releasePointerCapture(event.pointerId)
        }
      } catch {

      }
      if (event.pointerType === "touch") over = false
      sync()
    }

    const onCancel = (event: PointerEvent) => {
      pressed = false
      try {
        if (link.hasPointerCapture(event.pointerId)) {
          link.releasePointerCapture(event.pointerId)
        }
      } catch {

      }
      sync()
    }

    link.addEventListener("pointerenter", onEnter)
    link.addEventListener("pointerleave", onLeave)
    link.addEventListener("pointerdown", onDown)
    link.addEventListener("pointerup", onUp)
    link.addEventListener("pointercancel", onCancel)

    return () => {
      link.removeEventListener("pointerenter", onEnter)
      link.removeEventListener("pointerleave", onLeave)
      link.removeEventListener("pointerdown", onDown)
      link.removeEventListener("pointerup", onUp)
      link.removeEventListener("pointercancel", onCancel)
      gsap.killTweensOf([...row1, ...row2])
    }
  }, [label])

  return linkRef
}

function StaggerChars({ chars }: { chars: string[] }) {
  return (
    <>
      {chars.map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="hero-v7-cta__char inline-block will-change-transform"
        >
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </>
  )
}

function FlipCtaButton({
  href,
  label,
  variant = "primary",
  className,
}: {
  href: string
  label: string
  variant?: "primary" | "secondary"
  className?: string
}) {
  const linkRef = useStaggerCtaAnimation(label)

  return (
    <Link
      ref={linkRef}
      href={href}
      className={cn(
        "group relative inline-flex min-h-10 items-center justify-center rounded-full border px-5.5 py-2 font-mono text-sm font-medium tracking-[0.12em] uppercase no-underline transition-[background-color,border-color,color] duration-250 ease-out outline-none",
        variant === "primary" &&
          "border-white/14 bg-[#141414] text-zinc-100 hover:border-blue-500/40 hover:bg-[#1f1f1f] focus-visible:shadow-[0_0_0_2px_color-mix(in_srgb,rgba(59,130,246,0.55)_55%,transparent)] active:border-blue-500/40 active:bg-[#1f1f1f]",
        variant === "secondary" &&
          "border-zinc-900/14 bg-zinc-100 text-zinc-900 hover:border-orange-500/40 hover:bg-zinc-50 focus-visible:shadow-[0_0_0_2px_color-mix(in_srgb,rgba(249,115,22,0.55)_55%,transparent)] active:border-orange-500/40 active:bg-zinc-50",
        className
      )}
      style={{ touchAction: "manipulation" }}
    >
      <span
        className={cn(
          "pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100",
          variant === "primary" &&
            "shadow-[0_0_0_1px_rgba(59,130,246,0.65),0_0_16px_rgba(59,130,246,0.28),0_0_32px_color-mix(in_srgb,rgba(59,130,246,0.28)_65%,transparent)]",
          variant === "secondary" &&
            "shadow-[0_0_0_1px_rgba(249,115,22,0.65),0_0_16px_rgba(249,115,22,0.28),0_0_32px_color-mix(in_srgb,rgba(249,115,22,0.28)_65%,transparent)]"
        )}
        aria-hidden="true"
      />
      <span className="relative inline-block overflow-hidden leading-none">
        <span className="hero-v7-cta__stagger-text inline-flex flex-wrap justify-center gap-0">
          <StaggerChars chars={label.split("")} />
        </span>
        <span
          className="hero-v7-cta__stagger-text hero-v7-cta__stagger-text--second absolute inset-0 inline-flex justify-center"
          aria-hidden="true"
        >
          <StaggerChars chars={label.split("")} />
        </span>
      </span>
    </Link>
  )
}

export default function CtaButtons({
  primaryCta = heroV7Content.primaryCta,
  secondaryCta = heroV7Content.secondaryCta,
}: {
  primaryCta?: HeroV7Cta
  secondaryCta?: HeroV7Cta
}) {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-3">
      <FlipCtaButton
        href={primaryCta.href}
        label={primaryCta.label}
        variant="primary"
        className="w-full sm:w-auto"
      />
      <FlipCtaButton
        href={secondaryCta.href}
        label={secondaryCta.label}
        variant="secondary"
        className="w-full sm:w-auto"
      />
    </div>
  )
}
