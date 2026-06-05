import FaqAccordion from "./faq-accordion"
import { faqSectionMeta } from "../lib/faq-content"

export default function FaqSectionV2() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10 md:mb-12">
          <p className="text-base text-muted-foreground">Learn More</p>
          <h2 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">
            {faqSectionMeta.title}
          </h2>
        </div>

        <FaqAccordion />
      </div>
    </section>
  )
}
