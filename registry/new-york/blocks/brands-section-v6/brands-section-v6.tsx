import { cn } from "@/lib/utils"

import Marquee from "./components/marquee"
import { brands } from "./lib/brands"

import "./styles/brands-section-v6.css"

type Props = {
  embedded?: boolean
}

export default function BrandsSectionV6({ embedded = false }: Props) {
  return (
    <section
      className={cn(
        "w-full self-stretch",
        embedded ? "pt-8 md:pt-10" : "py-10 md:py-14",
      )}
    >
      <div
        className={cn(
          "flex w-full flex-col gap-6 md:gap-8",
          embedded ? "items-start" : "items-center mx-auto max-w-6xl px-4",
        )}
      >
        <p
          className={cn(
            "font-mono text-sm uppercase tracking-wider text-muted-foreground sm:text-base",
            embedded ? "text-left" : "text-center",
          )}
        >
          Trusted by security teams at
        </p>
        <Marquee brands={brands} />
      </div>
    </section>
  )
}
