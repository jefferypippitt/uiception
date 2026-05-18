import Marquee from "./marquee"
import { brands } from "../lib/brands"

import "../styles/brands-section-v6.css"

export default function BrandsSectionV6() {
  return (
    <section className="w-full self-stretch pt-8 md:pt-10">
      <div className="flex w-full flex-col items-start gap-6 md:gap-8">
        <p className="text-left font-mono text-sm uppercase tracking-wider text-muted-foreground sm:text-base">
          Trusted by security teams at
        </p>
        <Marquee brands={brands} />
      </div>
    </section>
  )
}
