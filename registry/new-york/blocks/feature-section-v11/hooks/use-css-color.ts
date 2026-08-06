"use client"

import { useSyncExternalStore } from "react"

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  const media = window.matchMedia("(prefers-color-scheme: dark)")
  media.addEventListener("change", onStoreChange)
  return () => {
    observer.disconnect()
    media.removeEventListener("change", onStoreChange)
  }
}

let probe: HTMLCanvasElement | null = null

/** Resolves any CSS color (oklch, hsl, named, ...) to an "rgb(r, g, b)" string by rasterizing it. */
function resolveToRgb(cssColor: string): string {
  probe ??= document.createElement("canvas")
  probe.width = 1
  probe.height = 1
  const ctx = probe.getContext("2d")
  if (!ctx) return cssColor
  ctx.fillStyle = cssColor
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return `rgb(${r}, ${g}, ${b})`
}

function getSnapshot(cssVariable: string) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVariable)
    .trim()
  return raw ? resolveToRgb(raw) : ""
}

/**
 * Reads a CSS custom property off the document root (e.g. "--foreground") and
 * keeps it live as an "rgb()" string across theme toggles or system scheme changes.
 */
export function useCssColor(cssVariable: string): string {
  return useSyncExternalStore(
    subscribe,
    () => getSnapshot(cssVariable),
    () => "",
  )
}
