"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

function scrollToHash(): boolean {
  const raw = window.location.hash.slice(1)
  if (!raw) return true
  const id = decodeURIComponent(raw)
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior: "instant", block: "start" })
  return true
}

/**
 * next/navigation client navigations (including router.push with a hash) do not
 * reliably scroll to the fragment. Changelog badge links use view transitions +
 * router.push, so we align the viewport after mount and on hash changes.
 */
export function BlocksCategoryHashScroll() {
  const pathname = usePathname()

  useEffect(() => {
    let cancelled = false
    let raf = 0
    let frames = 0
    const maxFrames = 45

    const schedule = () => {
      if (cancelled) return
      if (scrollToHash()) return
      frames += 1
      if (frames >= maxFrames) return
      raf = requestAnimationFrame(schedule)
    }

    schedule()
    const t1 = window.setTimeout(() => {
      if (!cancelled) scrollToHash()
    }, 50)
    const t2 = window.setTimeout(() => {
      if (!cancelled) scrollToHash()
    }, 200)

    const onHashChange = () => scrollToHash()
    window.addEventListener("hashchange", onHashChange)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.removeEventListener("hashchange", onHashChange)
    }
  }, [pathname])

  return null
}
