import TestimonialCard from "./testimonial-card"
import type { ResolvedTestimonial } from "../lib/testimonials-content"

export default function TestimonialGrid({
  testimonials,
}: {
  testimonials: ResolvedTestimonial[]
}) {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-x-4 gap-y-10 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((testimonial) => (
        <li key={testimonial.id} className="flex min-w-0">
          <TestimonialCard testimonial={testimonial} />
        </li>
      ))}
    </ul>
  )
}
