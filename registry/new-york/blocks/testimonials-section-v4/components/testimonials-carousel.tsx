"use client"

import { useEffect, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel"

import type { ResolvedTestimonial } from "../lib/testimonials-content"
import TestimonialCard from "./testimonial-card"

const PAGE_SIZE = 3

function chunkTestimonials(items: ResolvedTestimonial[], size: number) {
  const pages: ResolvedTestimonial[][] = []
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size))
  }
  return pages
}

function CarouselNav() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel()

  return (
    <>
      <Button
        type="button"
        variant="default"
        size="icon-sm"
        className="absolute top-1/2 left-2 z-20 size-9 -translate-y-1/2 rounded-full bg-foreground text-background shadow-md hover:bg-foreground/90 disabled:opacity-40 md:left-3"
        disabled={!canScrollPrev}
        aria-label="Previous testimonials"
        onClick={scrollPrev}
      >
        <ChevronLeftIcon />
      </Button>
      <Button
        type="button"
        variant="default"
        size="icon-sm"
        className="absolute top-1/2 right-2 z-20 size-9 -translate-y-1/2 rounded-full bg-foreground text-background shadow-md hover:bg-foreground/90 disabled:opacity-40 md:right-3"
        disabled={!canScrollNext}
        aria-label="Next testimonials"
        onClick={scrollNext}
      >
        <ChevronRightIcon />
      </Button>
    </>
  )
}

function MobileCarousel({
  testimonials,
}: {
  testimonials: ResolvedTestimonial[]
}) {
  return (
    <Carousel opts={{ align: "start", loop: false }} className="w-full">
      <div className="relative">
        <CarouselContent className="ml-0">
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="basis-full pl-0">
              <TestimonialCard testimonial={testimonial} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNav />
      </div>
    </Carousel>
  )
}

function DesktopCarousel({ pages }: { pages: ResolvedTestimonial[][] }) {
  return (
    <Carousel opts={{ align: "start", loop: false }} className="w-full">
      <div className="relative overflow-hidden">
        <CarouselContent className="ml-0 touch-pan-y">
          {pages.map((page) => {
            const stops = page
              .map((item, index) => {
                const start = (index / page.length) * 100
                const end = ((index + 1) / page.length) * 100
                return `${item.shader.accent} ${start}% ${end}%`
              })
              .join(", ")

            return (
              <CarouselItem
                key={page.map((item) => item.id).join("-")}
                className="basis-full pl-0 transform-[translateZ(0)]"
              >
                <div
                  className="flex overflow-hidden backface-hidden transform-[translateZ(0)]"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${stops})`,
                  }}
                >
                  {page.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="relative min-w-0 basis-0 grow"
                    >
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  ))}
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselNav />
      </div>
    </Carousel>
  )
}

export default function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: ResolvedTestimonial[]
}) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)
  const pages = chunkTestimonials(testimonials, PAGE_SIZE)

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)")
    const update = () => setIsDesktop(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  if (isDesktop === null) {
    const preview = testimonials.slice(0, PAGE_SIZE)
    const stops = preview
      .map((item, index) => {
        const start = (index / preview.length) * 100
        const end = ((index + 1) / preview.length) * 100
        return `${item.shader.accent} ${start}% ${end}%`
      })
      .join(", ")

    return (
      <div
        className="flex overflow-hidden"
        style={{ backgroundImage: `linear-gradient(to right, ${stops})` }}
      >
        {preview.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={
              index === 0
                ? "min-w-0 basis-0 grow"
                : "hidden min-w-0 basis-0 grow md:block"
            }
          >
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </div>
    )
  }

  return isDesktop ? (
    <DesktopCarousel pages={pages} />
  ) : (
    <MobileCarousel testimonials={testimonials} />
  )
}
