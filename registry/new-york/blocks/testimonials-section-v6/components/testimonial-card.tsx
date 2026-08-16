import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import type { ResolvedTestimonial } from "../lib/testimonials-content"

export default function TestimonialCard({
  testimonial,
}: {
  testimonial: ResolvedTestimonial
}) {
  const { avatarSrc, avatarAlt, description, storyHref, company } =
    testimonial

  const Mark = company.mark

  return (
    <article className="flex h-full flex-col gap-4">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl">
        <Image
          src={avatarSrc}
          alt={avatarAlt}
          fill
          unoptimized
          sizes="(max-width: 768px) 90vw, 25vw"
          className="object-cover object-center"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/70 to-transparent"
          aria-hidden
        />
        <Mark
          className="absolute bottom-3 left-3 h-4 w-auto"
          aria-label={company.name}
        />
      </div>

      <div className="flex flex-1 items-end justify-between gap-4">
        <p className="text-sm leading-relaxed text-foreground">
          {description}
        </p>
        <Link
          href={storyHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${company.name}'s story in a new tab`}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
        >
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  )
}
