"use client"

import type { CSSProperties } from "react"
import { Link } from "next-view-transitions"

import type { BlockCategory } from "@/lib/blocks"
import type { BlockPeriodicCell } from "@/lib/block-periodic-layout"
import { cn } from "@/lib/utils"

import { BlockCategoryTitle } from "./block-category-title"

type BlockPeriodicTileProps = {
  category: BlockCategory
  cell: BlockPeriodicCell
  periodic?: boolean
  className?: string
  style?: CSSProperties
}

export function BlockPeriodicTile({
  category,
  cell,
  periodic = false,
  className,
  style,
}: BlockPeriodicTileProps) {
  const count = category.versions.length

  function clearOtherTitles() {
    document.querySelectorAll<HTMLElement>("[data-vt-category-title]").forEach((el) => {
      const name = el.dataset.vtCategoryTitle === category.id ? `title-${category.id}` : "none"
      el.style.setProperty("view-transition-name", name)
    })
  }

  return (
    <Link
      href={`/blocks/${category.id}`}
      style={style}
      onPointerDown={clearOtherTitles}
      onClick={clearOtherTitles}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          clearOtherTitles()
        }
      }}
      className={cn(
        "group relative flex flex-col overflow-hidden bg-card text-left transition",
        "hover:bg-muted/40",
        periodic
          ? "border-r border-b border-border/60 min-h-28"
          : "rounded-lg border border-border shadow-sm min-h-24",
        className
      )}
    >
     
      <span className="pointer-events-none absolute left-1.5 top-1 font-mono text-[9px] tabular-nums">
        {count}
      </span>

    
      <div className="flex flex-1 items-center justify-center px-1 pt-4">
        <span
          className={cn(
            "font-ibm-plex-serif italic text-foreground/75 transition group-hover:text-foreground",
            periodic ? "text-3xl leading-none" : "text-5xl"
          )}
        >
          {cell.symbol}
        </span>
      </div>

 
      <div className="px-1.5 pb-1.5 pt-1">
        <BlockCategoryTitle
          id={category.id}
          title={category.title}
          className={cn(
            "text-center font-medium leading-snug text-muted-foreground",
            periodic ? "text-[10px]" : "text-xs sm:text-sm"
          )}
        />
        {!periodic && (
          <p className="mt-0.5 text-center font-mono text-[10px] text-muted-foreground/60 tabular-nums">
            {count} {count === 1 ? "block" : "blocks"}
          </p>
        )}
      </div>
    </Link>
  )
}
