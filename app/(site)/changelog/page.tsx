import type { Metadata } from "next"
import { ArrowUpRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { getChangelogEntries, type ChangelogEntry } from "@/lib/changelog"
import { ChangelogBadgeLink } from "./badge-link"
import { ChangelogList } from "./changelog-list"

export const metadata: Metadata = {
  title: "Changelog",
  description: "Latest updates and announcements.",
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
}

const badgeColorClasses = [
  "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 [a&]:hover:bg-blue-100 [a&]:hover:text-blue-800 dark:[a&]:hover:bg-blue-900 dark:[a&]:hover:text-blue-200",
  "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 [a&]:hover:bg-green-100 [a&]:hover:text-green-800 dark:[a&]:hover:bg-green-900 dark:[a&]:hover:text-green-200",
  "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 [a&]:hover:bg-sky-100 [a&]:hover:text-sky-800 dark:[a&]:hover:bg-sky-900 dark:[a&]:hover:text-sky-200",
  "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 [a&]:hover:bg-purple-100 [a&]:hover:text-purple-800 dark:[a&]:hover:bg-purple-900 dark:[a&]:hover:text-purple-200",
  "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 [a&]:hover:bg-red-100 [a&]:hover:text-red-800 dark:[a&]:hover:bg-red-900 dark:[a&]:hover:text-red-200",
]

export default async function ChangelogPage() {
  const entries = await getChangelogEntries()

  return (
    <div className="pb-14 md:pb-20">
      <div className="mx-auto w-full max-w-6xl px-6">

          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl tracking-tighter md:text-4xl">Changelog</h1>
            <p className="mt-2 text-muted-foreground">Latest updates and announcements.</p>
          </div>

          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No changelog entries yet. Add one in <code>content/changelog</code>.
            </p>
          ) : (
            <ChangelogList>
              {entries.map((entry: ChangelogEntry) => (
                <div
                  key={`${entry.date}-${entry.title}`}
                  id={`entry-${entry.date}`}
                  className="cl-row flex flex-col md:flex-row md:gap-12 pb-12 last:pb-0"
                >
                  {/* Left — sticky date */}
                  <div className="w-full md:w-36 shrink-0 mb-3 md:mb-0">
                    <time
                      dateTime={entry.date}
                      className="cl-date sticky top-20 block font-mono text-sm text-muted-foreground"
                    >
                      {entry.dateDisplay}
                    </time>
                  </div>

                  {/* Right — entry card */}
                  <div className="cl-card flex-1 min-w-0 rounded-none border p-5 shadow-none">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                      {entry.title}
                    </h2>

                    {(entry.summary || entry.description) && (
                      <p className="mt-2 max-w-2xl text-sm font-normal leading-relaxed text-muted-foreground">
                        {entry.summary ?? entry.description}
                      </p>
                    )}

                    <div
                      className={[
                        "changelog-entry-body prose prose-sm mt-5 max-w-none text-sm leading-relaxed",
                        "text-foreground/90 prose-p:my-2 prose-li:my-0.5",
                        "prose-headings:scroll-mt-20 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground",
                        "dark:prose-invert",
                      ].join(" ")}
                    >
                      <entry.body />
                    </div>

                    {entry.items.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {entry.items.map((item: ChangelogEntry["items"][number], index: number) => (
                          <span key={item.name}>
                            {item.href ? (
                              <Badge
                                asChild
                                className={`transition-colors ${badgeColorClasses[index % badgeColorClasses.length]}`}
                              >
                                <ChangelogBadgeLink href={item.href}>
                                  {item.label} <ArrowUpRightIcon data-icon="inline-end" />
                                </ChangelogBadgeLink>
                              </Badge>
                            ) : (
                              <Badge
                                className={`transition-colors ${badgeColorClasses[index % badgeColorClasses.length]}`}
                              >
                                {item.label}
                              </Badge>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </ChangelogList>
          )}

      </div>
    </div>
  )
}
