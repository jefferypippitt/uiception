"use client"

import { Fragment, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"

type SearchableTile = {
  id: string
  title: string
  tile: ReactNode
}

type BlocksSearchViewProps = {
  browse: ReactNode
  tiles: SearchableTile[]
}

export function BlocksSearchView({ browse, tiles }: BlocksSearchViewProps) {
  const q = useSearchParams().get("q") ?? ""
  const query = q.trim().toLowerCase()

  if (!query) return browse

  const matches = tiles.filter(
    ({ id, title }) =>
      title.toLowerCase().includes(query) || id.toLowerCase().includes(query),
  )

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      {matches.length > 0 ? (
        <section
          className="grid grid-cols-2 gap-0 overflow-hidden sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          aria-label="Block category search results"
        >
          {matches.map(({ id, tile }) => (
            <Fragment key={id}>{tile}</Fragment>
          ))}
        </section>
      ) : (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No categories match &ldquo;{q}&rdquo;
        </p>
      )}
    </div>
  )
}
