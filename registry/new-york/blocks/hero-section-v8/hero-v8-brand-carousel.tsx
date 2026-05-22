"use client"

import { useEffect, useState, type CSSProperties } from "react"

import { brands } from "../brands-section-v1/brands"
import {
  CAROUSEL_ENTER_ANIM_MS,
  CAROUSEL_EXIT_ANIM_MS,
  CAROUSEL_PAGE_SIZE,
  toCarouselColumn,
} from "./carousel-timing"
import { useBrandCarouselFlip } from "./use-brand-carousel-flip"
import HeroV8BrandCell from "./hero-v8-brand-cell"

const pages = [
  brands.slice(0, CAROUSEL_PAGE_SIZE),
  brands.slice(CAROUSEL_PAGE_SIZE, CAROUSEL_PAGE_SIZE * 2),
]

const carouselGridStyle = (): CSSProperties =>
  ({
    "--hero-v8-exit-duration": `${CAROUSEL_EXIT_ANIM_MS}ms`,
    "--hero-v8-enter-duration": `${CAROUSEL_ENTER_ANIM_MS}ms`,
  }) as CSSProperties

export default function HeroV8BrandCarousel() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")

    const sync = () => {
      setPrefersReducedMotion(mq.matches)
    }

    sync()
    mq.addEventListener("change", sync)

    return () => {
      mq.removeEventListener("change", sync)
    }
  }, [])

  const { pageIndex, columnPhases, columnsOnNextPage } = useBrandCarouselFlip({
    pageCount: pages.length,
    prefersReducedMotion,
  })

  const nextPageIndex = (pageIndex + 1) % pages.length
  const isFlipping = columnPhases.some((phase) => phase !== "idle")

  return (
    <div
      className="grid w-full min-w-0 grid-cols-3 bg-[color-mix(in_oklab,var(--muted)_28%,var(--background))]"
      role="list"
      aria-label="Company logos"
      aria-live="polite"
      data-flipping={isFlipping ? "true" : undefined}
      style={carouselGridStyle()}
    >
      {Array.from({ length: CAROUSEL_PAGE_SIZE }, (_, columnIndex) => {
        const column = toCarouselColumn(columnIndex)
        const outgoing = pages[pageIndex]?.[columnIndex]
        const incoming = pages[nextPageIndex]?.[columnIndex]
        const motionPhase = prefersReducedMotion
          ? "idle"
          : columnPhases[columnIndex]

        if (!outgoing || !incoming) {
          return null
        }

        return (
          <HeroV8BrandCell
            key={`column-${column}`}
            column={column}
            phase={motionPhase}
            outgoing={outgoing}
            incoming={incoming}
            showIncoming={columnsOnNextPage[columnIndex] ?? false}
          />
        )
      })}
    </div>
  )
}
