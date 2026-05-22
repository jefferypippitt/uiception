import Marquee from "./marquee"
import { brands } from "./brands"

import "./brands-section-v2.css"

export default function BrandsSectionV2() {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <Marquee brands={brands} />
      </div>
    </section>
  )
}
