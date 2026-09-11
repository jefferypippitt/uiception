"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

import { createRenderer } from "./fluid/renderer"

type ProFluidShellProps = {
  children: (active: boolean) => ReactNode
  className?: string
}

/**
 * Self-contained WebGPU fluid card surface — same footprint as Free/Basic,
 * fluid fills the rounded rectangle with no muted overlay. Falls back to a
 * plain muted card when reduced-motion is set or init fails.
 */
export default function ProFluidShell({
  children,
  className,
}: ProFluidShellProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (reduceMotion) return

    const renderer = createRenderer({ canvas, inputTarget: root })
    void renderer.ready
      .then(() => {
        setActive(true)
      })
      .catch((error: unknown) => {
        console.error("[pricing-section-v4] fluid renderer failed", error)
        setActive(false)
      })

    return () => {
      renderer.dispose()
      setActive(false)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      data-fluid-active={active ? "" : undefined}
      className={[
        "relative flex min-h-72 flex-1 flex-col overflow-hidden rounded-2xl",
        active ? "bg-black" : "bg-muted",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className={[
          "pointer-events-none absolute inset-0 size-full touch-none transition-opacity duration-500",
          active ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
      <div className="relative z-10 flex min-h-72 flex-1 flex-col">
        {children(active)}
      </div>
    </div>
  )
}
