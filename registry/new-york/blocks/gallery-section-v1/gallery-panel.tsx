"use client"

import Image from "next/image"
import { forwardRef, memo } from "react"

import type { GalleryItem } from "./config"

type GalleryPanelProps = {
  item: GalleryItem
  index: number
  isActive: boolean
  onActivate: (index: number) => void
}

const GalleryPanel = memo(
  forwardRef<HTMLDivElement, GalleryPanelProps>(function GalleryPanel(
    { item, index, isActive, onActivate },
    ref,
  ) {
    return (
      <div
        ref={ref}
        aria-label={item.label}
        className={`gsv1-panel group relative min-w-12 shrink-0 overflow-hidden bg-muted outline-none md:min-w-0${isActive ? " gsv1-panel--active" : ""}`}
        role="listitem"
        tabIndex={0}
        onFocus={() => onActivate(index)}
        onMouseEnter={() => onActivate(index)}
      >
        <Image
          alt={item.alt}
          className={`object-cover will-change-transform transition-transform duration-680 ease-[var(--gsv1-ease)]${isActive ? " scale-105" : " scale-100"}`}
          fill
          loading={index <= 2 || isActive ? "eager" : "lazy"}
          sizes="(max-width: 768px) 12vw, 6vw"
          src={item.imageSrc}
          unoptimized
        />

        {/* Caption — fades up when the panel is active */}
        <div aria-hidden className="gsv1-caption">
          {item.alt}
        </div>
      </div>
    )
  }),
)

export default GalleryPanel
