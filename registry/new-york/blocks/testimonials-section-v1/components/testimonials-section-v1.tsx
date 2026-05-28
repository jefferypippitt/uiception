import TestimonialsCarousel from "./testimonials-carousel"
import { sectionMeta, testimonials } from "../lib/testimonials-content"
import "../styles/testimonials-section-v1.css"

export default function TestimonialsSectionV1() {
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
