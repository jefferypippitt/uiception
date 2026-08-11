"use client"

import Link from "next/link"
import type { CSSProperties } from "react"

import { Button } from "@/components/ui/button"

import { GlowCanvas } from "./glow-canvas"
import { Badge } from "./ui/badge"
import { site } from "../lib/site"

export function HeroSection() {
  return (
    <section className="relative flex h-dvh w-full flex-col overflow-hidden bg-black text-white">
      <GlowCanvas />

      <div
        aria-hidden
        className="hero-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 z-5 h-64"
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 py-24 text-center">
        <div
          className="hero-reveal"
          style={{ "--hero-delay": "80ms" } as CSSProperties}
        >
          <Badge
            variant="glass"
            className="h-6 px-2.5 text-sm tracking-wide"
          >
            {site.date}
            <span aria-hidden className="mx-1.5 text-white/35">
              ·
            </span>
            {site.city}
          </Badge>
        </div>

        <h1
          className="hero-reveal mt-5 max-w-[16ch] text-balance text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.9] font-medium tracking-[-0.12rem] text-white [text-shadow:0_0_40px_rgba(0,0,0,0.55)]"
          style={{ "--hero-delay": "160ms" } as CSSProperties}
        >
          {site.name}
        </h1>

        <p
          className="hero-reveal mt-7 max-w-md text-[clamp(1.5rem,3.5vw,2.25rem)] leading-[1.15] font-medium tracking-[-0.04em] text-white/70"
          style={{ "--hero-delay": "260ms" } as CSSProperties}
        >
          {site.tagline}
        </p>

        <div
          className="hero-reveal mt-9"
          style={{ "--hero-delay": "340ms" } as CSSProperties}
        >
          <Button variant="default" size="lg" asChild>
            <Link href={site.ctaHref} transitionTypes={["nav-forward"]}>
              {site.ctaLabel}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
