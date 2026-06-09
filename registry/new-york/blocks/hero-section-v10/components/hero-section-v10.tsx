import { GeistSans } from "geist/font/sans"

import CtaButton from "./cta-button"
import StockChart from "./stock-chart"

import "../styles/hero-section-v10.css"

export default function HeroSectionV10() {
  return (
    <section
      className={`${GeistSans.className} py-4 hyphens-none md:py-6`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="max-w-[18ch] text-3xl tracking-tighter sm:text-4xl lg:text-5xl lg:leading-[1.15]">
            The Stock Platform for<br />Serious Investors.
          </h1>

          <p className="max-w-xl text-base leading-7 tracking-tight text-muted-foreground sm:text-lg sm:leading-8">
            AI-powered research and real-time signals so you never miss a move.
          </p>

          <CtaButton />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-8">
        <StockChart />
      </div>

    </section>
  )
}
