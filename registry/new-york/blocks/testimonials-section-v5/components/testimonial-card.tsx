import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import type { Testimonial } from "../lib/testimonials-content"

export default function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial
}) {
  return (
    <article className="mb-4 break-inside-avoid rounded-lg border border-border bg-muted p-5 dark:bg-background md:p-6">
      <p className="text-sm leading-relaxed text-foreground">
        {testimonial.quote}
      </p>
      <div className="mt-5 flex items-center gap-3">
        <Avatar>
          <AvatarImage
            src={testimonial.avatarSrc}
            alt={testimonial.name}
            className="object-cover object-center"
          />
          <AvatarFallback>{testimonial.initials}</AvatarFallback>
        </Avatar>
        <p className="text-sm font-medium">{testimonial.name}</p>
      </div>
    </article>
  )
}
