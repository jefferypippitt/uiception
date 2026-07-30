"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { GrainGradient } from "@paper-design/shaders-react"

import type { GrainShaderTheme } from "../lib/testimonials-content"

type ShaderViewport = {
  width: number
  height: number
  dpr: number
  ready: boolean
}

const initialViewport: ShaderViewport = {
  width: 0,
  height: 0,
  dpr: 1,
  ready: false,
}

const DESIGN_FALLBACK = { width: 480, height: 720 } as const

function adaptShader(theme: GrainShaderTheme, viewport: ShaderViewport) {
  const designWidth = theme.designWidth ?? DESIGN_FALLBACK.width
  const designHeight = theme.designHeight ?? DESIGN_FALLBACK.height

  const width = Math.max(1, Math.round(viewport.width * viewport.dpr))
  const height = Math.max(1, Math.round(viewport.height * viewport.dpr))

  const sizeRatio = Math.min(
    viewport.width / designWidth,
    viewport.height / designHeight
  )

  return {
    colors: theme.colors,
    colorBack: theme.colorBack,
    softness: theme.softness,
    intensity: theme.intensity,
    noise: theme.noise,
    shape: theme.shape,
    speed: theme.speed,
    width,
    height,
    ...(theme.scale !== undefined
      ? { scale: theme.scale * sizeRatio }
      : {}),
  }
}

export function TestimonialShader({ theme }: { theme: GrainShaderTheme }) {
  const ref = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState<ShaderViewport>(initialViewport)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width < 1 || height < 1) return
      setViewport({
        width,
        height,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        ready: true,
      })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const renderProps = viewport.ready ? adaptShader(theme, viewport) : null

  return (
    <div
      ref={ref}
      className="ts4-shader-frame"
      style={{ backgroundColor: theme.accent }}
      aria-hidden
    >
      {renderProps ? (
        <GrainGradient
          className="ts4-shader-canvas"
          colors={[...renderProps.colors]}
          colorBack={theme.accent}
          fit="cover"
          height={renderProps.height}
          intensity={renderProps.intensity}
          noise={renderProps.noise}
          {...(renderProps.scale !== undefined
            ? { scale: renderProps.scale }
            : {})}
          shape={renderProps.shape}
          softness={renderProps.softness}
          speed={renderProps.speed}
          width={renderProps.width}
        />
      ) : null}
    </div>
  )
}
