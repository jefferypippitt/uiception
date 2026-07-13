# Plan 009 (direction spike): Decide what to do about 17 empty registry categories on the browse page

> **Executor instructions**: This is a **design/spike plan**, not a
> build-everything plan — per the advisor process, direction findings get
> investigated and given a recommendation with options, not implemented
> wholesale. Follow the steps in order. Step 4 (the only code change in this
> plan) is small, reversible, and safe to do regardless of which longer-term
> option the maintainer eventually picks — it does not commit the project to
> any particular category-filling roadmap. Do not build out any of the 17
> empty categories with real blocks as part of this plan — that decision
> belongs to the maintainer, and each filled category is its own
> multi-block effort matching the size of the "Fix" work already done for
> populated categories.
>
> **Drift check (run first)**: `git diff --stat 8c219d4..HEAD -- lib/blocks.ts app/(site)/blocks`
> If either changed since this plan was written, re-run the counting command
> in "Current state" yourself before proceeding.

## Status

- **Priority**: P3 (direction — not ranked against the bug/security fixes in other plans)
- **Effort**: S (investigation + cosmetic fix) — filling categories is a separate, uncosted follow-up
- **Risk**: LOW
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `8c219d4`, 2026-07-09

## Why this matters

`lib/blocks.ts` declares 32 block categories in `BlockCategoryId`. 17 of them
have `versions: []` today (confirmed: `grep -c "versions: \[\]" lib/blocks.ts`
→ 17). Every category — empty or not — is a clickable tile on the flagship
`/blocks` "Explore All Categories" page (both the desktop periodic-table grid
in `app/(site)/blocks/page.tsx:113-139` and the mobile flat grid at
`:142-151`), rendered via `BlockPeriodicTile` (`app/(site)/blocks/block-periodic-tile.tsx`)
with no visual distinction for emptiness beyond a small numeric badge
(`{count}`, top-left corner, `block-periodic-tile.tsx:41-43`). Clicking
through to an empty category (`app/(site)/blocks/[category]/page.tsx:63-64`)
shows only "No blocks available yet." — a dead end.

This directly undercuts the site's own pitch ("browse sections on the
site... install with the CLI") for a first-time visitor exploring the
periodic-table grid, since more than half the taxonomy (17 of 32) currently
leads nowhere. Separately, the audit noted a release-cadence asymmetry: the
last 4 registry commits all deepened already-large categories (navbar → v9/
v10, feature-section → v10, brands → v8, cta → v5) while conversion-critical
thin categories (pricing at v1-v2, footer at v1-v3) and all 17 empty
categories received no commits in the visible recent history. That's a
weaker, more speculative signal (inferred from ~20 commits of history, not a
documented roadmap) — surface it as context for the maintainer's decision in
this spike, not as a separate finding to act on.

## Current state

### The 17 empty categories (`lib/blocks.ts`, grep for `versions: []`)

```
value-proposition   — "Messaging blocks that clarify outcomes, benefits, and differentiation."
case-study           — "Narrative sections with context, results, and proof points."
about-us             — (description not captured in the audit excerpt — read the live file for exact text)
resources
team
contact
blog
video
timeline
comparison
newsletter
waitlist
social-proof
partners
backgrounds
sidebar
banner
```
(17 total; re-run `grep -n "versions: \[\]" lib/blocks.ts` and read 3 lines
above each match for the exact id/title/description — the list above is
reconstructed from the audit and may not be complete/exactly ordered; verify
against the live file before using it in your report.)

### `app/(site)/blocks/[category]/page.tsx:63-64` — the dead end

```tsx
{categoryData.versions.length === 0 ? (
  <p className="mt-8 text-sm text-muted-foreground">No blocks available yet.</p>
) : (
  // ...renders BlockPreviewToolbar per version...
)}
```

### `app/(site)/blocks/block-periodic-tile.tsx:25-43` — the tile, no empty-state distinction

```tsx
const count = category.versions.length

return (
  <Link href={`/blocks/${category.id}`} /* ... */>
    <span className="pointer-events-none absolute left-1.5 top-1 font-mono text-[9px] tabular-nums">
      {count}
    </span>
    {/* ...symbol, title, count label... */}
  </Link>
)
```

Every tile — empty or not — renders identically apart from the small `{count}`
number. There's no `opacity`/`disabled`/badge treatment distinguishing "0
blocks, dead link" from "10 blocks, browse now."

