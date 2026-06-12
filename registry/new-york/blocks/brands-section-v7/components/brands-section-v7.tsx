import { cn } from "@/lib/utils"

import MarqueeRow from "./marquee-row"
import { rowOneBrands, rowTwoBrands } from "../lib/brands"
import { brandsSectionV7Content } from "../lib/config"

import "../styles/brands-section-v7.css"

type Props = {
  embedded?: boolean
}

export default function BrandsSectionV7({ embedded = false }: Props) {
  const { heading, subheading, footerLink } = brandsSectionV7Content

  return (
    <section
      className={cn(
        "w-full self-stretch",
        embedded ? "pt-12 md:pt-16" : "py-12 md:py-16 lg:py-20"
      )}
    >
      <div
        className={cn(
          "flex w-full flex-col items-center",
          embedded ? "gap-0" : "mx-auto max-w-4xl px-4"
        )}
      >
        <div className="flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="font-serif text-3xl leading-[1.15] tracking-[-0.02em] text-foreground sm:text-4xl lg:text-[2.75rem]">
            {heading}
          </h2>
          <p className="max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            {subheading}
          </p>
        </div>

        <div className="mt-10 flex w-full flex-col gap-4">
          <MarqueeRow brands={rowOneBrands} direction="left" />
          <MarqueeRow brands={rowTwoBrands} direction="right" offset />
        </div>

        <a
          href={footerLink.href}
          className="mt-8 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          {footerLink.label}
        </a>
      </div>
    </section>
  )
}
