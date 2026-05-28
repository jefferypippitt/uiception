import Marquee from "./marquee"
import { brands } from "../lib/brands"

import "../styles/brands-section-v1.css"

export default function BrandsSectionV1() {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:gap-10 lg:gap-14">
          <p className="max-w-[16rem] text-base leading-snug font-medium text-muted-foreground md:text-lg">
            Trusted by the best leading brands:
          </p>
          <Marquee brands={brands} />
        </div>
      </div>
    </section>
  )
}
