"use client"

import { useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"

import { PIPELINE_RUNS } from "../lib/pipeline-config"

type Stage = "ingest" | "transform" | "deliver" | "idle"

const STAGE_HOLD_S = 0.55
const LINE_FILL_S = 0.65

export function usePipelineDemoAnimation() {
  const lineARef = useRef<HTMLDivElement>(null)
  const lineBRef = useRef<HTMLDivElement>(null)
  const runIndexRef = useRef(0)

  const [runIndex, setRunIndex] = useState(0)
  const [stage, setStage] = useState<Stage>("idle")
  const [activeDestinations, setActiveDestinations] = useState<string[]>([])

  const run = PIPELINE_RUNS[runIndex]

  useLayoutEffect(() => {
    const lineA = lineARef.current
    const lineB = lineBRef.current

    if (!lineA || !lineB) {
      return
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const initialRun = PIPELINE_RUNS[runIndexRef.current]

    if (reduced) {
      setStage("deliver")
      setActiveDestinations(initialRun.destinations)
      gsap.set([lineA, lineB], { "--hero-v7-pipeline-line-progress": "100%" })
      return
    }

    let cancelled = false

    const resetLines = () => {
      gsap.set([lineA, lineB], { "--hero-v7-pipeline-line-progress": "0%" })
    }

    const fillLine = (line: HTMLDivElement, duration: number) =>
      gsap.to(line, {
        "--hero-v7-pipeline-line-progress": "100%",
        duration,
        ease: "power2.out",
      })

    const runCycle = (index: number) => {
      if (cancelled) return

      runIndexRef.current = index
      const current = PIPELINE_RUNS[index]
      setRunIndex(index)
      setStage("ingest")
      setActiveDestinations([])
      resetLines()

      const tl = gsap.timeline({
        onComplete: () => {
          if (cancelled) return
          const next = (index + 1) % PIPELINE_RUNS.length
          gsap.delayedCall(0.85, () => runCycle(next))
        },
      })

      tl.call(() => setStage("ingest"))
        .to({}, { duration: STAGE_HOLD_S })
        .call(() => {
          setStage("transform")
          fillLine(lineA, LINE_FILL_S)
        })
        .to({}, { duration: LINE_FILL_S })
        .call(() => {
          setStage("deliver")
          fillLine(lineB, LINE_FILL_S)
          setActiveDestinations(current.destinations)
        })
        .to({}, { duration: LINE_FILL_S })
        .call(() => setStage("idle"))
    }

    const startDelay = gsap.delayedCall(0.4, () => runCycle(runIndexRef.current))

    const onResize = () => {
      gsap.killTweensOf([lineA, lineB])
      startDelay.kill()
      gsap.delayedCall(0.15, () => runCycle(runIndexRef.current))
    }

    window.addEventListener("resize", onResize)

    return () => {
      cancelled = true
      startDelay.kill()
      gsap.killTweensOf([lineA, lineB])
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return {
    run,
    stage,
    activeDestinations,
    lineARef,
    lineBRef,
  }
}
