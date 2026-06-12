import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

import CompanyLogo from "./company-logo"
import type { Testimonial } from "../lib/testimonials-content"

export default function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial
}) {
  return (
    <article className="flex min-h-full w-full flex-col gap-4 border border-border bg-muted p-5 dark:bg-background md:p-6">
      <CompanyLogo logo={testimonial.logo} />
      <blockquote className="flex-1 text-base leading-relaxed text-foreground">
        {testimonial.quote}
      </blockquote>
      <footer className="mt-auto flex flex-col gap-3">
        <div>
          <p className="font-medium">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
        <Button variant="link" asChild className="h-auto w-fit px-0">
          <Link href={testimonial.storyHref}>
            Read story
            <ArrowRight />
          </Link>
        </Button>
      </footer>
    </article>
  )
}
