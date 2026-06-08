"use client"

import { forwardRef, memo, useState } from "react"
import Image from "next/image"

import type { GalleryItem } from "../lib/config"

type GalleryPanelProps = {
  item: GalleryItem
  index: number
  isActive: boolean
  priority?: boolean
  onActivate: (index: number) => void
}

const GalleryPanel = memo(
  forwardRef<HTMLDivElement, GalleryPanelProps>(function GalleryPanel(
    { item, index, isActive, priority = false, onActivate },
    ref,
  ) {
    const [loaded, setLoaded] = useState(false)

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
          src={item.imageSrc}
          alt={item.alt}
          fill
          unoptimized
          priority={priority}
          sizes="(max-width: 768px) 20vw, 15vw"
          className={`object-cover transition-[transform,scale,opacity] duration-680 ease-[var(--gsv1-ease)]${isActive ? " scale-105" : " scale-100"}${loaded ? " opacity-100" : " opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />

        <div aria-hidden className="gsv1-caption">
          {item.alt}
        </div>
      </div>
    )
  }),
)

export default GalleryPanel
