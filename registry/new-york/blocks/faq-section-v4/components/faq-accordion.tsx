"use client"

import { MinusIcon, PlusIcon } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { faqItems } from "../lib/faq-content"

export default function FaqAccordion() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full rounded-sm border border-border px-5"
    >
      {faqItems.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="border-border last:border-b-0"
        >
          <AccordionTrigger className="py-5 text-left text-base font-medium hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
            <span className="flex w-full items-center justify-between gap-4">
              {item.question}
              <PlusIcon className="size-4 shrink-0 group-aria-expanded/accordion-trigger:hidden" />
              <MinusIcon className="size-4 shrink-0 hidden group-aria-expanded/accordion-trigger:inline" />
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-base leading-relaxed text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
