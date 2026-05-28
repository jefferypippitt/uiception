import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import type { Testimonial } from "../lib/testimonials-content"

export default function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial
}) {
  return (
    <article className="ts1-card relative flex h-full min-h-48 w-full flex-col pl-6 md:pl-8">
      <blockquote className="text-base leading-relaxed text-foreground">
        {testimonial.quote}
      </blockquote>
      <footer className="ts1-card-footer mt-auto flex items-center gap-4 pt-8">
        <Avatar size="lg" className="overflow-hidden">
          <AvatarImage
            src={testimonial.avatarSrc}
            alt={testimonial.name}
            className="object-cover object-center"
          />
          <AvatarFallback>{testimonial.initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </footer>
    </article>
  )
}
