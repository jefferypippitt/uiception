"use client"

import { brands } from "../lib/brands"
import { BrandCell } from "./brand-cell"

export default function BrandGrid() {
  return (
    <div
      className="grid grid-cols-2 border border-border sm:grid-cols-3 lg:grid-cols-6"
      role="list"
      aria-label="Technology partner logos"
    >
      {brands.map((brand) => (
        <BrandCell key={brand.name} brand={brand} />
      ))}
    </div>
  )
}
