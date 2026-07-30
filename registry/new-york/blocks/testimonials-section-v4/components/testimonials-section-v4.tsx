import { createBlockImage } from "@/lib/block-media"

import { TestimonialsSectionV4Root } from "./testimonials-section-v4-root"
import {
  testimonials as testimonialItems,
  type ResolvedTestimonial,
} from "../lib/testimonials-content"
import "../styles/testimonials-section-v4.css"

const blockImage = createBlockImage("testimonials-section-v4")

export default function TestimonialsSectionV4() {
  const testimonials: ResolvedTestimonial[] = testimonialItems.map((item) => {
    const { avatarFile, ...rest } = item
    return {
      ...rest,
      avatarSrc: blockImage(avatarFile),
    }
  })

  return <TestimonialsSectionV4Root testimonials={testimonials} />
}
