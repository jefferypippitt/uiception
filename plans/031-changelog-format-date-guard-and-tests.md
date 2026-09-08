# Plan 031: `changelog-section-v3` / `v4` date formatting is validated and unit-tested

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 088cc3e..HEAD -- registry/new-york/blocks/changelog-section-v3 registry/new-york/blocks/changelog-section-v4 tests`
> If any changelog-block file changed since this plan was written, compare the
> "Current state" excerpts against the live code first; on a mismatch, STOP.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: correctness + tests
- **Planned at**: commit `088cc3e`, 2026-09-07

## Why this matters

`changelog-section-v3` and `changelog-section-v4` are two blocks added this
cycle. Both ship an identical `lib/changelog-format.ts` with three pure
functions — `formatChangelogDate`, `formatContributorNames`, `groupEntriesByDate`
— and **none of them have any test**. `formatChangelogDate` also does zero
validation:

```ts
export function formatChangelogDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number)
  return `${day} ${MONTHS[month - 1]} ${year}`
}
```

These are copy-install blocks: the consumer hand-edits `lib/changelog-content.ts`
to put in their own entries. The `date` field is typed only as `string`. A
slash-separated date, a two-digit-month typo, or `month > 12` makes
`MONTHS[month - 1]` `undefined` and the block renders a user-visible
`"2 undefined 2026"` with no build error and no console warning. Non-numeric
parts render `"NaN"`.

After this plan: a malformed date falls back to rendering the raw ISO string
unchanged (visibly wrong, but not gibberish, and greppable), and all three
functions have coverage that pins the month indexing, the singular/plural
contributor pivot, and the newest-first grouping.

## Current state

- `registry/new-york/blocks/changelog-section-v3/lib/changelog-format.ts` — full
  file:

  ```ts
  import type { ChangelogEntry, Contributor } from "./changelog-content"
  import { changelog } from "./changelog-content"

  export type ChangelogDateGroup = {
    date: string
    /** Display label, e.g. "2 September 2026". */
    label: string
    entries: ChangelogEntry[]
  }

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
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
  ```

- `registry/new-york/blocks/changelog-section-v4/lib/changelog-format.ts` — at
  `088cc3e` this file is **byte-identical** to the v3 copy. Confirm with:
  `diff registry/new-york/blocks/changelog-section-v3/lib/changelog-format.ts registry/new-york/blocks/changelog-section-v4/lib/changelog-format.ts`
  → no output. Keep them identical.

- Consumers of the three functions (do not change these — listed so you know the
  contract):
  - `formatContributorNames` — `changelog-section-v{3,4}/components/contributor-group.tsx:38`
  - `formatChangelogDate` — via `groupEntriesByDate` → `changelogGroups`
  - `groupEntriesByDate` — `changelogGroups` export, consumed by
    `changelog-section-v{3,4}.tsx`

- `registry/new-york/blocks/changelog-section-v3/lib/changelog-content.ts` — the
  `date` field:
  ```ts
  export type ChangelogEntry = {
    id: string
    /** ISO date (YYYY-MM-DD). Entries that share a date render under one timeline node. */
    date: string
    ...
  }
  ```
  Real fixture dates at `088cc3e` are all valid `YYYY-MM-DD`.

- `public/r/changelog-section-v3.json` / `changelog-section-v4.json` — generated
  payloads embedding file `content`; regenerated by `pnpm registry:build`.

### Repo conventions to match

- **Test location + style**: registry-block pure-function tests live in
  `tests/registry/`. Nearest structural model:
  `tests/templates/portfolio-v4/commands.test.ts` (vitest `describe`/`it`,
  `import { describe, expect, it } from "vitest"`, path-alias imports like
  `@/registry/new-york/blocks/...`). Also see `tests/registry/registry-font-deps.test.ts`
  for the `@/registry/...` import pattern from a `tests/registry/` file.
- **Guard style**: prefer an early return over throwing — these functions render
  UI; a thrown error would blank the section. Return the raw input on bad data.
- Do not add a runtime dependency (no `date-fns` — it's in the repo but blocks
  must stay dependency-light and this is trivial arithmetic).

## Commands you will need

| Purpose           | Command                                                       | Expected on success |
|-------------------|-------------------------------------------------------------|---------------------|
| Install           | `pnpm install`                                              | exit 0              |
| Typecheck         | `pnpm typecheck`                                            | exit 0              |
| Targeted test     | `pnpm vitest run tests/registry/changelog-format.test.ts`   | all pass            |
| Full tests        | `pnpm test:run`                                             | all pass            |
| Lint              | `pnpm lint`                                                 | exit 0; 16 pre-existing warnings, none new |
| Registry build    | `pnpm registry:build`                                       | writes `public/r/*.json` |
| Registry validate | `pnpm registry:validate`                                    | all items valid     |

Fresh worktree: `pnpm install` first.

## Scope

**In scope**:
- `registry/new-york/blocks/changelog-section-v3/lib/changelog-format.ts` (modify)
- `registry/new-york/blocks/changelog-section-v4/lib/changelog-format.ts` (modify — same edit, keep identical)
- `tests/registry/changelog-format.test.ts` (create)
- `public/r/changelog-section-v3.json`, `public/r/changelog-section-v4.json`
  (regenerated by `pnpm registry:build`, Step 4)

**Out of scope**:
- `lib/changelog-content.ts` in either block (the `date: string` type stays —
  see Maintenance notes for why not tightening it here).
- The block components, `page.tsx`, `styles/`, avatars.
- `registry.json` — no file-list change.
- Any other `public/r/*.json`, any other block or template.
- `lib/changelog.ts` / `content/changelog/*.mdx` — the site's own changelog, a
  different system.

## Git workflow

- Branch: `advisor/031-changelog-format-date-guard-and-tests`
- One or two commits. Short imperative message; repo style is loose.
- Do NOT push or open a PR.

## Steps

### Step 1: Guard `formatChangelogDate` (v3)

In `registry/new-york/blocks/changelog-section-v3/lib/changelog-format.ts`,
replace the function body:

```ts
/** "2026-09-02" -> "2 September 2026". Returns the raw input unchanged if it
 *  isn't a valid YYYY-MM-DD date. */
