import ChangelogGroup from "./changelog-group"
import { sectionMeta } from "../lib/changelog-content"
import { changelogGroups } from "../lib/changelog-format"

export default function ChangelogSectionV3() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
          {sectionMeta.title}
        </h2>

        <div className="mt-12 sm:mt-16">
          {changelogGroups.map((group, index) => (
            <ChangelogGroup
              key={group.date}
              group={group}
              isFirst={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
