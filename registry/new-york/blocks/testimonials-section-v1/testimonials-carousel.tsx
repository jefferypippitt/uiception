"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel"

import type { Testimonial } from "./testimonials-content"
import TestimonialCard from "./testimonial-card"

function CarouselNav() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel()

  return (
    <div className="flex shrink-0 gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="size-9 rounded-full border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
        disabled={!canScrollPrev}
        aria-label="Previous testimonial"
        onClick={scrollPrev}
      >
        <ChevronLeftIcon />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="size-9 rounded-full border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
        disabled={!canScrollNext}
        aria-label="Next testimonial"
        onClick={scrollNext}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  )
}

export default function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  return (
    <Carousel opts={{ align: "start", loop: false }} className="w-full">
      <CarouselContent className="-ml-6 items-stretch md:-ml-8">
        {testimonials.map((testimonial) => (
          <CarouselItem
            key={testimonial.id}
            className="flex basis-full pl-6 md:basis-1/2 md:pl-8"
          >
            <TestimonialCard testimonial={testimonial} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-8">
        <CarouselNav />
      </div>
    </Carousel>
  )
}
