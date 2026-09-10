"use client"

import { useEffect, useRef } from "react"

import { createRenderer } from "./black-hole/renderer"

/**
 * Optimized Black Hole (vgpu). Mount inside a sized ancestor (layout uses
 * `fixed inset-0`). Skips WebGPU when the user prefers reduced motion or
 * when init fails — the page stays black either way.
 */
export function BlackHole() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (reduceMotion) return

    const renderer = createRenderer({ canvas })
    void renderer.ready.catch((error: unknown) => {
      console.error("[black-hole] renderer failed", error)
    })

    return () => {
      renderer.dispose()
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="block h-full w-full touch-none" />
  )
}
