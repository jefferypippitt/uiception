import FaqAccordion from "./faq-accordion"
import { faqSectionMeta } from "../lib/faq-content"

export default function FaqSectionV1() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10 text-center md:mb-12">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            {faqSectionMeta.title}
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            {faqSectionMeta.description}
          </p>
        </div>

        <FaqAccordion />
      </div>
    </section>
  )
}
