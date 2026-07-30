"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import type { ResolvedTestimonial } from "../lib/testimonials-content"
import { TestimonialShader } from "./testimonial-shader"

export default function TestimonialCard({
  testimonial,
}: {
  testimonial: ResolvedTestimonial
}) {
  const { company, name, role, quote, storyHref, avatarSrc, shader } =
    testimonial

  return (
    <article
      className="relative flex h-full min-h-112 w-full flex-col overflow-hidden text-white md:min-h-124 lg:min-h-136"
      style={{ backgroundColor: shader.accent }}
    >
      <TestimonialShader theme={shader} />

      <div
        className="pointer-events-none absolute inset-0 z-1 motion-reduce:bg-[color-mix(in_oklab,var(--muted)_40%,transparent)]"
        style={{ backgroundColor: `${shader.accent}33` }}
        aria-hidden
      />

      <header className="relative z-10 flex items-start justify-between gap-3 p-4 md:p-5">
        <p className="text-sm font-semibold tracking-tight text-white">
          {company}
        </p>
        <div className="max-w-[55%] text-right">
          <p className="text-sm font-medium leading-snug text-white">{name}</p>
          <p className="text-xs leading-snug text-white/70">{role}</p>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 items-end justify-center px-4 pt-2">
        <div className="relative aspect-square w-[70%] max-w-64 overflow-hidden rounded-full md:w-[76%] md:max-w-72">
          <Image
            src={avatarSrc}
            alt={name}
            fill
            unoptimized
            sizes="(max-width: 768px) 60vw, 25vw"
            className="ts4-portrait object-cover object-center"
          />
        </div>
      </div>

      <footer
        className="relative z-10 mt-auto flex flex-col gap-4 p-4 pt-6 md:p-5 md:pt-8"
        style={{ backgroundColor: shader.accent }}
      >
        <blockquote className="text-sm font-semibold leading-snug tracking-tight text-black md:text-[0.9375rem]">
          {quote}
        </blockquote>
        <Link
          href={storyHref}
          className="inline-flex w-fit items-center gap-1 text-sm font-medium text-black/80 transition-colors hover:text-black"
        >
          Read the full story
          <ChevronRight className="size-3.5" aria-hidden />
        </Link>
      </footer>
    </article>
  )
}
