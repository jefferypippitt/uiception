import { ensureUiceptionBlockMedia } from "@/lib/ensure-uiception-block-media"
import TestimonialsCarousel from "./testimonials-carousel"
import { sectionMeta, testimonials } from "./testimonials-content"
import "./testimonials-section-v1.css"

export default async function TestimonialsSectionV1() {
  await ensureUiceptionBlockMedia("testimonials-section-v1")
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-10 text-3xl font-medium tracking-tight md:mb-12">
          {sectionMeta.title}
        </h2>
        <TestimonialsCarousel testimonials={testimonials} />
      </div>
    </section>
  )
}
