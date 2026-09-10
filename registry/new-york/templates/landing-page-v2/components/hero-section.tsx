"use client"

import Link from "next/link"
import type { CSSProperties } from "react"

import { Button } from "@/components/ui/button"

import { site } from "../lib/site"

export function HeroSection() {
  return (
    <section className="relative flex h-dvh w-full flex-col overflow-hidden text-white">
      <div
        aria-hidden
        className="hero-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 z-5 h-64"
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 py-24 text-center">
        <p
          className="hero-reveal flex items-center gap-2 text-[clamp(1rem,2vw,1.25rem)] leading-[1.3] font-light tracking-[-0.02em] text-white/90"
          style={{ "--hero-delay": "80ms" } as CSSProperties}
        >
          <span>{site.date}</span>
          <span>{site.city}</span>
        </p>

        <h1
          className="hero-reveal mt-4 max-w-[11ch] text-balance text-[clamp(2.75rem,8.5vw,5.5rem)] leading-[0.88] font-bold tracking-[-0.04em] uppercase"
          style={{ "--hero-delay": "160ms" } as CSSProperties}
        >
          {/* horizontal gradient fill + soft dark halo; kept on an inner span so
              the hero-reveal blur animation on <h1> doesn't clobber the filter */}
          <span className="box-decoration-clone bg-linear-to-r from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(0,0,0,0.55)]">
            {site.name}
          </span>
        </h1>

        <p
          className="hero-reveal mt-4 max-w-md text-[clamp(1rem,2vw,1.25rem)] leading-[1.3] font-light tracking-[-0.02em] text-white/90"
          style={{ "--hero-delay": "260ms" } as CSSProperties}
        >
          {site.tagline}
        </p>

        <div
          className="hero-reveal mt-7"
          style={{ "--hero-delay": "340ms" } as CSSProperties}
        >
          <Button variant="default" size="lg" asChild>
            <Link
              href={site.ctaHref}
              transitionTypes={["nav-forward"]}
              data-transition-types="nav-forward"
            >
              {site.ctaLabel}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
