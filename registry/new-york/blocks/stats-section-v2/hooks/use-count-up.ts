import { useEffect, useRef, useState } from "react"

export function useCountUp(target: number, duration = 700) {
  const [state, setState] = useState({ value: target, blur: 0 })
  const fromRef = useRef(target)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const from = fromRef.current
    if (from === target) return

    const startTime = performance.now()
    const MAX_BLUR = 6

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)

      const blur = t < 1 ? MAX_BLUR * Math.pow(1 - t, 2) : 0

      setState({
        value: Math.round(from + (target - from) * eased),
        blur,
      })

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = target
      }
    }

    if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration])

  return state
}
