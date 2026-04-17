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

const Fsv3IllustrationActiveContext = createContext(true)

/**
 * One viewport gate for the whole block, so all timers pause while off-screen.
 * Attach `ref` to the showcase list root.
 */
export function useFsv3IllustrationBlockGate() {
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

export function Fsv3IllustrationActiveProvider({
  active,
  children,
}: {
  active: boolean
  children: ReactNode
}) {
  return createElement(
    Fsv3IllustrationActiveContext.Provider,
    { value: active },
    children,
  )
}

export function useFsv3IllustrationActive() {
  return useContext(Fsv3IllustrationActiveContext)
}
