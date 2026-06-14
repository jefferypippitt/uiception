import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import MarqueeColumn from "./marquee-column"
import { col1Brands, col2Brands, col3Brands, col4Brands } from "../lib/brands"
import { brandsSectionV8Content } from "../lib/config"

import "../styles/brands-section-v8.css"

type Props = {
  embedded?: boolean
}

export default function BrandsSectionV8({ embedded = false }: Props) {
  const { heading, subheading, cta } = brandsSectionV8Content

  return (
    <section
      className={cn(
        "w-full self-stretch",
        embedded ? "pt-12 md:pt-16" : "py-12 md:py-16 lg:py-20"
      )}
    >
      <div
        className={cn(
          "w-full",
          embedded
            ? "grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16"
            : "mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 lg:grid-cols-2 lg:gap-16"
        )}
      >
        {/* Left: copy + CTA */}
        <div className="flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl tracking-tighter text-foreground sm:text-4xl lg:text-5xl">
              {heading}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {subheading}
            </p>
          </div>
          <Button asChild className="self-start" size="lg">
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        </div>

        {/* Right: 4 vertical marquee columns */}
        <div className="flex gap-1 overflow-hidden">
          <MarqueeColumn brands={col1Brands} direction="up" />
          <MarqueeColumn brands={col2Brands} direction="down" />
          <MarqueeColumn brands={col3Brands} direction="up" />
          <MarqueeColumn brands={col4Brands} direction="down" />
        </div>
      </div>
    </section>
  )
}
