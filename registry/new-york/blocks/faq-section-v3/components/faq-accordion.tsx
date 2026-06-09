"use client"

import { ChevronDownIcon } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { faqItems } from "../lib/faq-content"

export default function FaqAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqItems.map((item, index) => (
        <AccordionItem key={item.id} value={item.id} className="border-border">
          <AccordionTrigger className="py-5 text-base hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
            <span className="flex w-full items-center gap-6">
              <span className="w-7 shrink-0 font-mono text-sm text-muted-foreground/60">
                {String(index + 1).padStart(2, "0")}.
              </span>
              <span className="flex-1 text-left font-normal text-foreground">
                {item.question}
              </span>
              <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-180" />
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-5 pl-13 text-base leading-relaxed text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
