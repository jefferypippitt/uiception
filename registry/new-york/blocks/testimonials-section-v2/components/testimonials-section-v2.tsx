import TestimonialColumn from "./testimonial-column"
import { testimonials } from "../lib/testimonials-content"

export default function TestimonialsSectionV2() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 divide-y divide-border border border-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {testimonials.map((testimonial) => (
            <TestimonialColumn key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
