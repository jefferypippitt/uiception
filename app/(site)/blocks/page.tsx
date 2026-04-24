import type { Metadata } from "next"

import { blockCategories } from "@/lib/blocks"
import {
  blockPeriodicCellsByPlacement,
  type BlockPeriodicCell,
} from "@/lib/block-periodic-layout"

import { BlockPeriodicTile } from "./block-periodic-tile"

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

export default function BlocksPage() {
  return (
    <div className="pb-14 md:pb-20">
      <div className="mx-auto w-full max-w-6xl px-6">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl tracking-tighter md:text-4xl">Explore All Categories</h1>
        </div>
      </div>

      {/* Category grid — desktop */}
      <div className="mx-auto mt-10 hidden w-full max-w-6xl px-4 sm:px-6 md:block">
        {/* Main periodic grid */}
        <div className="grid" style={{ gridTemplateColumns, gap: 0 }}>
          {mainCategories.map(({ category, cell }) => (
            <BlockPeriodicTile
              key={cell.id}
              periodic
              category={category}
              cell={cell}
              style={periodicPlacement(cell)}
            />
          ))}
        </div>

        {/* Extended grid */}
        <div className="mt-10 grid" style={{ gridTemplateColumns, gap: 0 }}>
          {extendedCategories.map(({ category, cell }) => (
            <BlockPeriodicTile
              key={cell.id}
              periodic
              category={category}
              cell={cell}
              style={extendedPlacement(cell)}
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
    </div>
  )
}
