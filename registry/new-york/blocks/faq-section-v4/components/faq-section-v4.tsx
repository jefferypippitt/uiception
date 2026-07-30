import { Button } from "@/components/ui/button"

import FaqAccordion from "./faq-accordion"
import { faqSectionMeta } from "../lib/faq-content"

export default function FaqSectionV4() {
  return (
    <section className="bg-background py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6 lg:max-w-md">
            <p className="text-sm font-medium tracking-wide text-muted-foreground">
              [{faqSectionMeta.eyebrow}]
            </p>
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-medium leading-[1.15] tracking-tight text-foreground sm:text-4xl">
                {faqSectionMeta.title}
              </h2>
              <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                {faqSectionMeta.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="default" size="lg">
                {faqSectionMeta.primaryCta}
              </Button>
              <Button variant="ghost" size="lg">
                {faqSectionMeta.secondaryCta}
              </Button>
            </div>
          </div>

          <FaqAccordion />
        </div>
      </div>
    </section>
  )
}
