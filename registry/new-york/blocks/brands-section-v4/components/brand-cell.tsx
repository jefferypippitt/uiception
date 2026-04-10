"use client"

import { useEffect, useState, type CSSProperties } from "react"

import { FlickeringGrid } from "./flickering-grid"
import type { Brand } from "../lib/brands"

export function BrandCell({ brand }: { brand: Brand }) {
  const Icon = brand.Icon
  const DarkIcon = brand.darkIcon ?? brand.Icon
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"))
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  const flickerColor = isDark ? (brand.darkColor ?? brand.color) : brand.color

  return (
    <div
      aria-label={brand.name}
      className="bs4-cell"
      role="listitem"
      style={{ "--bs4-brand-color": brand.color } as CSSProperties}
    >
      <div className="bs4-flicker-layer" aria-hidden>
        <FlickeringGrid
          active
          className="h-full w-full mask-[radial-gradient(ellipse_75%_70%_at_50%_50%,white,transparent)]"
          color={flickerColor}
        />
      </div>

      <div className="bs4-logo-inner">
        <div className="bs4-logo-stack">
          <span className="bs4-icon">
            <Icon aria-hidden className="h-full w-full dark:hidden" />
            <DarkIcon aria-hidden className="hidden h-full w-full dark:block" />
          </span>
        </div>

      </div>
    </div>
  )
}
