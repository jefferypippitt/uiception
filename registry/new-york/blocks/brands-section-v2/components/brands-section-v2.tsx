import Marquee from "./marquee"
import { brands } from "../lib/brands"

import "../styles/brands-section-v2.css"

export default function BrandsSectionV2() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <Marquee brands={brands} />
      </div>
    </section>
  )
}
