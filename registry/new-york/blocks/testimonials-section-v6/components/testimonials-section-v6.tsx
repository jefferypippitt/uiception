import { createBlockImage } from "@/lib/block-media"

import TestimonialGrid from "./testimonial-grid"
import {
  sectionMeta,
  testimonials as testimonialItems,
  type ResolvedTestimonial,
} from "../lib/testimonials-content"

const blockImage = createBlockImage("testimonials-section-v6")

export default function TestimonialsSectionV6() {
  const testimonials: ResolvedTestimonial[] = testimonialItems.map((item) => {
    const { avatarFile, ...rest } = item
    return {
      ...rest,
      avatarSrc: blockImage(avatarFile),
    }
  })

  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2 className="text-4xl font-medium tracking-tighter sm:text-5xl">
            {sectionMeta.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {sectionMeta.description}
          </p>
        </div>

        <div className="mt-10 md:mt-12 lg:mt-14">
          <TestimonialGrid testimonials={testimonials} />
        </div>
      </div>
    </section>
  )
}
