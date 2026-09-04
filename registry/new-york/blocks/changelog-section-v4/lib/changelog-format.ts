import type { ChangelogEntry, Contributor } from "./changelog-content"
import { changelog } from "./changelog-content"

export type ChangelogDateGroup = {
  date: string
  /** Display label, e.g. "2 September 2026". */
  label: string
  entries: ChangelogEntry[]
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

/** "2026-09-02" -> "2 September 2026" */
export function formatChangelogDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number)
  return `${day} ${MONTHS[month - 1]} ${year}`
}

/**
 * Names line under an entry. Up to two names are spelled out; everyone else is
 * folded into "and N other(s)" — e.g. "Jeremy Dopkin, Elliot Dauber, and 1 other".
 */
export function formatContributorNames(contributors: Contributor[]): string {
  const names = contributors.map((person) => person.name)
  if (names.length <= 2) return names.join(", ")
  const rest = names.length - 2
  return `${names[0]}, ${names[1]}, and ${rest} other${rest === 1 ? "" : "s"}`
}

/** Collapse a flat entry list into date groups, newest date first. */
export function groupEntriesByDate(
  entries: ChangelogEntry[]
): ChangelogDateGroup[] {
  const byDate = new Map<string, ChangelogEntry[]>()
  for (const entry of entries) {
    const existing = byDate.get(entry.date)
    if (existing) existing.push(entry)
    else byDate.set(entry.date, [entry])
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => (a < b ? 1 : a > b ? -1 : 0))
    .map(([date, dateEntries]) => ({
      date,
      label: formatChangelogDate(date),
      entries: dateEntries,
    }))
}

export const changelogGroups = groupEntriesByDate(changelog)

/** Max avatars rendered before the "+N" count bubble takes over. */
export const MAX_VISIBLE_CONTRIBUTORS = 3
