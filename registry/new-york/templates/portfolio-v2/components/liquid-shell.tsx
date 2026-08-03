"use client"

import { useTheme } from "next-themes"
import {
  useSyncExternalStore,
  type ReactNode,
} from "react"

import { Liquid } from "@/components/canvasui/liquid"

/**
 * Trail colors as sRGB in the 0–1 range (Liquid converts to linear).
 * Light mode uses a richer blue so the overlay reads on white;
 * dark mode keeps a lighter cobalt that pops on near-black.
 */
const LIGHT_COLOR: [number, number, number] = [0.18, 0.32, 0.98]
const DARK_COLOR: [number, number, number] = [0.32, 0.45, 1]

const emptySubscribe = () => () => {}

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false)
}

type LiquidShellProps = {
  children: ReactNode
  className?: string
}

/**
 * Full-page Canvas UI Liquid wrapper.
 *
 * Text distortion only runs in Chromium when the html-in-canvas API is
 * available (chrome://flags/#canvas-draw-element, or a Chrome origin
 * trial token for production). Without it Liquid still paints pointer
 * trails over live HTML — matching the official package fallback.
 */
export function LiquidShell({ children, className }: LiquidShellProps) {
  const { resolvedTheme } = useTheme()
  const mounted = useIsClient()
  const isDark = !mounted || resolvedTheme !== "light"

  return (
    <Liquid
      force={0.4}
      radius={0.2}
      curl={1.5}
      pressureIterations={2}
      pressure={0.5}
      intensity={isDark ? 2 : 2.5}
      distortion={0.35}
      blend={isDark ? 5 : 7}
      densityDissipation={0.9}
      velocityDissipation={1}
      color={isDark ? DARK_COLOR : LIGHT_COLOR}
      rainbow={false}
      className={
        className ??
        "relative flex min-h-svh w-full flex-1 flex-col"
      }
      style={{ minHeight: "100svh" }}
    >
      {/*
        Solid page surface: the sim captures this subtree when html-in-canvas
        is available. Without a real background, light mode text sits on
        transparent pixels and warping looks incomplete.
      */}
      <div className="relative flex min-h-svh w-full flex-1 flex-col bg-background text-foreground">
        {children}
      </div>
    </Liquid>
  )
}