### `README.md` ("Block structure" section) — the convention for filling a category cheaply

> Simple static blocks with no animation or sub-components stay as a single
> entry file — sub-folders are added once real complexity exists.

This means filling a thin category (e.g. `newsletter`, `banner`) with a v1
block doesn't require the full `components/`/`hooks/`/`lib/`/`styles/`
structure if the block is simple — lowering the cost of the "fill it in"
option relative to categories needing GSAP/animation work.

### `lib/block-periodic-layout.ts` — the periodic-table grid placement

Every category (including all 17 empty ones) has a fixed `row`/`col`/`symbol`
position in the periodic table layout (e.g. `newsletter` at row 4, col 10;
`banner` at row 6, col 3). Removing a category from the grid entirely (rather
than visually de-emphasizing it) would require re-deriving the grid layout —
a bigger, riskier change than a cosmetic tile treatment. This plan's Step 4
does not touch `lib/block-periodic-layout.ts`.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Confirm empty-category count | `grep -c "versions: \[\]" lib/blocks.ts` | `17` (or current count if drifted) |
| Typecheck (after Step 4's cosmetic change) | `pnpm typecheck` | exit 0 |
| Full check | `pnpm check` | exit 0 |

## Scope

**In scope**:
- Investigation and a written recommendation (Steps 1-3).
- `app/(site)/blocks/block-periodic-tile.tsx` — a small, purely cosmetic
  change in Step 4 to visually de-emphasize empty-category tiles (e.g. lower
  opacity, a "Coming soon" badge instead of/alongside the count). This is
  optional-but-recommended and reversible; do it only if your investigation
  in Steps 1-3 doesn't turn up a reason not to (see STOP conditions).

**Out of scope**:
- Building any actual block content for any of the 17 empty categories —
  that's a separate, much larger effort per category and is exactly what
  this spike is scoping, not doing.
- Removing categories from `lib/blocks.ts` or `lib/block-periodic-layout.ts`
  entirely — that's a bigger content-strategy decision (are these categories
  wrong, or just not-yet-filled?) that the investigation in Steps 1-3 should
  surface as a question for the maintainer, not decide unilaterally.
- Re-deriving the periodic-table grid layout to close gaps left by removed
  categories.
- Any change to the release-cadence pattern (which categories get the next
  block version) — that's a backlog-prioritization call for the maintainer,
  not something this plan can or should decide.

## Git workflow

- Branch: `advisor/009-empty-categories-spike`
- If Step 4's cosmetic change is made: one commit, e.g.
  `feat(blocks): de-emphasize empty category tiles on the browse page`
