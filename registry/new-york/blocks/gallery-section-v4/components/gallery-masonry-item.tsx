"use client"

import { useState } from "react"
import Image from "next/image"

import { useInView } from "../hooks/use-in-view"
import type { GalleryItem } from "../lib/config"

type GalleryMasonryItemProps = {
  item: GalleryItem
  priority?: boolean
}

export function GalleryMasonryItem({
  item,
  priority = false,
}: GalleryMasonryItemProps) {
  const [loaded, setLoaded] = useState(false)
  const [ref, inView] = useInView<HTMLDivElement>()
  const revealed = loaded && inView

  return (
    <div style={{ gridRowEnd: `span ${item.span}` }}>
      <div
        ref={ref}
        className="relative h-[calc(100%-1rem)] overflow-hidden rounded-lg bg-muted"
      >
        <Image
          src={item.imageSrc}
          alt={item.alt}
          fill
          unoptimized
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-[opacity,filter,translate] duration-500 ease-out${revealed ? " translate-y-0 opacity-100 blur-none" : " translate-y-6 opacity-0 blur-sm"}`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
      </div>
    </div>
  )
}
