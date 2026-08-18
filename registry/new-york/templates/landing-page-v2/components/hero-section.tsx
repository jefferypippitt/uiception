"use client"

import Link from "next/link"
import type { CSSProperties } from "react"

import { Button } from "@/components/ui/button"

import { Badge } from "./ui/badge"
import { site } from "../lib/site"

export function HeroSection() {
  return (
    <section className="relative flex h-dvh w-full flex-col overflow-hidden text-white">
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
            className="h-5 px-2 text-xs tracking-wide"
          >
            {site.date}
            <span aria-hidden className="mx-1.5 text-white/35">
              ·
            </span>
            {site.city}
          </Badge>
        </div>

        <h1
          className="hero-reveal mt-4 max-w-[16ch] text-balance text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] font-medium tracking-[-0.08rem] text-white [text-shadow:0_0_40px_rgba(0,0,0,0.55)]"
          style={{ "--hero-delay": "160ms" } as CSSProperties}
        >
          {site.name}
        </h1>

        <p
          className="hero-reveal mt-4 max-w-md text-[clamp(1rem,2vw,1.25rem)] leading-[1.3] font-medium tracking-[-0.02em] text-white"
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
