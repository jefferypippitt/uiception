import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
} from "@/components/ui/item"

import { faqItems, faqSectionMeta } from "../lib/faq-content"

export default function FaqSectionV5() {
  return (
    <section className="bg-background py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex flex-col gap-2 pb-6">
          <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {faqSectionMeta.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            Last updated — {faqSectionMeta.lastUpdated}
          </p>
        </div>

        <div className="flex flex-col">
          {faqItems.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 py-8">
              <h3 className="text-xl font-medium tracking-tight text-foreground">
                {item.question}
              </h3>
              <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </div>
          ))}
        </div>

        <Item variant="muted" className="mt-8">
          <ItemContent>
            <ItemDescription>Was this helpful?</ItemDescription>
            <ItemDescription>
              Have more questions? Visit our{" "}
              <Button variant="link" size="sm" className="h-auto p-0" asChild>
                <Link href="#" target="_blank" rel="noopener noreferrer">
                  community
                </Link>
              </Button>
              , its open to everyone!
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Yes
            </Button>
            <Button variant="destructive" size="sm">
              No
            </Button>
          </ItemActions>
        </Item>
      </div>
    </section>
  )
}
