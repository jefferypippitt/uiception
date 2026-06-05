import Image from "next/image"

import type { GalleryItem } from "../lib/config"

type GalleryCardProps = {
  item: GalleryItem
  priority?: boolean
}

export function GalleryCard({ item, priority = false }: GalleryCardProps) {
  return (
    <div className="group">
      <div className="aspect-4/3 overflow-hidden">
        <Image
          src={item.imageSrc}
          alt={item.alt}
          className="h-full w-full rounded-none object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
          width={600}
          height={450}
          priority={priority}
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
