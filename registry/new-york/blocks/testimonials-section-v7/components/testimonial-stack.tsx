import TestimonialCard from "./testimonial-card"
import type { ResolvedTestimonial } from "../lib/testimonials-content"

/**
 * Per-slot offset, tilt, and stacking order for the overlapping layout.
 * The middle card sits behind its neighbours; hovering any card squares it
 * up and lifts it to the front. Mobile falls back to a plain vertical list.
 */
const SLOT_CLASSES = [
  "z-20 lg:mr-14 lg:rotate-[1.5deg]",
  "z-10 lg:-mt-5 lg:ml-14 lg:-rotate-[0.75deg]",
  "z-20 lg:-mt-5 lg:mr-8 lg:-rotate-[1.25deg]",
] as const

export default function TestimonialStack({
  testimonials,
}: {
  testimonials: ResolvedTestimonial[]
}) {
  return (
    <ul className="m-0 flex list-none flex-col gap-4 p-0 lg:gap-0 lg:py-4">
      {testimonials.map((testimonial, index) => (
        <li
          key={testimonial.id}
          className={`relative transition-transform duration-300 ease-out lg:hover:z-30 lg:hover:-translate-y-1 lg:hover:rotate-0 ${SLOT_CLASSES[index % SLOT_CLASSES.length]}`}
        >
          <TestimonialCard testimonial={testimonial} />
        </li>
      ))}
    </ul>
  )
}
