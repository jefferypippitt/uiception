"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"

import type { ResolvedTestimonial } from "../lib/testimonials-content"
import { sectionMeta } from "../lib/testimonials-content"
import TestimonialsCarousel from "./testimonials-carousel"

export function TestimonialsSectionV4Root({
  testimonials,
}: {
  testimonials: ResolvedTestimonial[]
}) {
  return (
    <section className="bg-background py-16 md:py-20 lg:py-24">
      <div className="px-4 text-center">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
          <h2 className="text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-4xl md:text-5xl">
            {sectionMeta.title}
          </h2>
          <p className="max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            {sectionMeta.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="rounded-full">
              <Link href="#">{sectionMeta.primaryCta}</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="#">{sectionMeta.secondaryCta}</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl px-4 md:mt-14">
        <TestimonialsCarousel testimonials={testimonials} />
      </div>
    </section>
  )
}
