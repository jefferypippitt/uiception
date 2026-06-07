"use client"

import Image from "next/image"
import { forwardRef, memo } from "react"

import type { GalleryItem } from "../lib/config"

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
        className={`gsv1-panel group relative min-w-12 shrink-0 overflow-hidden outline-none md:min-w-0${isActive ? " gsv1-panel--active" : ""}`}
        role="listitem"
        tabIndex={0}
        onFocus={() => onActivate(index)}
        onMouseEnter={() => onActivate(index)}
      >
        <Image
          alt={item.alt}
          className={`object-cover transition-[transform,scale] duration-680 ease-[var(--gsv1-ease)]${isActive ? " scale-105" : " scale-100"}`}
          fill
          loading="lazy"
          sizes="(max-width: 1023px) 100vw, 75vw"
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
