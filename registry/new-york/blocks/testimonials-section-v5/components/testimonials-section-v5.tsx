import { Badge } from "@/components/ui/badge"

import TestimonialCard from "./testimonial-card"
import { sectionMeta, testimonials } from "../lib/testimonials-content"

export default function TestimonialsSectionV5() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge variant="secondary">{sectionMeta.badge}</Badge>
          <h2 className="text-4xl font-medium tracking-tighter sm:text-5xl">
            {sectionMeta.title}
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
            {sectionMeta.description}
          </p>
        </div>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 md:mt-12 lg:mt-14 lg:columns-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
