import { GeistPixelSquare } from "geist/font/pixel"

import FaqAccordion from "./faq-accordion"

export default function FaqSectionV6() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] md:gap-16 lg:gap-24">
          <div className="md:sticky md:top-24 md:self-start">
            <h2
              className={`${GeistPixelSquare.className} text-6xl leading-none tracking-tight text-foreground sm:text-7xl lg:text-8xl`}
            >
              FAQ
            </h2>
          </div>

          <FaqAccordion />
        </div>
      </div>
    </section>
  )
}
