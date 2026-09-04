import Link from "next/link"

import ContributorGroup from "./contributor-group"
import type { ChangelogDateGroup } from "../lib/changelog-format"

/**
 * One date node on the timeline: a bracket rail + date on the left, and every
 * entry published on that date stacked on the right. Two columns from `sm` up;
 * on mobile the date sits above its entries with the rail still on the left.
 * The first node closes at the elbow (nothing above it); the rest run edge to
 * edge so the rail is continuous down the list.
 */
export default function ChangelogGroup({
  group,
  isFirst = false,
}: {
  group: ChangelogDateGroup
  isFirst?: boolean
}) {
  return (
    <div className="relative pl-7 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-x-12 sm:pl-0">
      {/* vertical rail */}
      <span
        aria-hidden
        className={`absolute bottom-0 left-0 w-px bg-border ${
          isFirst ? "top-[0.45rem] sm:top-[1.45rem]" : "top-0"
        }`}
      />
      {/* elbow — the right angle into the date (offset on sm to match the entry's top padding) */}
      <span
        aria-hidden
        className="absolute top-[0.45rem] left-0 h-px w-4 bg-border sm:top-[1.45rem] sm:w-6"
      />

      <time
        dateTime={group.date}
        className="block text-sm leading-tight whitespace-nowrap text-muted-foreground sm:pt-4 sm:pl-9"
      >
        {group.label}
      </time>

      <div className="mt-2 space-y-8 pb-14 sm:mt-0 sm:space-y-10 sm:pb-24">
        {group.entries.map((entry) => (
          <article key={entry.id} className="-mx-4 sm:-mx-6">
            <Link
              href="#"
              target="_blank"
              rel="noreferrer"
              className="block cursor-pointer rounded-none px-4 py-4 transition-colors hover:bg-muted/40 sm:px-6"
            >
              <h3 className="text-xl font-medium tracking-tight text-balance text-foreground sm:text-2xl">
                {entry.title}
              </h3>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                {entry.description}
              </p>
              <div className="mt-5">
                <ContributorGroup contributors={entry.contributors} />
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
