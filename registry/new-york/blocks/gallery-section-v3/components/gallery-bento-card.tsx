"use client"

import { useState } from "react"
import Image from "next/image"

import type { GalleryItem } from "../lib/config"

type GalleryBentoCardProps = {
  item: GalleryItem
  priority?: boolean
}

export function GalleryBentoCard({
  item,
  priority = false,
}: GalleryBentoCardProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <article className="group relative isolate overflow-hidden rounded-lg bg-muted">
      <Image
        src={item.imageSrc}
        alt={item.alt}
        fill
        unoptimized
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className={`object-cover transition-opacity duration-500${loaded ? " opacity-100" : " opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
      <div
        className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/75 via-black/25 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 md:p-5"
      >
        <h3 className="text-base font-medium tracking-tight text-white md:text-lg">
          {item.title}
        </h3>
        <p className="mt-1 text-sm leading-snug text-white/80">
          {item.description}
        </p>
        <p className="mt-2 font-mono text-sm text-white">{item.price}</p>
      </div>
    </article>
  )
}
