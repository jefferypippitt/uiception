"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { GrainGradient } from "@paper-design/shaders-react"

type ShaderViewport = {
  width: number
  height: number
  dpr: number
  ready: boolean
}

const initialViewport: ShaderViewport = { width: 0, height: 0, dpr: 1, ready: false }

const CTA_V4_SHADER = {
  colors: ["#c6750c", "#beae60", "#d7cbc6"] as const,
  colorBack: "#000a0f",
  softness: 0.7,
  intensity: 0.15,
  noise: 0.5,
  shape: "sphere" as const,
  speed: 4,
  offsetY: 0.45
} as const

function adaptShader(viewport: ShaderViewport) {
  const width = Math.max(1, Math.round(viewport.width * viewport.dpr))
  const height = Math.max(1, Math.round(viewport.height * viewport.dpr))
  return { width, height }
}

export function CtaSectionV4ShaderBg() {
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

  const render = viewport.ready ? adaptShader(viewport) : null

  return (
    <div
      ref={ref}
      className="cta-v4-shader-frame"
      style={{ backgroundColor: CTA_V4_SHADER.colorBack }}
      aria-hidden
    >
      {render ? (
        <GrainGradient
          className="cta-v4-shader-canvas"
          width={render.width}
          height={render.height}
          colors={[...CTA_V4_SHADER.colors]}
          colorBack={CTA_V4_SHADER.colorBack}
          softness={CTA_V4_SHADER.softness}
          intensity={CTA_V4_SHADER.intensity}
          noise={CTA_V4_SHADER.noise}
          shape={CTA_V4_SHADER.shape}
          speed={CTA_V4_SHADER.speed}
          offsetY={CTA_V4_SHADER.offsetY}
          fit="cover"
        />
      ) : null}
    </div>
  )
}
