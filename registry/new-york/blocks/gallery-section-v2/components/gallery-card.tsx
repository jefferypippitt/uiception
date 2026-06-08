"use client"

import { useState } from "react"
import Image from "next/image"

import type { GalleryItem } from "../lib/config"

type GalleryCardProps = { item: GalleryItem; priority?: boolean }

export function GalleryCard({ item, priority = false }: GalleryCardProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="group">
      <div className="relative isolate aspect-4/3 overflow-hidden">
        <Image
          src={item.imageSrc}
          alt={item.alt}
          fill
          unoptimized
          priority={priority}
          sizes="(max-width: 768px) 50vw, 33vw"
          className={`object-cover transition-opacity duration-500${loaded ? " opacity-100" : " opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
        {loaded && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[#808080] mix-blend-color transition-opacity duration-500 group-hover:opacity-0"
          />
        )}
      </div>
      <div className="mt-3 font-mono">
        <p className="text-sm font-medium leading-tight">{item.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
      </div>
    </div>
  )
}
