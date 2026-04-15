"use client"

import { useEffect, useRef, useState } from "react"

/** Points on the line = active users in the window; headline = last point */
const SERIES_LEN = 22
const TICK_MS = 1000
const FLASH_MS = 400

/** ~50k band with room for visible swings */
const USER_MIN = 43_000
const USER_MAX = 58_000

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}

function formatCount(n: number): string {
  return Math.round(n).toLocaleString("en-US")
}

/** Start mid-40s → low-50s so the first frame already shows movement */
function seedSeries(): number[] {
  const lo = 47_800
  const hi = 51_200
  return Array.from({ length: SERIES_LEN }, (_, i) =>
    Math.round(lo + ((hi - lo) * i) / (SERIES_LEN - 1)),
  )
}

function eventsPerMinuteFromUsers(activeUsers: number): number {
  return Math.round(clamp(activeUsers * 0.38, 14_200, 25_800))
}

// ─────────────────────────────────────────────────────────────────────────────

export function useAnalyticsAnimation(active: boolean) {
  const [series, setSeries] = useState(seedSeries)
  const [flashUser, setFlashUser] = useState(false)

  const prevLatestRef = useRef(series[series.length - 1]!)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const latest = series[series.length - 1]!
  const windowAvg =
    series.reduce((acc, v) => acc + v, 0) / series.length
  /** Green when live count is at/above the dashed window average, red when below */
  const trend: "up" | "down" = latest >= windowAvg ? "up" : "down"

  const users = formatCount(latest)
  const events = formatCount(eventsPerMinuteFromUsers(latest))

  useEffect(() => {
    if (!active) return

    const id = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1]!
        // Steep slopes + frequent spikes (independent rolls so some ticks stack)
        let delta = Math.round(-1_050 + Math.random() * 2_100)
        if (Math.random() < 0.32) {
          delta += Math.round((Math.random() - 0.4) * 10_000)
        }
        if (Math.random() < 0.18) {
          delta += Math.round((Math.random() - 0.5) * 6_800)
        }
        if (Math.random() < 0.08) {
          delta += Math.round((Math.random() - 0.45) * 14_000)
        }
        const next = clamp(last + delta, USER_MIN, USER_MAX)
        return [...prev.slice(1), next]
      })
    }, TICK_MS)

    return () => clearInterval(id)
  }, [active])

  useEffect(() => {
    const l = series[series.length - 1]!
    if (l > prevLatestRef.current) {
      if (flashTimer.current) clearTimeout(flashTimer.current)
      setFlashUser(true)
      flashTimer.current = setTimeout(() => setFlashUser(false), FLASH_MS)
    }
    prevLatestRef.current = l
  }, [series])

  useEffect(
    () => () => {
      if (flashTimer.current) clearTimeout(flashTimer.current)
    },
    [],
  )

  return {
    chartData: series,
    users,
    events,
    flashUser,
    trend,
  }
}
