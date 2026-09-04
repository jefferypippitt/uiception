import Link from "next/link"

import ContributorGroup from "./contributor-group"
import type { ChangelogEntry } from "../lib/changelog-content"

/** One entry under a date divider: headline, description, and contributors. */
export default function ChangelogEntryRow({ entry }: { entry: ChangelogEntry }) {
  return (
    <article>
      <Link
        href="#"
        target="_blank"
        rel="noreferrer"
        className="block px-4 py-8 transition-colors hover:bg-muted/40 sm:px-6 sm:py-10"
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
  )
}
