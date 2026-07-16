# Plan 014: Lazy-load the remaining homepage terminal mini-games

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 059f954..HEAD -- components/cursor-terminal.tsx`
> If that file changed since this plan was written, compare the "Current
> state" excerpt below against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `059f954`, 2026-07-15

## Why this matters

`components/cursor-terminal.tsx` backs the interactive terminal widget on
the homepage (`app/(site)/page.tsx`) — the site's highest-traffic surface.
It embeds five mini-games behind click-to-reveal tabs (`PANEL_TABS`), only
one of which (`Terminal`) is shown by default. One game, Wordle, is already
lazy-loaded via `next/dynamic`:

```tsx
const Wordle = dynamic(() => import("./wordle"), { ssr: false })
```

The other four — `TrexRunner`, `ReactionTime`, `ColorMemory`,
`SequenceMemory` — are still plain static imports in the same file, and
`CursorTerminal` itself is statically imported on the homepage. That means
their source (verified sizes: `trex-runner.tsx` 15,012B + `reaction-time.tsx`
10,585B + `color-memory.tsx` 27,609B + `sequence-memory.tsx` 9,188B ≈ 61KB)
plus their exclusive sound-effect data (`click-8bit.ts`, `click-soft.ts`,
`drop-003.ts`, `error-008.ts`, `fish-reel-in.ts`, `select-008.ts`,
`u-escape-screen-open.ts` ≈ 38.5KB, some shared between games) — roughly
**100KB of uncompressed source** — ships in the homepage's initial JS
regardless of whether a visitor ever clicks past the default "Terminal" tab.
The fix is mechanically identical to what's already shipped and working for
Wordle in this exact file.

## Current state

- `components/cursor-terminal.tsx` — the only file to change.

Current imports (lines 27-32):

```tsx
import dynamic from "next/dynamic"
import TrexRunner from "./trex-runner"
const Wordle = dynamic(() => import("./wordle"), { ssr: false })
import ReactionTime from "./reaction-time"
import ColorMemory from "./color-memory"
import SequenceMemory from "./sequence-memory"
```

Usage — all four are rendered with no props, purely conditionally by tab
(lines 202-210):

```tsx
{activeTab === "Trex Runner" ? (
  <TrexRunner />
) : activeTab === "Reaction Time" ? (
  <ReactionTime />
) : activeTab === "Color Memory" ? (
  <ColorMemory />
) : activeTab === "Sequence Memory" ? (
  <SequenceMemory />
) : activeTab !== "Wordle" ? (
  ...terminal body...
) : null}
```

Unlike Wordle (which stays mounted across tab switches — see the comment at
line 197, "Wordle stays mounted to avoid re-firing the submit-gate server
action on every tab switch"), these four games are NOT kept mounted; they
unmount/remount naturally via the ternary above. This means no `isActive`
prop or mount-persistence logic is needed for this fix — it's a direct,
simpler swap than Wordle's.

Confirmed (via `grep`) none of the four games' `window`/`document` usage
happens at module-eval or render time — all of it is inside `useEffect`
callbacks or event handlers, so `{ ssr: false }` is a safety/consistency
choice matching the established Wordle pattern, not a requirement to avoid
an SSR crash.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `pnpm typecheck` | exit 0, no errors |
| Lint | `pnpm lint` | exit 0 |
| Full check | `pnpm check` | exit 0 |

## Scope

**In scope**:
- `components/cursor-terminal.tsx` only — convert the four static imports to `dynamic()`.

**Out of scope**:
- `components/wordle.tsx` and its existing `dynamic()` wrapper — already correct, don't touch.
- `components/trex-runner.tsx`, `reaction-time.tsx`, `color-memory.tsx`, `sequence-memory.tsx` — no internal changes needed; this is a call-site-only fix.
- `registry/new-york/blocks/cursor-terminal/**` — the *installable registry block* is a separate copy of the terminal UI from this homepage widget (`components/cursor-terminal.tsx` is the homepage's own bespoke component, not the registry block itself). Do not modify the registry block as part of this plan; it's out of scope and wasn't the subject of this finding.
- Plan 005 already lazy-loaded block *preview iframes* on category pages — unrelated surface, don't re-touch it here.

## Git workflow

- Branch: `advisor/014-lazy-load-homepage-terminal-games`
- Single commit, conventional-commit style matching repo history, e.g.:
  `perf(homepage): lazy-load remaining terminal mini-games`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Convert the four static imports to `next/dynamic`

Edit `components/cursor-terminal.tsx`. Replace:

```tsx
import dynamic from "next/dynamic"
import TrexRunner from "./trex-runner"
const Wordle = dynamic(() => import("./wordle"), { ssr: false })
import ReactionTime from "./reaction-time"
import ColorMemory from "./color-memory"
import SequenceMemory from "./sequence-memory"
```

with:

```tsx
import dynamic from "next/dynamic"
const TrexRunner = dynamic(() => import("./trex-runner"), { ssr: false })
const Wordle = dynamic(() => import("./wordle"), { ssr: false })
const ReactionTime = dynamic(() => import("./reaction-time"), { ssr: false })
const ColorMemory = dynamic(() => import("./color-memory"), { ssr: false })
const SequenceMemory = dynamic(() => import("./sequence-memory"), { ssr: false })
```

(Keep them in this order, grouped together, for readability — matches the
existing Wordle line's position.)

**Verify**: `grep -n "^import TrexRunner\|^import ReactionTime\|^import ColorMemory\|^import SequenceMemory" components/cursor-terminal.tsx` returns no matches (all four converted from static `import` statements to `dynamic()` assignments).

### Step 2: Typecheck and lint

```bash
pnpm typecheck
pnpm lint
```

**Verify**: both exit 0. Since all four components take no props and are used identically to how `Wordle` is already used elsewhere in the same file, no type errors are expected.

### Step 3: Manual smoke check

```bash
pnpm dev
```

Visit `/` (homepage), scroll to the terminal widget, and click through all
six tabs: `Terminal`, `Trex Runner`, `Wordle`, `Reaction Time`, `Color
Memory`, `Sequence Memory`. Confirm each renders correctly with no console
errors, and that switching away from and back to a tab still works (games
should reset/remount as before — this is unchanged behavior, just loaded
on-demand now). Open browser devtools Network tab, reload the page, and
confirm no requests for the four games' chunk files fire until you click
their tab. Stop the dev server when done.

## Test plan

No new automated tests — this repo has no render-level test coverage for
homepage components (Vitest is configured `environment: "node"`, no
`jsdom`/`@testing-library/react` installed), consistent with the existing
gap already noted for registry blocks. The manual smoke check in Step 3 is
the verification for this plan. `pnpm test:run` (existing suite) must still
pass as a regression guard, since it's part of `pnpm check`.

## Done criteria

- [ ] `TrexRunner`, `ReactionTime`, `ColorMemory`, `SequenceMemory` are all `next/dynamic` with `{ ssr: false }` in `components/cursor-terminal.tsx`, matching the existing `Wordle` pattern
- [ ] `pnpm check` exits 0
- [ ] Manual smoke check in Step 3 confirms all six tabs render correctly and the four games' code only loads on tab click (verified in Network tab)
- [ ] No files outside `components/cursor-terminal.tsx` modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- The code at `components/cursor-terminal.tsx` doesn't match the "Current state" excerpt (drifted since this plan was written) — re-read the file before proceeding.
- Any of the four games turns out to rely on being present in the DOM before its tab is first clicked (e.g. some other component reaches into it via a ref before mount) — grep for cross-references to `TrexRunner`/`ReactionTime`/`ColorMemory`/`SequenceMemory` outside this file before starting; none were found during planning, but if you find one, STOP and report rather than restructuring around it.
- The manual smoke check shows a visible loading flicker or layout shift severe enough to be a UX regression — report it; a brief one-frame chunk-load delay on first tab click is expected and acceptable, a persistent broken/blank state is not.

## Maintenance notes

- If a sixth game is ever added to `PANEL_TABS`, add it using the same
  `dynamic(() => import(...), { ssr: false })` pattern from the start rather
  than a static import, to avoid reintroducing this same finding.
- This plan doesn't touch the *initial* `CursorTerminal` component's own
  weight (terminal animation logic, sound engine, icons) — only the four
  games nested inside it. `CursorTerminal` itself is still statically
  imported on the homepage; that's a separate, larger surface not scoped
  here.
