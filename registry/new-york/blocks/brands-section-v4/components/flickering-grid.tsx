"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

export type FlickeringGridProps = {
  className?: string
  squareSize?: number
  gridGap?: number
  color?: string
  maxOpacity?: number
  flickerChance?: number
  active?: boolean
  flickerFrameSkip?: number
  opacityLerp?: number
}

function parseRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h
  if (full.length !== 6) {
    return [96, 165, 250]
  }
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ]
}

type Dims = { w: number; h: number; cols: number; rows: number }

export function FlickeringGrid({
  className,
  squareSize = 4,
  gridGap = 6,
  color = "#60A5FA",
  maxOpacity = 0.45,
  flickerChance = 0.03,
  active = true,
  flickerFrameSkip = 10,
  opacityLerp = 0.05,
}: FlickeringGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentRef = useRef<number[]>([])
  const targetRef = useRef<number[]>([])
  const dimsRef = useRef<Dims>({ w: 1, h: 1, cols: 1, rows: 1 })
  const rafRef = useRef(0)
  const frameRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) {
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return
    }

    const [r, g, b] = parseRgb(color)
    const cell = squareSize + gridGap

    const syncDimensions = () => {
      const rect = container.getBoundingClientRect()
      const w = Math.max(1, Math.floor(rect.width))
      const h = Math.max(1, Math.floor(rect.height))
      const dpr = window.devicePixelRatio || 1
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cols = Math.max(1, Math.ceil(w / cell))
      const rows = Math.max(1, Math.ceil(h / cell))
      const len = cols * rows
      const prevC = currentRef.current
      const prevT = targetRef.current
      const nextC = new Array<number>(len)
      const nextT = new Array<number>(len)
      for (let i = 0; i < len; i++) {
        const c = prevC[i] ?? Math.random() * maxOpacity * 0.4
        const t = prevT[i] ?? c
        nextC[i] = c
        nextT[i] = t
      }
      currentRef.current = nextC
      targetRef.current = nextT
      dimsRef.current = { w, h, cols, rows }
    }

    const tick = () => {
      if (!active) {
        return
      }

      const { w, h, cols, rows } = dimsRef.current
      const current = currentRef.current
      const target = targetRef.current

      frameRef.current += 1
      if (frameRef.current % flickerFrameSkip === 0) {
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const idx = row * cols + col
            if (idx >= target.length) {
              continue
            }
            if (Math.random() < flickerChance) {
              target[idx] = Math.random() * maxOpacity
            }
          }
        }
      }

      ctx.clearRect(0, 0, w, h)

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col
          if (idx >= current.length) {
            continue
          }
          const t = target[idx]
          const c = current[idx]
          current[idx] = c + (t - c) * opacityLerp
          const o = current[idx]
          const x = col * cell + gridGap / 2
          const y = row * cell + gridGap / 2
          ctx.fillStyle = `rgba(${r},${g},${b},${o})`
          ctx.fillRect(x, y, squareSize, squareSize)
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    const ro = new ResizeObserver(() => {
      syncDimensions()
    })
    ro.observe(container)
    syncDimensions()

    if (active) {
      rafRef.current = requestAnimationFrame(tick)
    }

    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [
    active,
    color,
    squareSize,
    gridGap,
    maxOpacity,
    flickerChance,
    flickerFrameSkip,
    opacityLerp,
  ])

  return (
    <div ref={containerRef} className={cn("relative h-full min-h-px w-full min-w-px", className)}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 block h-full w-full"
        aria-hidden
      />
    </div>
  )
}
