import { GeistSans } from "geist/font/sans"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import CompanyLogo from "./company-logo"
import type { Testimonial } from "../lib/testimonials-content"

export default function TestimonialColumn({
  testimonial,
}: {
  testimonial: Testimonial
}) {
  return (
    <article className="flex min-h-full flex-col">
      <blockquote
        className={`flex-1 px-6 py-8 ${GeistSans.className} text-base leading-relaxed tracking-wide md:px-8 md:py-10`}
      >
        {testimonial.quote}
      </blockquote>
      <footer className="flex items-center justify-between gap-4 border-t border-border px-6 py-5 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-11 shrink-0 rounded-none">
            <AvatarImage
              src={testimonial.avatarSrc}
              alt={testimonial.name}
              className="object-cover object-center"
            />
            <AvatarFallback>{testimonial.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-mono text-xs font-semibold tracking-wide uppercase">
              {testimonial.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {testimonial.title}
            </p>
          </div>
        </div>
        <CompanyLogo logo={testimonial.logo} />
      </footer>
    </article>
  )
}
