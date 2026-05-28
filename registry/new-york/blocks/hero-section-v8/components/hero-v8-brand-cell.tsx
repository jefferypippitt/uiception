"use client"

import type { Brand } from "../../brands-section-v1/lib/brands"
import BrandLogo from "../../brands-section-v1/components/brand-logo"
import type { ColumnMotionPhase } from "../hooks/use-brand-carousel-flip"
import type { CarouselColumn } from "../lib/carousel-timing"

const heroV8LogoClass =
  "size-full min-h-0 min-w-0 [&_svg]:h-full [&_svg]:w-full [&_svg]:object-contain"

type HeroV8BrandCellProps = {
  column: CarouselColumn
  phase: ColumnMotionPhase
  outgoing: Brand
  incoming: Brand
  showIncoming: boolean
}

export default function HeroV8BrandCell({
  column,
  phase,
  outgoing,
  incoming,
  showIncoming,
}: HeroV8BrandCellProps) {
  const isFlipping = phase === "exit" || phase === "enter"

  return (
    <div
      role="listitem"
      className="flex h-16 min-h-16 min-w-0 items-center justify-center overflow-hidden px-1.5 py-3 sm:h-20 sm:min-h-20 sm:px-2.5 sm:py-5 md:px-3"
      data-column={column}
    >
      <div className="relative mx-auto flex h-6 w-full min-w-0 max-w-36 items-center justify-center sm:h-7 md:h-8">
        {isFlipping ? (
          <>
            <div
              className="hero-v8-proof__layer absolute inset-0 flex items-center justify-center opacity-100"
              data-phase={phase === "exit" ? "exit" : "idle"}
              aria-hidden={phase === "enter"}
            >
              <BrandLogo brand={outgoing} className={heroV8LogoClass} />
            </div>
            <div
              className="hero-v8-proof__layer absolute inset-0 flex items-center justify-center"
              data-phase={phase === "enter" ? "enter" : "idle"}
              aria-hidden={phase === "exit"}
            >
              <BrandLogo brand={incoming} className={heroV8LogoClass} />
            </div>
          </>
        ) : (
          <div
            className="hero-v8-proof__layer blur-0 absolute inset-0 flex translate-x-0 translate-y-0 items-center justify-center opacity-100"
            data-phase="idle"
          >
            <BrandLogo
              brand={showIncoming ? incoming : outgoing}
              className={heroV8LogoClass}
            />
          </div>
        )}
      </div>
    </div>
  )
}
