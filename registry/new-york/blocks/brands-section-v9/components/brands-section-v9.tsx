import Marquee from "./marquee"
import { brands } from "../lib/brands"

import "../styles/brands-section-v9.css"

export default function BrandsSectionV9() {
  return (
    <section className="py-6 md:py-8 lg:py-10">
      <Marquee brands={brands} />
    </section>
  )
}
