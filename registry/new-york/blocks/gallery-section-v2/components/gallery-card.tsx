import Image from "next/image"

import type { GalleryItem } from "../lib/config"

type GalleryCardProps = {
  item: GalleryItem
  index: number
}

export function GalleryCard({ item, index }: GalleryCardProps) {
  return (
    <div className="group">
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={item.imageSrc}
          alt={item.alt}
          className="rounded-none object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
          fill
          loading={index < 3 ? "eager" : "lazy"}
          sizes="(max-width: 1023px) 100vw, 33vw"
          unoptimized
        />
      </div>
      <div className="mt-3 font-mono">
        <p className="text-sm font-medium leading-tight">{item.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
      </div>
    </div>
  )
}
