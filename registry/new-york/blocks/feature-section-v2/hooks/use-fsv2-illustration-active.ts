"use client"

import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

const Fsv2IllustrationActiveContext = createContext(true)

/**
 * Single IntersectionObserver for the whole feature grid — timers pause when the block is off-screen.
 * Attach `ref` to the block’s `<ul>` from `components/feature-showcase.tsx`.
 */
export function useFsv2IllustrationBlockGate() {
  const ref = useRef<HTMLUListElement>(null)
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

export function Fsv2IllustrationActiveProvider({
  active,
  children,
}: {
  active: boolean
  children: ReactNode
}) {
  return createElement(
    Fsv2IllustrationActiveContext.Provider,
    { value: active },
    children,
  )
}

/** Active flag from {@link Fsv2IllustrationActiveProvider} (one gate per block). */
export function useFsv2IllustrationActive() {
  return useContext(Fsv2IllustrationActiveContext)
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
