"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import type { LifelineEventClip, LifelineEventImage } from "./types"

const OPEN_MS = 520
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)"
const FIT = 0.85

interface Target {
  left: number
  top: number
  width: number
  height: number
}

export interface LifelineLightboxStart {
  cx: number
  cy: number
  w: number
  h: number
}

function homeRadius(home: LifelineLightboxStart, targetWidth: number) {
  const scale = home.w / targetWidth
  if (scale <= 0) return "var(--radius-xl)"
  return `calc(var(--radius-xl) / ${scale})`
}

function LightboxMedia({
  photo,
  clip,
  showControls,
}: {
  photo?: LifelineEventImage
  clip?: LifelineEventClip
  showControls: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!clip || !video) return
    video.muted = false
    void video.play().catch(() => {})
  }, [clip])

  if (clip) {
    return (
      <video
        ref={videoRef}
        src={clip.src}
        playsInline
        controls={showControls}
        autoPlay
        aria-label={clip.alt}
        className="block h-full w-full bg-black object-cover"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      />
    )
  }

  if (!photo) return null

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo.src}
      alt={photo.alt}
      className="block h-full w-full object-cover"
    />
  )
}

function computeTarget(start: LifelineLightboxStart): Target {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const aspect = start.h / start.w
  const width = Math.min(vw * FIT, (vh * FIT) / aspect)
  const height = width * aspect
  return { left: (vw - width) / 2, top: (vh - height) / 2, width, height }
}

export function LifelineLightbox({
  photo,
  clip,
  rotate,
  start,
  getHome,
  onClosed,
}: {
  photo?: LifelineEventImage
  clip?: LifelineEventClip
  rotate: number
  start: LifelineLightboxStart
  getHome: () => LifelineLightboxStart | null
  onClosed: () => void
}) {
  const [target] = useState<Target>(() => computeTarget(start))
  const { left, top, width, height } = target

  const figureRef = useRef<HTMLElement>(null)

  const [reduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  const toTransform = useCallback(
    (home: LifelineLightboxStart) =>
      `translate(${home.cx - (left + width / 2)}px, ${
        home.cy - (top + height / 2)
      }px) scale(${home.w / width}) rotate(${rotate}deg)`,
    [left, top, width, height, rotate],
  )

  const [entered, setEntered] = useState(reduceMotion)
  const [transform, setTransform] = useState(() =>
    reduceMotion ? "none" : toTransform(start),
  )
  const [borderRadius, setBorderRadius] = useState(() =>
    reduceMotion ? "var(--radius-xl)" : homeRadius(start, width),
  )
  const closing = useRef(false)

  useLayoutEffect(() => {
    if (reduceMotion) return
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        setEntered(true)
        setTransform("translate(0px, 0px) scale(1) rotate(0deg)")
        setBorderRadius("var(--radius-xl)")
      })
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [reduceMotion])

  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const block = (event: TouchEvent) => event.preventDefault()
    root.addEventListener("touchmove", block, { passive: false })
    return () => root.removeEventListener("touchmove", block)
  }, [])

  useEffect(() => {
    const swallow = (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
    }
    window.addEventListener("click", swallow, { capture: true, once: true })
    const timeout = window.setTimeout(() => {
      window.removeEventListener("click", swallow, { capture: true })
    }, 500)
    return () => {
      window.clearTimeout(timeout)
      window.removeEventListener("click", swallow, { capture: true })
    }
  }, [])

  const dismiss = useCallback(() => {
    if (closing.current) return
    closing.current = true
    if (reduceMotion) {
      onClosed()
      return
    }
    const home = getHome() ?? start
    setEntered(false)
    setTransform(toTransform(home))
    setBorderRadius(homeRadius(home, width))
    window.setTimeout(onClosed, OPEN_MS + 120)
  }, [reduceMotion, onClosed, toTransform, getHome, start, width])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [dismiss])

  return createPortal(
    <div
      ref={rootRef}
      className="fixed inset-0 z-[999] touch-none overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-label={photo?.alt ?? clip?.alt ?? "Media"}
      onPointerDown={(event) => event.stopPropagation()}
      onPointerMove={(event) => event.stopPropagation()}
      onPointerUp={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div
        className={cn(
          "absolute inset-0 cursor-zoom-out bg-black/60 transition-opacity",
          entered ? "opacity-100" : "opacity-0",
        )}
        style={{ transitionDuration: `${OPEN_MS}ms` }}
        onClick={dismiss}
      />
      <figure
        ref={figureRef}
        className={cn(
          "absolute overflow-hidden shadow-2xl ring-1 ring-black/20",
          clip ? "cursor-default" : "cursor-zoom-out",
        )}
        style={{
          left,
          top,
          width,
          height,
          transform,
          borderRadius,
          transformOrigin: "center",
          transition: reduceMotion
            ? undefined
            : `transform ${OPEN_MS}ms ${EASE}, border-radius ${OPEN_MS}ms ${EASE}`,
          willChange: "transform, border-radius",
        }}
        onClick={clip ? undefined : dismiss}
        onTransitionEnd={(event) => {
          if (event.propertyName !== "transform") return
          if (closing.current) onClosed()
        }}
      >
        <LightboxMedia photo={photo} clip={clip} showControls={entered} />
      </figure>
    </div>,
    document.body,
  )
}