- The investigation report (Steps 1-3) is not a commit — write it into your
  final report and into the `plans/README.md` status update (see "Done
  criteria").
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Confirm the current empty-category list and their descriptions

```bash
grep -n "versions: \[\]" lib/blocks.ts
```

For each match, read the 3-4 lines above it (the `id`, `title`, and
`description` fields of that category block) and compile an accurate,
current list — don't rely solely on the reconstructed list in "Current
state" above, which may have drifted.

### Step 2: Assess each empty category's fill cost

For each of the 17, make a rough call using the README's "simple static
blocks stay as a single entry file" convention: which ones are plausibly
cheap (a text/icon layout with no animation — e.g. `newsletter` signup form,
`banner` announcement strip, `contact` info block) versus which need real
design/animation investment (e.g. `timeline`, `case-study` likely need
custom layout work comparable to `how-it-works-section`). You don't need to
build anything — just tag each as rough-cheap (S) / rough-involved (M/L) in
your report, so the maintainer can prioritize by cost as well as demand.

### Step 3: Write the recommendation

Produce a short written report (this can go directly into your final
response/the `plans/README.md` status row — no separate file needed) that
answers:

1. **Which 2-4 empty categories are the best candidates to fill first?**
   Base this on (a) rough fill cost from Step 2, and (b) plausible demand for
   a landing-page-section registry — e.g. `newsletter` and `banner` are
   common SaaS-site needs; `blog`/`video`/`team`/`contact` are also common.
   Don't recommend all 17 — recommend the highest-leverage 2-4.
2. **Should the remaining, harder-to-justify categories (`sidebar`,
   `backgrounds`, `partners`, `social-proof`, etc.) stay in the taxonomy, or
   should some be removed?** This is a real question, not rhetorical — some
   of these categories may not fit a "landing page sections" registry (per
   `README.md`'s own description: "Pre-built UI blocks for Next.js... hero
   sections, navbars, pricing tables, CTAs") at all. Flag which ones you
   think are questionable fits, but don't remove them — that's the
   maintainer's call.
3. **Should empty-category tiles look different from populated ones in the
   meantime?** Recommend yes/no with reasoning; if yes, proceed to Step 4.

### Step 4 (conditional on Step 3's recommendation): Cosmetic tile treatment

If you recommended visually de-emphasizing empty tiles, implement it in
`app/(site)/blocks/block-periodic-tile.tsx`. A minimal version — add a
conditional class and swap the count badge for a "Soon" label when
`count === 0`:

```tsx
const count = category.versions.length
const isEmpty = count === 0

return (
  <Link
    href={`/blocks/${category.id}`}
    style={style}
    className={cn(
      "group relative flex flex-col overflow-hidden bg-card text-left transition",
      isEmpty ? "opacity-50 hover:opacity-75" : "hover:bg-muted/40",
      periodic
        ? "border-r border-b border-border/60 min-h-28"
        : "rounded-lg border border-border shadow-sm min-h-24",
      className
    )}
  >
    <span className="pointer-events-none absolute left-1.5 top-1 font-mono text-[9px] tabular-nums">
      {isEmpty ? "—" : count}
    </span>
    {/* ...symbol/title unchanged... */}
    {!periodic && (
      <p className="mt-0.5 text-center font-mono text-[10px] text-muted-foreground/60 tabular-nums">
        {isEmpty ? "Coming soon" : `${count} ${count === 1 ? "block" : "blocks"}`}
      </p>
    )}
  </Link>
)
```

Keep the tile a real `<Link>` (don't disable navigation) — clicking through
still shows the existing "No blocks available yet." message, which is
accurate and fine; this step only signals *before* the click that there's
nothing there yet, so users aren't surprised.

**Verify**: `pnpm typecheck` → exit 0. Run `pnpm dev` and visually confirm
on `/blocks`: populated-category tiles look unchanged; empty-category tiles
are visibly dimmer with a "Coming soon" label instead of a "0" badge.

### Step 5: Full check

```bash
pnpm check
```

**Verify**: exit 0.

## Test plan

No new automated tests — this plan is primarily an investigation/report,
with an optional small cosmetic UI change in Step 4 that has no
component-render test infrastructure to hook into (consistent with the rest
of this repo). Verification is `pnpm typecheck`/`pnpm check` plus the manual
visual check in Step 4.

## Done criteria

- [ ] Current, accurate list of all empty categories compiled (Step 1)
- [ ] Each tagged with a rough fill-cost estimate (Step 2)
- [ ] Written recommendation covering all 3 questions in Step 3 delivered in
      the final report / `plans/README.md` status update
- [ ] If Step 4 was done: `pnpm typecheck` and `pnpm check` exit 0, and a
      manual visual check on `/blocks` confirms empty tiles are visually
      distinguished
- [ ] If Step 4 was done: only `block-periodic-tile.tsx` modified (`git status`)
- [ ] `plans/README.md` status row updated with the recommendation summary

## STOP conditions

- If the empty-category count or list has changed significantly since this
  plan was written (e.g. someone already filled several categories) — don't
  discard the plan, just redo Step 1-2 against current reality and note the
  discrepancy in your report.
- If Step 4's cosmetic change turns out to visually break the existing
  periodic-table grid layout in a way that's not a simple opacity/label
  tweak (e.g. the "Coming soon" label wraps and breaks the fixed tile height
  on `periodic` tiles) — stop and report rather than restructuring the grid
  layout to accommodate it; that would exceed this plan's intentionally
  small scope.

## Maintenance notes

- Whichever 2-4 categories the maintainer decides to fill first (per Step
  3's recommendation) should become their own separate plan(s) — each is
  comparable in scope to the block-authoring work already reflected in the
  registry's git history (a v1 block: entry file, possibly `lib/`+`styles/`,
  a `registry.json` entry, a `block-preview-by-version.tsx` entry, following
  the checklist implied by `README.md`'s "Block structure" section).
- If categories are ever removed from the taxonomy, `lib/block-periodic-layout.ts`'s
  grid placement (`row`/`col`) for every remaining category may need
  re-deriving to close the resulting gaps — flagged here so it isn't
  discovered as a surprise later.
