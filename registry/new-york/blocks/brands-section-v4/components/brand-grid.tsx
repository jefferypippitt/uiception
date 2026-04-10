"use client"

import { brands } from "../lib/brands"
import { BrandCell } from "./brand-cell"

export default function BrandGrid() {
  return (
    <div className="bs4-grid" role="list" aria-label="Technology partner logos">
      {brands.map((brand) => (
        <BrandCell key={brand.name} brand={brand} />
      ))}
    </div>
  )
}
