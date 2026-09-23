import Image from "next/image"

import type { ResolvedTestimonial } from "../lib/testimonials-content"

export default function TestimonialCard({
  testimonial,
}: {
  testimonial: ResolvedTestimonial
}) {
  const { name, role, avatarSrc, quote, company } = testimonial

  const MarkLight = company.markLight
  const MarkDark = company.markDark

  return (
    <figure className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-lg sm:gap-8 sm:p-8">
      <blockquote className="text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <figcaption className="flex items-center gap-3">
        <div className="relative size-11 shrink-0 overflow-hidden rounded-full">
          <Image
            src={avatarSrc}
            alt={name}
            fill
            unoptimized
            sizes="44px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{name}</p>
          <p className="truncate text-xs text-muted-foreground sm:text-sm">
            {role}
          </p>
        </div>
        <div className="ml-auto shrink-0" aria-label={company.name} role="img">
          <MarkLight
            className={`w-auto dark:hidden ${company.markClassName}`}
            aria-hidden
          />
          <MarkDark
            className={`hidden w-auto dark:block ${company.markClassName}`}
            aria-hidden
          />
        </div>
      </figcaption>
    </figure>
  )
}
