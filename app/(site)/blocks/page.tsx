import { Suspense } from "react"
import type { Metadata } from "next"

import { blockCategories } from "@/lib/blocks"
import {
  blockPeriodicCellsByPlacement,
  type BlockPeriodicCell,
} from "@/lib/block-periodic-layout"

import { BlockPeriodicTile } from "./block-periodic-tile"
import { BlocksSearchInput } from "./blocks-search-input"

export const metadata: Metadata = {
  title: "Blocks",
  description: "Browse all UI block categories",
}

const COLS = 10
const EXTENDED_ROW_START = 6
const gridTemplateColumns = `repeat(${COLS}, minmax(0, 1fr))`

function withCategory<T extends { id: string }>(cells: T[]) {
  return cells.map((cell) => {
    const category = blockCategories.find((c) => c.id === cell.id)
    if (!category) throw new Error(`blockCategories missing id: ${cell.id}`)
    return { category, cell }
  })
}

function periodicPlacement(cell: BlockPeriodicCell) {
  const span = cell.colSpan
  return {
    gridColumn: span ? (`${cell.col} / span ${span}` as const) : cell.col,
    gridRow: cell.row,
  } as const
}

function extendedPlacement(cell: BlockPeriodicCell) {
  const span = cell.colSpan
  return {
    gridColumn: span ? (`${cell.col} / span ${span}` as const) : cell.col,
    gridRow: cell.row - EXTENDED_ROW_START + 1,
  } as const
}

const allCategories = withCategory(blockPeriodicCellsByPlacement)
const mainCategories = allCategories.filter(({ cell }) => cell.row < EXTENDED_ROW_START)
const extendedCategories = allCategories.filter(({ cell }) => cell.row >= EXTENDED_ROW_START)

function periodicBorderClass(cell: BlockPeriodicCell, siblings: BlockPeriodicCell[]): string {
  const hasTop = siblings.some((c) => c.col === cell.col && c.row === cell.row - 1)
  const hasLeft = siblings.some((c) => c.row === cell.row && c.col === cell.col - 1)
  return [!hasTop && "border-t", !hasLeft && "border-l"].filter(Boolean).join(" ")
}

const mainCells = mainCategories.map(({ cell }) => cell)
const extendedCells = extendedCategories.map(({ cell }) => cell)

export default async function BlocksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim().toLowerCase() ?? ""

  const filteredCategories = query
    ? allCategories.filter(({ category }) =>
        category.title.toLowerCase().includes(query) ||
        category.id.toLowerCase().includes(query),
      )
    : null

  return (
    <div className="pb-14 md:pb-20">
      {/* Header */}
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-12 flex items-center justify-between gap-4">
          <h1 className="text-3xl tracking-tighter md:text-4xl">Explore All Categories</h1>
          <Suspense>
            <BlocksSearchInput />
          </Suspense>
        </div>
      </div>

      {filteredCategories ? (
        /* Search results — flat grid, all screen sizes */
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          {filteredCategories.length > 0 ? (
            <section
              className="grid grid-cols-2 gap-0 overflow-hidden sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              aria-label="Block category search results"
            >
              {filteredCategories.map(({ category, cell }) => (
                <BlockPeriodicTile
                  key={category.id}
                  periodic
                  category={category}
                  cell={cell}
                  className="-ml-px -mt-px border-t border-l"
                />
              ))}
            </section>
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No categories match &ldquo;{q}&rdquo;
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Category grid — desktop */}
          <div className="mx-auto mt-10 hidden w-full max-w-6xl px-4 sm:px-6 md:block">
            <div className="grid" style={{ gridTemplateColumns, gap: 0 }}>
              {mainCategories.map(({ category, cell }) => (
                <BlockPeriodicTile
                  key={cell.id}
                  periodic
                  category={category}
                  cell={cell}
                  style={periodicPlacement(cell)}
                  className={periodicBorderClass(cell, mainCells)}
                />
              ))}
            </div>

            <div className="mt-10 grid" style={{ gridTemplateColumns, gap: 0 }}>
              {extendedCategories.map(({ category, cell }) => (
                <BlockPeriodicTile
                  key={cell.id}
                  periodic
                  category={category}
                  cell={cell}
                  style={extendedPlacement(cell)}
                  className={periodicBorderClass(cell, extendedCells)}
                />
              ))}
            </div>
          </div>

          {/* Mobile: flat card grid */}
          <div className="mx-auto mt-10 w-full max-w-[min(64rem,calc(100%-2rem))] px-4 sm:px-6 md:hidden">
            <section
              className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3"
              aria-label="Block categories"
            >
              {allCategories.map(({ category, cell }) => (
                <BlockPeriodicTile key={category.id} category={category} cell={cell} />
              ))}
            </section>
          </div>
        </>
      )}
    </div>
  )
}
