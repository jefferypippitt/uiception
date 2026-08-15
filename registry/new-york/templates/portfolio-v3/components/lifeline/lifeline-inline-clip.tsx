"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  LifelineLightbox,
  type LifelineLightboxStart,
} from "./lifeline-lightbox"
import type { LifelineEventClip } from "./types"

export function LifelineInlineClip({
  clip,
  className,
}: {
  clip: LifelineEventClip
  className?: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [lightboxStart, setLightboxStart] =
    useState<LifelineLightboxStart | null>(null)

  useEffect(() => {
    const root = cardRef.current
    const video = videoRef.current
    if (!root || !video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) video.preload = "auto"
      },
      { rootMargin: "80px" },
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

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
          "relative mt-3 w-full max-w-[200px] cursor-zoom-in overflow-hidden rounded-xl shadow-lg ring-1 ring-black/10 dark:ring-white/15",
          lightboxStart && "invisible",
          className,
        )}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation()
          if (!lightboxStart) setLightboxStart(measure())
        }}
      >
        <video
          ref={videoRef}
          src={clip.src}
          playsInline
          preload="metadata"
          aria-label={clip.alt}
          className="block aspect-video w-full bg-black object-cover"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black shadow">
            <Play className="h-3.5 w-3.5 translate-x-px" fill="currentColor" />
          </span>
        </div>
      </div>
      {lightboxStart && (
        <LifelineLightbox
          clip={clip}
          rotate={0}
          start={lightboxStart}
          getHome={measure}
          onClosed={() => setLightboxStart(null)}
        />
      )}
    </>
  )
}
