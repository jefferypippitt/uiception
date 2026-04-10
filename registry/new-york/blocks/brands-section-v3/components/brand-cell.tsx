"use client"

import { useEffect, useState, type CSSProperties } from "react"

import { FlickeringGrid } from "./flickering-grid"
import type { Brand } from "../lib/brands"

export function BrandCell({ brand }: { brand: Brand }) {
  const Icon = brand.Icon
  const DarkIcon = brand.darkIcon ?? brand.Icon
  const [isHovered, setIsHovered] = useState(false)
  const [coarsePointer, setCoarsePointer] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(hover: none)")
    const update = () => setCoarsePointer(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const gridActive = isHovered || coarsePointer

  return (
    <div
      aria-label={brand.name}
      className="bs3-cell group"
      role="listitem"
      style={{ "--bs3-brand-color": brand.color } as CSSProperties}
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <div className="bs3-flicker-layer" aria-hidden>
        <FlickeringGrid
          active={gridActive}
          className="h-full w-full mask-[radial-gradient(ellipse_75%_70%_at_50%_50%,white,transparent)]"
          color={brand.color}
        />
      </div>

      <div className="bs3-logo-inner">
        <div className="bs3-logo-stack">
          <span className="bs3-icon-default">
            <Icon aria-hidden className="h-full w-full" />
          </span>
          <span className="bs3-icon-hover">
            <Icon aria-hidden className="h-full w-full dark:hidden" />
            <DarkIcon aria-hidden className="hidden h-full w-full dark:block" />
          </span>
        </div>

        <span className="bs3-name-label">{brand.name}</span>
      </div>
    </div>
  )
}
