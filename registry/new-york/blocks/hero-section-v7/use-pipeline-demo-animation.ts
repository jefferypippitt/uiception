"use client"

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react"
import gsap from "gsap"

import { DELIVERY_EXAMPLES, type PipelineStage } from "./pipeline-config"

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
  mq.addEventListener("change", onStoreChange)
  return () => mq.removeEventListener("change", onStoreChange)
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function getReducedMotionServer() {
  return false
}

const TIMING = {
  startDelay: 0.4,
  stageHold: 0.55,
  lineFill: 0.65,
  deliverPause: 0.15,
  betweenExamples: 0.85,
  resizeDebounce: 0.15,
} as const

export function usePipelineDemoAnimation() {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer
  )
  const lineARef = useRef<HTMLDivElement>(null)
  const lineBRef = useRef<HTMLDivElement>(null)
  const exampleIndexRef = useRef(0)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const delayedCallRef = useRef<gsap.core.Tween | null>(null)

  const [exampleIndex, setExampleIndex] = useState(0)
  const [stage, setStage] = useState<PipelineStage>("idle")
  const [activePlatforms, setActivePlatforms] = useState<string[]>([])

  const run = DELIVERY_EXAMPLES[exampleIndex]

  useLayoutEffect(() => {
    if (!reducedMotion) {
      return
    }

    const lineA = lineARef.current
    const lineB = lineBRef.current

    if (!lineA || !lineB) {
      return
    }

    gsap.set([lineA, lineB], { "--hero-v7-pipeline-line-progress": "100%" })
  }, [reducedMotion])

  useLayoutEffect(() => {
    if (reducedMotion) {
      return
    }

    const lineA = lineARef.current
    const lineB = lineBRef.current

    if (!lineA || !lineB) {
      return
    }

    let cancelled = false

    const stopAll = () => {
      timelineRef.current?.kill()
      timelineRef.current = null
      delayedCallRef.current?.kill()
      delayedCallRef.current = null
      gsap.killTweensOf([lineA, lineB])
    }

    const resetLines = () => {
      gsap.set([lineA, lineB], { "--hero-v7-pipeline-line-progress": "0%" })
    }

    const playExample = (index: number) => {
      if (cancelled) {
        return
      }

      stopAll()

      exampleIndexRef.current = index
      const current = DELIVERY_EXAMPLES[index]

      setExampleIndex(index)
      setStage("ingest")
      setActivePlatforms([])
      resetLines()

      const tl = gsap.timeline({
        onComplete: () => {
          if (cancelled) {
            return
          }
          const next = (index + 1) % DELIVERY_EXAMPLES.length
          delayedCallRef.current = gsap.delayedCall(
            TIMING.betweenExamples,
            () => playExample(next)
          )
        },
      })
      timelineRef.current = tl

      tl.call(() => setStage("ingest"))
        .to({}, { duration: TIMING.stageHold })
        .to(lineA, {
          "--hero-v7-pipeline-line-progress": "100%",
          duration: TIMING.lineFill,
          ease: "power2.out",
        })
        .call(() => setStage("transform"))
        .to({}, { duration: TIMING.stageHold })
        .to(lineB, {
          "--hero-v7-pipeline-line-progress": "100%",
          duration: TIMING.lineFill,
          ease: "power2.out",
        })
        .call(() => {
          setStage("deliver")
          setActivePlatforms([])
        })
        .to({}, { duration: TIMING.deliverPause })
        .call(() => setActivePlatforms(current.platforms))
        .to({}, { duration: TIMING.stageHold })
        .call(() => setStage("idle"))
    }

    delayedCallRef.current = gsap.delayedCall(TIMING.startDelay, () =>
      playExample(exampleIndexRef.current)
    )

    const onResize = () => {
      stopAll()
      delayedCallRef.current = gsap.delayedCall(TIMING.resizeDebounce, () =>
        playExample(exampleIndexRef.current)
      )
    }

    window.addEventListener("resize", onResize)

    return () => {
      cancelled = true
      stopAll()
      window.removeEventListener("resize", onResize)
    }
  }, [reducedMotion])

  if (reducedMotion) {
    return {
      run: DELIVERY_EXAMPLES[0],
      stage: "idle" as const,
      activePlatforms: DELIVERY_EXAMPLES[0].platforms,
      lineARef,
      lineBRef,
    }
  }

  return {
    run,
    stage,
    activePlatforms,
    lineARef,
    lineBRef,
  }
}
