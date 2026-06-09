"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

import GalleryPanel from "./gallery-panel"
import type { GalleryItem } from "../lib/config"
import "../styles/gallery-track.css"

type GalleryTrackProps = {
  items: GalleryItem[]
}

export default function GalleryTrack({ items }: GalleryTrackProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [coarsePointer, setCoarsePointer] = useState(false)

  const trackRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeIndexRef = useRef(activeIndex)
  const topLineRef = useRef<HTMLDivElement>(null)
  const bottomLineRef = useRef<HTMLDivElement>(null)
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
      if (!topLineRef.current || !bottomLineRef.current) return

      const panelRect = currentPanel.getBoundingClientRect()
      const trackRect = currentTrack.getBoundingClientRect()
      const canvasRect = currentCanvas.getBoundingClientRect()
      const left = panelRect.left + panelRect.width / 2 - canvasRect.left

      topLineRef.current.style.transform = `translateX(${left}px)`
      topLineRef.current.style.height = `${trackRect.top - canvasRect.top}px`
      bottomLineRef.current.style.transform = `translateX(${left}px)`
      bottomLineRef.current.style.top = `${trackRect.bottom - canvasRect.top}px`
      bottomLineRef.current.style.height = `${canvasRect.bottom - trackRect.bottom}px`
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

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      window.removeEventListener("resize", scheduleLines)
    }
  }, [])

  useEffect(() => {
    scheduleLinesRef.current()
  }, [activeIndex])

  return (
    <div className="gsv1-root relative w-full">
      <div ref={canvasRef} className="gsv1-canvas">
        <div
          ref={topLineRef}
          aria-hidden
          className="gsv1-vline gsv1-vline--top"
          style={{ top: 0 }}
        />
        <div
          ref={bottomLineRef}
          aria-hidden
          className="gsv1-vline gsv1-vline--bottom"
        />
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
              priority={index === 0}
              onActivate={handleActivate}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
