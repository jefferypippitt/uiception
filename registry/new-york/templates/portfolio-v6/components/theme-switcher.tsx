"use client"

import { useLayoutEffect, useRef, useSyncExternalStore } from "react"
import gsap from "gsap"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

gsap.registerPlugin(MorphSVGPlugin)

const emptySubscribe = () => () => {}

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false)
}

/** Lucide v1 moon — open crescent stroke. */
const MOON_PATH =
  "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"

/** Lucide sun disc (circle at 12,12 r=4) as a path MorphSVG can tween to. */
const SUN_DISC = "M12 8A4 4 0 1 0 12 16A4 4 0 1 0 12 8Z"

const SUN_RAYS = [
  [12, 2, 12, 4],
  [19.07, 4.93, 17.66, 6.34],
  [22, 12, 20, 12],
  [19.07, 19.07, 17.66, 17.66],
  [12, 22, 12, 20],
  [4.93, 19.07, 6.34, 17.66],
  [2, 12, 4, 12],
  [4.93, 4.93, 6.34, 6.34],
] as const

const MORPH = {
  duration: 0.5,
  ease: "power2.inOut",
} as const

export function ThemeSwitcher({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme()
  const mounted = useIsClient()
  const iconRef = useRef<SVGGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const raysRef = useRef<SVGGElement>(null)
  const nodeRef = useRef<SVGPathElement | null>(null)

  const isDark = resolvedTheme === "dark"

  useLayoutEffect(() => {
    const icon = iconRef.current
    const path = pathRef.current
    const rays = raysRef.current
    if (!icon || !path || !rays) return

    const toSun = resolvedTheme === "dark"
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isNewNode = nodeRef.current !== path
    nodeRef.current = path
    const instant = isNewNode || reduce

    if (instant) {
      gsap.set(path, { morphSVG: toSun ? SUN_DISC : MOON_PATH })
      gsap.set(rays, {
        scale: toSun ? 1 : 0,
        autoAlpha: toSun ? 1 : 0,
        svgOrigin: "12 12",
      })
      gsap.set(icon, { rotation: toSun ? 90 : 0, svgOrigin: "12 12" })
    } else {
      gsap.to(path, {
        morphSVG: { shape: toSun ? SUN_DISC : MOON_PATH, type: "rotational" },
        duration: MORPH.duration,
        ease: MORPH.ease,
        overwrite: "auto",
      })
      gsap.to(rays, {
        scale: toSun ? 1 : 0,
        autoAlpha: toSun ? 1 : 0,
        duration: toSun ? 0.38 : 0.28,
        delay: toSun ? 0.08 : 0,
        ease: toSun ? "power2.out" : "power2.in",
        svgOrigin: "12 12",
        overwrite: "auto",
      })
      gsap.to(icon, {
        rotation: toSun ? 90 : 0,
        duration: MORPH.duration,
        ease: MORPH.ease,
        svgOrigin: "12 12",
        overwrite: "auto",
      })
    }

    return () => {
      gsap.killTweensOf([path, rays, icon])
    }
  }, [mounted, resolvedTheme])

  if (!mounted) {
    return (
      <span className={cn("inline-block size-8", className)} aria-hidden="true" />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full p-0 text-muted-foreground transition-colors duration-300 hover:text-foreground",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="block size-4 overflow-visible"
        aria-hidden="true"
      >
        <g ref={iconRef}>
          <path ref={pathRef} d={MOON_PATH} />
          <g ref={raysRef}>
            {SUN_RAYS.map(([x1, y1, x2, y2]) => (
              <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
            ))}
          </g>
        </g>
      </svg>
    </button>
  )
}
