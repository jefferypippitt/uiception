"use client"

import FaqAccordion from "./faq-accordion"
import { faqSectionMeta } from "../lib/faq-content"

export default function FaqSectionV3() {
  return (
    <section className="bg-background py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-14 text-center">
          <h2 className="font-serif text-5xl font-normal tracking-tight text-foreground sm:text-6xl">
            {faqSectionMeta.title}
          </h2>
          <p className="mt-3 font-serif text-2xl italic text-muted-foreground sm:text-3xl">
            {faqSectionMeta.subtitle}
          </p>
        </div>
        <FaqAccordion />
      </div>
    </section>
  )
}
