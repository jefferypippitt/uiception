"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "motion/react"
import gsap from "gsap"

import type { FeatureIconId } from "../lib/features"
import { getShapeVertices, lerpVec3Into, type Vec3 } from "../lib/geo-mesh"

/** Snappy enough to interrupt, long enough to read as a morph. */
const MORPH_DURATION = 0.65

function cloneVertices(vertices: readonly Vec3[]): Vec3[] {
  return vertices.map((vertex) => [vertex[0], vertex[1], vertex[2]] as Vec3)
}

function copyVerticesInto(target: Vec3[], source: readonly Vec3[]) {
  for (let i = 0; i < source.length; i++) {
    const src = source[i]!
    const dst = target[i]
    if (dst) {
      ;(dst as [number, number, number])[0] = src[0]
      ;(dst as [number, number, number])[1] = src[1]
      ;(dst as [number, number, number])[2] = src[2]
    } else {
      target[i] = [src[0], src[1], src[2]]
    }
  }
  target.length = source.length
}

type UseGeoMorphOptions = {
  /** Imperative signal — avoid React state so morph start/end does not reconcile the SVG tree. */
  onMorphingChange?: (morphing: boolean) => void
}

/**
 * Interpolates vertices between shapes without putting the per-frame tween
 * value in React state — `verticesRef` is mutated in place on every GSAP
 * tick so callers can read it inside their own rAF loop.
 *
 * Retargeting always starts from the *current* vertex positions (even mid-
 * morph), so rapid card switches never snap or get stuck mid-lerp.
 */
export function useGeoMorph(
  targetIcon: FeatureIconId,
  { onMorphingChange }: UseGeoMorphOptions = {}
) {
  const reduceMotion = useReducedMotion()
  const verticesRef = useRef<Vec3[]>(cloneVertices(getShapeVertices(targetIcon)))
  const morphingRef = useRef(false)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  /** Last shape that fully completed a morph. */
  const settledIconRef = useRef(targetIcon)
  /** Shape the active tween is heading toward (may differ from settled). */
  const aimIconRef = useRef(targetIcon)
  const onMorphingChangeRef = useRef(onMorphingChange)

  useEffect(() => {
    onMorphingChangeRef.current = onMorphingChange
  }, [onMorphingChange])

  const setMorphing = (next: boolean) => {
    if (morphingRef.current === next) return
    morphingRef.current = next
    onMorphingChangeRef.current?.(next)
  }

  useEffect(() => {
    const targetVertices = getShapeVertices(targetIcon)

    if (reduceMotion) {
      tweenRef.current?.kill()
      tweenRef.current = null
      copyVerticesInto(verticesRef.current, targetVertices)
      settledIconRef.current = targetIcon
      aimIconRef.current = targetIcon
      setMorphing(false)
      return
    }

    // Already tweening toward this target — do not restart.
    if (targetIcon === aimIconRef.current && tweenRef.current) return

    // Fully settled on this target.
    if (targetIcon === settledIconRef.current && !tweenRef.current) return

    // Interrupt in-flight morph and retarget from wherever vertices are now.
    tweenRef.current?.kill()
    aimIconRef.current = targetIcon

    const startVertices = cloneVertices(verticesRef.current)
    const proxy = { t: 0 }
    setMorphing(true)

    tweenRef.current = gsap.to(proxy, {
      t: 1,
      duration: MORPH_DURATION,
      ease: "power2.inOut",
      onUpdate: () => {
        const current = verticesRef.current
        for (let i = 0; i < current.length; i++) {
          lerpVec3Into(current[i]!, startVertices[i]!, targetVertices[i]!, proxy.t)
        }
      },
      onComplete: () => {
        copyVerticesInto(verticesRef.current, targetVertices)
        settledIconRef.current = targetIcon
        tweenRef.current = null
        setMorphing(false)
      },
    })
  }, [targetIcon, reduceMotion])

  useEffect(() => {
    return () => {
      tweenRef.current?.kill()
      tweenRef.current = null
    }
  }, [])

  return { verticesRef, morphingRef }
}

export { MORPH_DURATION }
