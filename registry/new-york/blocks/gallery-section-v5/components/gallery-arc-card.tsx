import type { CSSProperties } from "react"
import Image from "next/image"

import type { GalleryItem } from "../lib/config"

type GalleryArcCardProps = {
  item: GalleryItem
  angle: number
  /** Repeated copies are decorative — only the first pass is announced. */
  decorative?: boolean
  priority?: boolean
}

export function GalleryArcCard({
  item,
  angle,
  decorative = false,
  priority = false,
}: GalleryArcCardProps) {
  return (
    <li
      className="gsv5-card"
      style={{ "--gsv5-angle": `${angle}deg` } as CSSProperties}
      aria-hidden={decorative || undefined}
    >
      <div className="relative size-full overflow-hidden rounded-2xl bg-muted shadow-xl shadow-foreground/10 ring-1 ring-border transition-transform duration-500 ease-out hover:scale-105">
        <Image
          src={item.imageSrc}
          alt={decorative ? "" : item.alt}
          fill
          unoptimized
          priority={priority}
          sizes="13rem"
          className="object-cover"
        />
      </div>
    </li>
  )
}
