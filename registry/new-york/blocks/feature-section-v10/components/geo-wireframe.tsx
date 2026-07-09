"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

import type { FeatureIconId } from "../lib/features"
import { featureIllustrationViewBoxes } from "../lib/features"
import { useGeoMorph } from "../hooks/use-geo-morph"
import {
  projectVerticesInto,
  unifiedMesh,
  type ProjectedPoint,
  type Vec3,
} from "../lib/geo-mesh"

import "../styles/feature-section-v10.css"

type GeoWireframeProps = {
  icon: FeatureIconId
  active?: boolean
  className?: string
}

const NODE_COUNT = unifiedMesh.vertices.length
const EDGE_COUNT = unifiedMesh.edges.length

function MeshScene({
  active,
  morphingRef,
  filterId,
  verticesRef,
}: {
  active: boolean
  morphingRef: RefObject<boolean>
  filterId: string
  verticesRef: RefObject<Vec3[]>
}) {
  const reduceMotion = useReducedMotion()
  const groupRef = useRef<SVGGElement | null>(null)
  const lineRefs = useRef<(SVGLineElement | null)[]>([])
  const bokehRefs = useRef<(SVGCircleElement | null)[]>([])
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([])

  useEffect(() => {
    const projected: ProjectedPoint[] = []

    let raf = 0
    let rotation = 0
    let lastStrokeWidth = -1
    let lastOpacityScale = -1

    const render = (rotation: number) => {
      projectVerticesInto(verticesRef.current, rotation, projected)
      const morphingNow = morphingRef.current

      // Soften edges while morphing — depth opacity alone is enough for
      // layering; avoid reordering ~1k SVG nodes (that was the main hitch).
      const strokeWidth = morphingNow ? 1.25 : 1.35
      const opacityScale = morphingNow ? 0.82 : 1
      const strokeChanged =
        strokeWidth !== lastStrokeWidth || opacityScale !== lastOpacityScale
      lastStrokeWidth = strokeWidth
      lastOpacityScale = opacityScale

      for (let index = 0; index < EDGE_COUNT; index++) {
        const [start, end] = unifiedMesh.edges[index]!
        const a = projected[start]!
        const b = projected[end]!
        const el = lineRefs.current[index]
        if (!el) continue

        const depth = (a.z + b.z) / 2
        const opacity = (0.48 + ((depth + 120) / 240) * 0.42) * opacityScale

        el.setAttribute("x1", String(a.x))
        el.setAttribute("y1", String(a.y))
        el.setAttribute("x2", String(b.x))
        el.setAttribute("y2", String(b.y))
        el.setAttribute("stroke-opacity", String(opacity))
        if (strokeChanged) {
          el.setAttribute("stroke-width", String(strokeWidth))
        }
      }

      for (let index = 0; index < projected.length; index++) {
        const node = projected[index]!
        const depthNorm = (node.z + 110) / 220

        const bokeh = bokehRefs.current[index]
        if (bokeh) {
          bokeh.setAttribute("cx", String(node.x))
          bokeh.setAttribute("cy", String(node.y))
          bokeh.setAttribute("r", String(2.5 + depthNorm * 5))
          bokeh.setAttribute("fill-opacity", String(0.02 + depthNorm * 0.06))
        }

        const core = nodeRefs.current[index]
        if (core) {
          core.setAttribute("cx", String(node.x))
          core.setAttribute("cy", String(node.y))
          core.setAttribute("r", String(1.5 + depthNorm * 1.8))
          core.setAttribute("fill-opacity", String(0.78 + depthNorm * 0.22))
        }
      }
    }

    if (!active || reduceMotion) {
      render(reduceMotion ? 0.55 : 0)
      return
    }

    let lastTime = 0

    const tick = (time: number) => {
      if (!lastTime) lastTime = time
      // Clamp so a background-tab resume does not jump a huge rotation step.
      const delta = Math.min((time - lastTime) / 1000, 0.064)
      lastTime = time
      // Keep spin nearly constant during morph — a big speed jump reads as
      // a glitch when cards change quickly.
      const spinBoost = morphingRef.current ? 0.42 : 0.35
      rotation += delta * spinBoost
      render(rotation)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, reduceMotion, verticesRef, morphingRef])

  return (
    <g ref={groupRef} className="fsv10-geo__scene">
      {unifiedMesh.edges.map((_, index) => (
        <line
          key={`edge-${index}`}
          ref={(el) => {
            lineRefs.current[index] = el
          }}
          className="fsv10-geo__edge"
          stroke="currentColor"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {Array.from({ length: NODE_COUNT }, (_, index) => (
        <circle
          key={`bokeh-${index}`}
          ref={(el) => {
            bokehRefs.current[index] = el
          }}
          fill="currentColor"
          filter={`url(#${filterId}-blur)`}
        />
      ))}

      {Array.from({ length: NODE_COUNT }, (_, index) => (
        <circle
          key={`node-${index}`}
          ref={(el) => {
            nodeRefs.current[index] = el
          }}
          className="fsv10-geo__node"
          fill="currentColor"
          style={{ animationDelay: `${(index % 12) * 45}ms` }}
        />
      ))}
    </g>
  )
}

export default function GeoWireframe({ icon, active = false, className }: GeoWireframeProps) {
  const filterId = "fsv10-geo-morph"
  const svgRef = useRef<SVGSVGElement | null>(null)

  const onMorphingChange = (morphing: boolean) => {
    svgRef.current?.classList.toggle("fsv10-geo--morphing", morphing)
  }

  const { verticesRef, morphingRef } = useGeoMorph(icon, { onMorphingChange })

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className={cn(
        "relative h-full min-h-full w-full overflow-hidden text-foreground",
        className
      )}
    >
      <svg
        ref={svgRef}
        aria-hidden
        viewBox={featureIllustrationViewBoxes[icon]}
        preserveAspectRatio="xMidYMid meet"
        className={cn("block h-full min-h-full w-full", active && "fsv10-geo--active")}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={`${filterId}-blur`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.25" />
          </filter>
        </defs>

        {mounted && (
          <MeshScene
            active={active}
            morphingRef={morphingRef}
            filterId={filterId}
            verticesRef={verticesRef}
          />
        )}
      </svg>
    </div>
  )
}
