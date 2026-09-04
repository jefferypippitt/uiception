import ChangelogDateDivider from "./changelog-date-divider"
import ChangelogEntryRow from "./changelog-entry-row"
import { sectionMeta } from "../lib/changelog-content"
import { changelogGroups } from "../lib/changelog-format"

export default function ChangelogSectionV4() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
          {sectionMeta.title}
        </h2>

        <div className="mt-12 sm:mt-16">
          {changelogGroups.map((group) => (
            <div key={group.date}>
              <ChangelogDateDivider label={group.label} />
              <div className="my-4">
                {group.entries.map((entry) => (
                  <ChangelogEntryRow key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
