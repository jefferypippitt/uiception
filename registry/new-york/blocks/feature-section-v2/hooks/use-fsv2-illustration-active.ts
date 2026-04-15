"use client"

import { useEffect, useRef, useState } from "react"

/** Pauses illustration timers when the panel is off-screen. */
export function useFsv2IllustrationActive() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => setActive(!!e?.isIntersecting),
      { rootMargin: "48px", threshold: 0.12 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return { ref, active }
}

export function useFsv2ReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  return reduced
}
