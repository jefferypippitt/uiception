import type { Metadata } from "next"
import { ArrowUpRightIcon, RssIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getChangelogEntries, type ChangelogEntry } from "@/lib/changelog"
import { ChangelogBadgeLink } from "./badge-link"

export const metadata: Metadata = {
  title: "Changelog",
  description: "Latest updates and announcements.",
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
}

function formatEntryDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number)
  const d = new Date(Date.UTC(year, month - 1, day))
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

export default async function ChangelogPage() {
  const entries = await getChangelogEntries()

  return (
    <div className="pb-14 md:pb-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl tracking-tighter md:text-4xl">Changelog</h1>
              <p className="mt-2 text-muted-foreground">Latest updates and announcements.</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
                <RssIcon data-icon="inline-start" />
                RSS
              </a>
            </Button>
          </div>

          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No changelog entries yet. Add one in <code>content/changelog</code>.
            </p>
          ) : (
            <div className="space-y-0">
              {entries.map((entry: ChangelogEntry) => (
                <article
                  key={`${entry.date}-${entry.title}`}
                  id={`entry-${entry.date}`}
                  className="scroll-mt-24 border-b border-border/60 py-10 first:pt-0 last:border-b-0 md:py-12"
                >
                  <time
                    dateTime={entry.date}
                    className="text-sm text-muted-foreground"
                  >
                    {formatEntryDate(entry.date)}
                  </time>

                  <h2 className="mt-2 text-balance text-2xl font-medium tracking-tight text-foreground md:text-[1.75rem]">
                    {entry.title}
                  </h2>

                  {(entry.summary || entry.description) && (
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {entry.summary ?? entry.description}
                    </p>
                  )}

                  <div className="typeset typeset-docs mt-6">
                    <entry.body />
                  </div>

                  {entry.items.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {entry.items.map((item: ChangelogEntry["items"][number]) => (
                        <span key={item.name}>
                          {item.href ? (
                            <Badge variant="outline" asChild className="font-normal">
                              <ChangelogBadgeLink href={item.href}>
                                {item.label} <ArrowUpRightIcon data-icon="inline-end" />
                              </ChangelogBadgeLink>
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="font-normal">
                              {item.label}
                            </Badge>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
