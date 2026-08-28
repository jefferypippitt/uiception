"use client"

import { useCallback, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import {
  LifelineLightbox,
  type LifelineLightboxStart,
} from "./lifeline-lightbox"
import type { LifelineEventImage } from "./types"

export function LifelineInlineStill({
  image,
  className,
}: {
  image: LifelineEventImage
  className?: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [lightboxStart, setLightboxStart] =
    useState<LifelineLightboxStart | null>(null)

  const measure = useCallback((): LifelineLightboxStart | null => {
    const el = cardRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    return {
      cx: rect.left + rect.width / 2,
      cy: rect.top + rect.height / 2,
      w: el.offsetWidth,
      h: el.offsetHeight,
    }
  }, [])

  return (
    <>
      <div
        ref={cardRef}
        data-lifeline-interactive=""
        className={cn(
          "relative mt-3 w-full max-w-[200px] cursor-zoom-in overflow-hidden rounded-xl shadow-lg ring-1 ring-black/10 dark:ring-black/40",
          lightboxStart && "invisible",
          className,
        )}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation()
          if (!lightboxStart) setLightboxStart(measure())
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          alt={image.alt}
          className="block aspect-video w-full object-cover"
        />
      </div>
      {lightboxStart && (
        <LifelineLightbox
          photo={image}
          rotate={0}
          start={lightboxStart}
          getHome={measure}
          onClosed={() => setLightboxStart(null)}
        />
      )}
    </>
  )
}
