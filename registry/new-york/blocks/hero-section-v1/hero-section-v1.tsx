import { GeistSans } from "geist/font/sans"
import { GeistPixelCircle } from "geist/font/pixel"
import { Button } from "@/components/ui/button"
import { blockImageUrl } from "@/lib/block-image-url"
import { cn } from "@/lib/utils"
import { ArrowUpRightIcon } from "lucide-react"

import BrandsSectionV1 from "./components/brands-section-v1"
import MacOsTerminal from "./components/mac-os-terminal"

export default function HeroSectionV1() {
  return (
    <>
      <section className="pt-16 md:pt-20 lg:pt-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
            <h1
              className={cn(
                GeistSans.className,
                "text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl",
              )}
            >
              Agents built{" "}
              <span className={`${GeistPixelCircle.className} font-normal tracking-normal`}>
                for coding
              </span>
            </h1>

            <div className="flex flex-col gap-6">
              <p
                className={cn(
                  GeistSans.className,
                  "text-lg leading-relaxed text-muted-foreground sm:text-xl",
                )}
              >
                Build and deploy AI coding agents with a single SDK. Get composable tools, intelligent model routing, and deep codebase context that works across any repository.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button className={GeistSans.className} variant="default" size="lg">
                  Start building
                  <ArrowUpRightIcon data-icon="inline-end" />
                </Button>
                <Button className={GeistSans.className} variant="outline" size="lg">
                  View docs
                  <ArrowUpRightIcon data-icon="inline-end" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BrandsSectionV1 />

      <section className="px-4 pb-16 md:pb-20 lg:pb-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl px-4 py-10 md:px-8 md:py-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blockImageUrl(
              "https://uiception.com/images/blocks/hero-section-v1/hero-section-v1-bg.png",
            )}
            alt=""
            className="pointer-events-none object-cover object-center absolute inset-0 w-full h-full"
            aria-hidden={true}
          />
          <div className="relative mx-auto max-w-2xl">
            <MacOsTerminal />
          </div>
        </div>
      </section>
    </>
  )
}