export function formatChangelogDate(iso: string): string {
  const parts = iso.split("-")
  if (parts.length !== 3) return iso
  const [year, month, day] = parts.map(Number)
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return iso
  }
  return `${day} ${MONTHS[month - 1]} ${year}`
}
```

**Verify**: `pnpm typecheck` → exit 0.

### Step 2: Apply the identical edit to v4

Make `registry/new-york/blocks/changelog-section-v4/lib/changelog-format.ts`
match v3 exactly.

**Verify**:
`diff registry/new-york/blocks/changelog-section-v3/lib/changelog-format.ts registry/new-york/blocks/changelog-section-v4/lib/changelog-format.ts`
→ no output.

### Step 3: Add the test file

Create `tests/registry/changelog-format.test.ts`. It runs the same suite against
both blocks' copies (so future drift between them is caught):

```ts
import { describe, expect, it } from "vitest"

import * as v3 from "@/registry/new-york/blocks/changelog-section-v3/lib/changelog-format"
import * as v4 from "@/registry/new-york/blocks/changelog-section-v4/lib/changelog-format"

const variants = [
  ["changelog-section-v3", v3],
  ["changelog-section-v4", v4],
] as const

describe.each(variants)("%s changelog-format", (_name, mod) => {
  describe("formatChangelogDate", () => {
    it("formats a valid ISO date as `D Month YYYY`", () => {
      expect(mod.formatChangelogDate("2026-09-02")).toBe("2 September 2026")
      expect(mod.formatChangelogDate("2026-01-31")).toBe("31 January 2026")
      expect(mod.formatChangelogDate("2026-12-01")).toBe("1 December 2026")
    })

    it("returns the raw string for a malformed date instead of `undefined`/`NaN`", () => {
      for (const bad of ["2026/09/02", "2026-13-02", "2026-00-10", "not-a-date", "2026-09"]) {
        expect(mod.formatChangelogDate(bad)).toBe(bad)
      }
    })
  })

  describe("formatContributorNames", () => {
    const p = (name: string) => ({ id: name, name, initials: "XX", avatarSrc: "" })

    it("spells out one or two names in full", () => {
      expect(mod.formatContributorNames([p("Ada")])).toBe("Ada")
      expect(mod.formatContributorNames([p("Ada"), p("Bo")])).toBe("Ada, Bo")
    })

    it("folds three into `and 1 other` (singular)", () => {
      expect(mod.formatContributorNames([p("Ada"), p("Bo"), p("Cy")])).toBe(
        "Ada, Bo, and 1 other"
      )
    })

    it("folds four+ into `and N others` (plural)", () => {
      expect(
        mod.formatContributorNames([p("Ada"), p("Bo"), p("Cy"), p("Di")])
      ).toBe("Ada, Bo, and 2 others")
    })
  })

  describe("groupEntriesByDate", () => {
    const entry = (id: string, date: string) => ({
      id,
      date,
      title: id,
      description: "",
      contributors: [],
    })

    it("orders groups newest date first", () => {
      const groups = mod.groupEntriesByDate([
        entry("a", "2026-01-01"),
        entry("b", "2026-03-01"),
        entry("c", "2026-02-01"),
      ])
      expect(groups.map((g) => g.date)).toEqual([
        "2026-03-01",
        "2026-02-01",
        "2026-01-01",
      ])
    })

    it("merges entries that share a date into one group", () => {
      const groups = mod.groupEntriesByDate([
        entry("a", "2026-03-01"),
        entry("b", "2026-03-01"),
        entry("c", "2026-02-01"),
      ])
      expect(groups).toHaveLength(2)
      expect(groups[0].entries.map((e) => e.id)).toEqual(["a", "b"])
      expect(groups[0].label).toBe("1 March 2026")
    })
  })
})
```

**Verify**: `pnpm vitest run tests/registry/changelog-format.test.ts` → all pass
(the suite runs twice, once per block).

### Step 4: Regenerate the two registry payloads

1. `pnpm registry:build`
2. `git add public/r/changelog-section-v3.json public/r/changelog-section-v4.json`
3. Revert any other `public/r/*.json` the build touched (line-ending churn is
   common on Windows checkouts and unrelated):
   `git restore $(git diff --name-only -- public/r/ ':!public/r/changelog-section-v3.json' ':!public/r/changelog-section-v4.json')`
   (or `git restore` each unrelated file individually). Final `public/r/` diff:
   those two files only.
4. Confirm each of the two diffs is limited to the `content` string of
   `changelog-format.ts` — no reordered entries, no other file content.

**Verify**:
- `pnpm registry:validate` → all items valid
- `git status --porcelain public/r/` → only the two `changelog-section-v{3,4}.json`

### Step 5: Full verification

- `pnpm typecheck` → exit 0
- `pnpm lint` → exit 0, 16 warnings (unchanged)
- `pnpm test:run` → all pass; `tests/registry/changelog-format.test.ts` present
- `pnpm registry:validate` → all items valid
- `git diff --stat 088cc3e..HEAD` → only the in-scope paths

## Test plan

- New `tests/registry/changelog-format.test.ts` — a `describe.each` over the v3
  and v4 module copies covering: valid date formatting (3 dates incl. Jan/Dec
  boundaries), malformed-date fallback (5 bad inputs → returned unchanged), the
  1/2-name path, the `and 1 other` singular, the `and N others` plural,
  newest-first ordering, same-date merge + label.
- Model: `tests/templates/portfolio-v4/commands.test.ts`.
- No existing test changes.

## Done criteria

ALL must hold:

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm lint` exits 0; 16 warnings total, none new
- [ ] `pnpm test:run` exits 0; `tests/registry/changelog-format.test.ts` runs
      and every case passes (suite executes once per block)
- [ ] `pnpm registry:validate` → all items valid
- [ ] `diff` of the two blocks' `changelog-format.ts` produces no output (kept
      identical)
- [ ] `formatChangelogDate("2026/09/02")` returns `"2026/09/02"` (verify via the
      test, not by hand)
- [ ] `git status --porcelain public/r/` → only the two changelog JSON payloads
- [ ] `git diff --stat 088cc3e..HEAD` shows only in-scope paths
- [ ] `plans/README.md` row updated (unless a reviewer owns the index)

## STOP conditions

Stop and report if:

- The two `changelog-format.ts` copies are NOT identical at `088cc3e` (drift —
  the plan's "apply the same edit to both" assumption is void; report the diff).
- `pnpm registry:build` changes `public/r/*.json` beyond the `content` of
  `changelog-format.ts`, or leaves unrelated `public/r` files that won't revert
  cleanly.
- A test you wrote fails because the actual function output differs from what
  this plan predicts (e.g. `formatContributorNames` plural wording) — report the
  actual output; do not "fix" the function to match the test.
- Any verification fails twice after a reasonable fix attempt.

## Maintenance notes

- The `date` field stays typed `string`. Tightening it to a template-literal
  type (`` `${number}-${number}-${number}` ``) was considered and deferred: it
  gives weak safety (doesn't catch `2026-13-02`), and consumers paste real
  dates. The runtime guard is the right layer.
- If a future block reuses this formatter, extract it to a shared registry lib
  rather than a third copy — but note the shadcn copy-install model makes some
  cross-block duplication inherent, so a shared lib needs its own `registry:file`
  wiring. Not in scope here.
- Reviewer should confirm the guard returns the raw ISO on bad input (section
  stays rendered) rather than throwing.
