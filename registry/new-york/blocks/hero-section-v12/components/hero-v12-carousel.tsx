"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { AnimatePresence, MotionConfig, motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import {
  AUTOPLAY_MS,
  body,
  headline,
  primaryCta,
  secondaryCta,
  title,
} from "../lib/config"

export type HeroSlide = {
  src: string
  alt: string
}

const SLIDE_EASE = [0.22, 1, 0.36, 1] as const

export function HeroV12Carousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0)
  const count = slides.length
  const active = slides[index] ?? slides[0]

  useEffect(() => {
    if (count <= 1) return

    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % count)
    }, AUTOPLAY_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [index, count])

  if (!active || count === 0) {
    return null
  }

  function goPrev() {
    setIndex((current) => (current - 1 + count) % count)
  }

  function goNext() {
    setIndex((current) => (current + 1) % count)
  }

  return (
    <MotionConfig reducedMotion="user">
      <section className="bg-background py-4 text-foreground md:py-6 lg:py-8">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="max-w-4xl text-4xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            {headline}
          </h1>

          <Card className="mt-8 gap-0 overflow-hidden rounded-2xl bg-foreground py-0 text-background ring-0 sm:mt-10">
            <div className="grid lg:grid-cols-5 lg:items-stretch">
              <div className="flex flex-col justify-center p-8 sm:p-10 lg:col-span-2 lg:p-12">
                <h2 className="text-3xl font-medium leading-[1.15] tracking-[-0.03em] sm:text-4xl">
                  {title}
                </h2>
                <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-background/75 sm:text-base">
                  {body}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    asChild
                    variant="default"
                    size="lg"
                    className="rounded-full bg-background text-foreground hover:bg-background/90"
                  >
                    <Link href={primaryCta.href}>{primaryCta.label}</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-full border-background/25 bg-transparent text-background hover:bg-background/10 hover:text-background"
                  >
                    <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                  </Button>
                </div>
              </div>

              <div className="relative min-h-90 w-full overflow-hidden lg:col-span-3 sm:min-h-110 lg:min-h-140">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={active.src}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.985 }}
                    transition={{
                      duration: 0.7,
                      ease: SLIDE_EASE,
                    }}
                  >
                    <Image
                      src={active.src}
                      unoptimized
                      alt=""
                      fill
                      aria-hidden
                      className="scale-125 object-cover object-center blur-2xl"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    <Image
                      src={active.src}
                      unoptimized
                      alt={active.alt}
                      fill
                      className="object-contain object-center"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      preload={index === 0}
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-x-0 bottom-0 z-10 flex justify-end gap-2 p-5 sm:p-6">
                  <Button
                    type="button"
                    variant="default"
                    size="icon"
                    className="rounded-full bg-background text-foreground hover:bg-background/90"
                    aria-label="Previous image"
                    onClick={goPrev}
                  >
                    <ChevronLeftIcon />
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    size="icon"
                    className="rounded-full bg-background text-foreground hover:bg-background/90"
                    aria-label="Next image"
                    onClick={goNext}
                  >
                    <ChevronRightIcon />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </MotionConfig>
  )
}
