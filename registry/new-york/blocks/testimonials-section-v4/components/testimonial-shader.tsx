"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
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

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduced(mql.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return reduced
}

export function TestimonialShader({ theme }: { theme: GrainShaderTheme }) {
  const ref = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState<ShaderViewport>(initialViewport)
  const [isVisible, setIsVisible] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

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
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(el)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "200px" }
    )
    intersectionObserver.observe(el)

    return () => {
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [])

  const shouldRender = viewport.ready && isVisible && !reducedMotion
  const renderProps = shouldRender ? adaptShader(theme, viewport) : null

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
