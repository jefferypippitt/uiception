import { cn } from "@/lib/utils"

import TestimonialCard from "./testimonial-card"
import { testimonials } from "../lib/testimonials-content"

const cellClassNames = [
  "sm:col-span-2 lg:col-span-1 lg:row-span-2 lg:col-start-1 lg:row-start-1",
  "lg:col-span-2 lg:col-start-2 lg:row-start-1",
  "sm:max-lg:col-span-1 lg:col-start-2 lg:row-start-2",
  "sm:max-lg:col-span-1 lg:col-start-3 lg:row-start-2",
] as const

export default function TestimonialGrid() {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr] lg:grid-rows-[minmax(11.25rem,auto)_minmax(11.25rem,auto)] lg:items-stretch">
      {testimonials.map((testimonial, index) => (
        <li key={testimonial.id} className={cn("flex min-w-0", cellClassNames[index])}>
          <TestimonialCard testimonial={testimonial} />
        </li>
      ))}
    </ul>
  )
}
