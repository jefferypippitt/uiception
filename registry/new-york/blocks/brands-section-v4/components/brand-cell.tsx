"use client"

import { useEffect, useState, type CSSProperties } from "react"

import { FlickeringGrid } from "./flickering-grid"
import type { Brand } from "../lib/brands"

export function BrandCell({ brand }: { brand: Brand }) {
  const Icon = brand.Icon
  const DarkIcon = brand.darkIcon ?? brand.Icon
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"))
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  const flickerColor = isDark ? (brand.darkColor ?? brand.color) : brand.color

  return (
    <div
      aria-label={brand.name}
      className="bs4-cell relative isolate z-0 -mt-px -ml-px flex cursor-default items-center justify-center overflow-hidden border border-border bg-background py-8"
      role="listitem"
      style={{ "--bs4-brand-color": brand.color } as CSSProperties}
    >
      <div
        className="pointer-events-none absolute inset-0 z-2 overflow-hidden opacity-100"
        aria-hidden
      >
        <FlickeringGrid
          active
          className="h-full w-full mask-[radial-gradient(ellipse_75%_70%_at_50%_50%,white,transparent)]"
          color={flickerColor}
        />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center">
        <div className="relative aspect-square w-10 max-w-full rounded-2.5 md:w-12">
          <span className="absolute inset-0 flex opacity-100">
            <Icon aria-hidden className="h-full w-full dark:hidden" />
            <DarkIcon aria-hidden className="hidden h-full w-full dark:block" />
          </span>
        </div>
      </div>
    </div>
  )
}
