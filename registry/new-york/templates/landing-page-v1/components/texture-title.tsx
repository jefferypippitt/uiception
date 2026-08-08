"use client"

import { useRef, useSyncExternalStore, type ReactNode } from "react"

const MAIN_FILTER_ID = "lp1-ink-main"
const GHOST_FILTER_ID = "lp1-ink-ghost"

const MAIN_SCALE = { rest: "4", boost: "10" }
const GHOST_SCALE = { rest: "16", boost: "36" }

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)"

function subscribeMotion(onStoreChange: () => void) {
  const query = window.matchMedia(MOTION_QUERY)
  query.addEventListener("change", onStoreChange)
  return () => query.removeEventListener("change", onStoreChange)
}

function getMotionSnapshot() {
  return window.matchMedia(MOTION_QUERY).matches
}

/** SSR / hydration snapshot — no SMIL until after hydrate. */
function getMotionServerSnapshot() {
  return false
}

/**
 * Misregistered screen-print title: a crisp layer with a slight ink wobble
 * sits over a blurred, heavily displaced "ink bleed" ghost of the same text.
 * Fractal noise reseeds on a short loop so both layers boil, and hovering
 * the title kicks the displacement up like a mis-pulled print. The noise
 * loop is skipped for users who prefer reduced motion (and during SSR —
 * SMIL <animate> only mounts on the client).
 */
export function TextureTitle({ children }: { children: ReactNode }) {
  const animate = useSyncExternalStore(
    subscribeMotion,
    getMotionSnapshot,
    getMotionServerSnapshot
  )
  const mainDisplaceRef = useRef<SVGFEDisplacementMapElement>(null)
  const ghostDisplaceRef = useRef<SVGFEDisplacementMapElement>(null)

  const setBoost = (on: boolean) => {
    mainDisplaceRef.current?.setAttribute(
      "scale",
      on ? MAIN_SCALE.boost : MAIN_SCALE.rest
    )
    ghostDisplaceRef.current?.setAttribute(
      "scale",
      on ? GHOST_SCALE.boost : GHOST_SCALE.rest
    )
  }

  const noiseLoop = animate ? (
    <>
      <animate
        attributeName="baseFrequency"
        dur="0.5s"
        repeatCount="indefinite"
        values="0.85;1;0.8;1.05;0.85"
      />
      <animate
        attributeName="seed"
        dur="0.5s"
        repeatCount="indefinite"
        calcMode="discrete"
        values="3;15;8;22;3"
      />
    </>
  ) : null

  return (
    <span
      className="relative block w-fit"
      onPointerEnter={() => setBoost(true)}
      onPointerLeave={() => setBoost(false)}
    >
      <svg aria-hidden className="absolute size-0">
        <filter
          id={MAIN_FILTER_ID}
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="4"
            seed="7"
            result="grain"
          >
            {noiseLoop}
          </feTurbulence>
          <feDisplacementMap
            ref={mainDisplaceRef}
            in="SourceGraphic"
            in2="grain"
            scale={MAIN_SCALE.rest}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter
          id={GHOST_FILTER_ID}
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="soft" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="4"
            seed="12"
            result="grain"
          >
            {noiseLoop}
          </feTurbulence>
          <feDisplacementMap
            ref={ghostDisplaceRef}
            in="soft"
            in2="grain"
            scale={GHOST_SCALE.rest}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <span
        aria-hidden
        className="absolute inset-0 translate-x-[0.04em] translate-y-[0.045em] select-none text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.04em] opacity-55"
        style={{ filter: `url(#${GHOST_FILTER_ID})` }}
      >
        {children}
      </span>
      <h1
        className="relative text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.04em]"
        style={{ filter: `url(#${MAIN_FILTER_ID})` }}
      >
        {children}
      </h1>
    </span>
  )
}
