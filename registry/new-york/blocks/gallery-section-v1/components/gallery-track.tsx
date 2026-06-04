"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

import GalleryPanel from "./gallery-panel"
import type { GalleryItem } from "../lib/config"
import "../styles/gallery-track.css"

type GalleryTrackProps = {
  items: GalleryItem[]
}

type VLineStyle = {
  centerX: number
  top: number
  topHeight: number
  bottomTop: number
  bottomHeight: number
}

function GalleryVLines({ style }: { style: VLineStyle | null }) {
  if (!style) return null

  return (
    <>
      <div
        aria-hidden
        className="gsv1-vline gsv1-vline--top"
        style={{
          transform: `translateX(${style.centerX}px)`,
          top: `${style.top}px`,
          height: `${style.topHeight}px`,
        }}
      />
      <div
        aria-hidden
        className="gsv1-vline gsv1-vline--bottom"
        style={{
          transform: `translateX(${style.centerX}px)`,
          top: `${style.bottomTop}px`,
          height: `${style.bottomHeight}px`,
        }}
      />
    </>
  )
}

export default function GalleryTrack({ items }: GalleryTrackProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [coarsePointer, setCoarsePointer] = useState(false)
  const [vLineStyle, setVLineStyle] = useState<VLineStyle | null>(null)

  const trackRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeIndexRef = useRef(activeIndex)
  const scheduleLinesRef = useRef<() => void>(() => {})

  useLayoutEffect(() => {
    activeIndexRef.current = activeIndex
  })

  useEffect(() => {
    const mq = window.matchMedia("(hover: none)")
    const update = () => setCoarsePointer(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const handleActivate = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const handleMouseLeave = () => {
    if (!coarsePointer) setActiveIndex(0)
  }

  const handleFocusOut = (event: React.FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget
    if (next instanceof Node && event.currentTarget.contains(next)) return
    setActiveIndex(0)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault()
      const next = (activeIndex + 1) % items.length
      setActiveIndex(next)
      panelRefs.current[next]?.focus()
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()
      const prev = (activeIndex - 1 + items.length) % items.length
      setActiveIndex(prev)
      panelRefs.current[prev]?.focus()
    }
  }

  useLayoutEffect(() => {
    const track = trackRef.current
    const canvas = canvasRef.current
    if (!track || !canvas) return

    let rafId = 0

    const commitLines = () => {
      const currentTrack = trackRef.current
      const currentCanvas = canvasRef.current
      const currentPanel = panelRefs.current[activeIndexRef.current]
      if (!currentTrack || !currentCanvas || !currentPanel) return

      const panelRect = currentPanel.getBoundingClientRect()
      const trackRect = currentTrack.getBoundingClientRect()
      const canvasRect = currentCanvas.getBoundingClientRect()
      const centerX = panelRect.left + panelRect.width / 2

      setVLineStyle({
        centerX,
        top: canvasRect.top,
        topHeight: trackRect.top - canvasRect.top,
        bottomTop: trackRect.bottom,
        bottomHeight: canvasRect.bottom - trackRect.bottom,
      })
    }

    const scheduleLines = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(commitLines)
    }

    scheduleLinesRef.current = scheduleLines

    commitLines()

    const observer = new ResizeObserver(scheduleLines)
    panelRefs.current.forEach((panel) => {
      if (panel) observer.observe(panel)
    })

    window.addEventListener("resize", scheduleLines, { passive: true })
    window.addEventListener("scroll", scheduleLines, { capture: true, passive: true })
    track.addEventListener("scroll", scheduleLines, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      window.removeEventListener("resize", scheduleLines)
      window.removeEventListener("scroll", scheduleLines, true)
      track.removeEventListener("scroll", scheduleLines)
    }
  }, [])

  useLayoutEffect(() => {
    scheduleLinesRef.current()
  }, [activeIndex])

  return (
    <div className="gsv1-root relative w-full">
      <div ref={canvasRef} className="gsv1-canvas">
        <GalleryVLines style={vLineStyle} />
        <div
          ref={trackRef}
          aria-label="Photo gallery — use arrow keys to navigate"
          className="gsv1-track flex h-96 w-full overflow-x-auto overflow-y-visible md:h-104 md:overflow-x-hidden"
          role="list"
          onBlurCapture={handleFocusOut}
          onKeyDown={handleKeyDown}
          onMouseLeave={handleMouseLeave}
        >
          {items.map((item, index) => (
            <GalleryPanel
              key={item.id}
              ref={(node) => {
                panelRefs.current[index] = node
              }}
              index={index}
              isActive={activeIndex === index}
              item={item}
              onActivate={handleActivate}
            />
          ))}
        </div>
      </div>

    </div>
  )
}
