import type { Metadata } from "next"

import { getDocsEntries, type DocEntry } from "@/lib/docs"

export const metadata: Metadata = {
  title: "Docs",
  description: "How uiception is built, and how to install a block.",
}

export default async function DocsPage() {
  const entries = await getDocsEntries()

  return (
    <div className="pb-14 md:pb-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12">
            <h1 className="text-3xl tracking-tighter md:text-4xl">Docs</h1>
            <p className="mt-2 text-muted-foreground">
              How uiception is built, and how to install a block.
            </p>
          </div>

          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No docs yet. Add one in <code>content/docs</code>.
            </p>
          ) : (
            <div className="space-y-0">
              {entries.map((entry: DocEntry) => (
                <article
                  key={entry.slug}
                  id={entry.slug}
                  className="scroll-mt-24 border-b border-border/60 py-10 first:pt-0 last:border-b-0 md:py-12"
                >
                  <h2 className="text-balance text-2xl font-medium tracking-tight text-foreground md:text-[1.75rem]">
                    {entry.title}
                  </h2>

                  {entry.description && (
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {entry.description}
                    </p>
                  )}

                  <div className="typeset typeset-docs max-w-[37em] mt-6">
                    <entry.body />
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
