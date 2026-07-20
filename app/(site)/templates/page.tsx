import type { Metadata } from "next"
import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { templateCategories } from "@/lib/templates"

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Next.js starters for new projects",
}

export default function TemplatesPage() {
  return (
    <div className="pb-14 md:pb-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12">
            <h1 className="text-3xl tracking-tighter md:text-4xl">Templates</h1>
            <p className="mt-2 text-muted-foreground">
              Next.js starters for new projects.
            </p>
          </div>

          {templateCategories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No templates yet.</p>
          ) : (
            <div className="space-y-0">
              {templateCategories.map((category) => (
                <article
                  key={category.id}
                  id={category.id}
                  className="scroll-mt-24 border-b border-border/60 py-10 first:pt-0 last:border-b-0 md:py-12"
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-balance text-2xl font-medium tracking-tight text-foreground md:text-[1.75rem]">
                        {category.title}
                      </h2>

                      <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                        {category.description}
                      </p>
                    </div>

                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/templates/${category.id}`}>
                        Open
                        <ChevronRightIcon data-icon="inline-end" />
                      </Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
