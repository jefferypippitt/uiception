import { createBlockImage } from "@/lib/block-media"

import TestimonialStack from "./testimonial-stack"
import {
  sectionMeta,
  testimonials as testimonialItems,
  type ResolvedTestimonial,
} from "../lib/testimonials-content"

const blockImage = createBlockImage("testimonials-section-v7")

export default function TestimonialsSectionV7() {
  const testimonials: ResolvedTestimonial[] = testimonialItems.map((item) => {
    const { avatarFile, ...rest } = item
    return {
      ...rest,
      avatarSrc: blockImage(avatarFile),
    }
  })

  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        <div className="flex flex-col items-start gap-4">
          <h2 className="text-4xl font-medium tracking-tighter sm:text-5xl">
            {sectionMeta.title}
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            {sectionMeta.description}
          </p>
        </div>

        <TestimonialStack testimonials={testimonials} />
      </div>
    </section>
  )
}
