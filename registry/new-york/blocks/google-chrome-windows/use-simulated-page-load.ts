"use client"

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"

export type PageLoadPhase = "idle" | "loading" | "loaded"

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

/** Chrome-like load curve: fast start, slow crawl, quick finish. */
function chromeLoadProgress(elapsedMs: number): number {
  if (elapsedMs < 350) {
    return (elapsedMs / 350) * 68
  }
  if (elapsedMs < 1400) {
    const t = (elapsedMs - 350) / 1050
    return 68 + t * 22
  }
  if (elapsedMs < 1650) {
    const t = (elapsedMs - 1400) / 250
    return 90 + t * 10
  }
  return 100
}

export function useSimulatedPageLoad() {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer,
  )
  const [phase, setPhase] = useState<PageLoadPhase>("idle")
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number>(0)

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setPhase("idle")
    setProgress(0)
  }, [])

  const startLoading = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    if (reducedMotion) {
      setPhase("loaded")
      setProgress(100)
      return
    }
    setPhase("loading")
    setProgress(0)
    startRef.current = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startRef.current
      const next = chromeLoadProgress(elapsed)
      setProgress(next)
      if (next >= 100) {
        setPhase("loaded")
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [reducedMotion])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  useEffect(() => {
    if (reducedMotion) startLoading()
  }, [reducedMotion, startLoading])

  return { phase, progress, startLoading, reset }
}
