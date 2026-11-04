import { GeistSans } from "geist/font/sans"

import ComparisonBoard from "./comparison-board"
import { comparisonHeader } from "../lib/comparison"

export default function ComparisonSectionV1() {
  return (
    <section className={`py-16 font-sans md:py-24 ${GeistSans.className}`}>
      <div className="mx-auto max-w-6xl px-6">
        <header className="max-w-2xl">
          <h2 className="text-4xl font-medium leading-[1.1] tracking-[-0.03em] text-balance text-foreground md:text-5xl">
            {comparisonHeader.title}
          </h2>
        </header>
        <ComparisonBoard />
      </div>
    </section>
  )
}
