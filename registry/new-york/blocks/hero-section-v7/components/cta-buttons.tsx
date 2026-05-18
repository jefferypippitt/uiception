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
      link,
    )
    const row2 = gsap.utils.toArray<HTMLElement>(
      ".hero-v7-cta__stagger-text--second .hero-v7-cta__char",
      link,
    )

    if (row1.length === 0 || row2.length === 0) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
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
          /* ignore */
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
        /* ignore */
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
        /* ignore */
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
        <span key={`${char}-${i}`} className="hero-v7-cta__char">
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
        "hero-v7-cta",
        variant === "primary" && "hero-v7-cta--primary",
        variant === "secondary" && "hero-v7-cta--secondary",
        className,
      )}
      style={{ touchAction: "manipulation" }}
    >
      <span className="hero-v7-cta__glow" aria-hidden="true" />
      <span className="hero-v7-cta__stagger-wrapper">
        <span className="hero-v7-cta__stagger-text">
          <StaggerChars chars={label.split("")} />
        </span>
        <span
          className="hero-v7-cta__stagger-text hero-v7-cta__stagger-text--second"
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
