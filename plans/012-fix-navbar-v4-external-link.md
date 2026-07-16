# Plan 012: Fix `navbar-section-v4`'s external link so it actually navigates

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 059f954..HEAD -- registry/new-york/blocks/navbar-section-v4`
> If that file changed since this plan was written, compare the "Current
> state" excerpt below against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `059f954`, 2026-07-15

## Why this matters

`navbar-section-v4` is shipped as installable source via
`npx shadcn add https://uiception.com/r/navbar-section-v4.json`. Its nav item
marked `external: true` ("Docs") is rendered as an `<a target="_blank"
rel="noreferrer">`, but the shared `handleClick` handler calls
`e.preventDefault()` unconditionally for every nav item, including the
external one. In the shipped demo this is invisible — the demo uses
`href="#"` placeholders, so nobody notices a `#` link failing to navigate.
The bug only surfaces once a real consumer installs the block and points
`href` at a real URL: clicking "Docs" updates local `activeIndex` state but
never opens the link, in a new tab or otherwise. This is a silent behavior
regression at the exact moment the block is used for its intended purpose.

Three sibling blocks (`navbar-section-v2`, `-v5`, `-v7`) already handle this
correctly by branching on `item.external` inside the click handler — this
plan brings `navbar-section-v4` in line with that established, working
pattern.

## Current state

- `registry/new-york/blocks/navbar-section-v4/components/navbar-section-v4.tsx` — the only file in this block; single-file block, no `components/`/`hooks/` subfolders (this block renders no local image/video asset, so it was never part of the `-root.tsx` media-resolution split other navbar versions went through — that split is unrelated to this bug, don't attempt it here).

Current code (lines 50–70):

```tsx
{NAV_ITEMS.map((item, i) => {
  const shared = cn(linkClass, item.signInSpacing && "ml-1 sm:ml-2")
  const handleClick = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setActiveIndex(i)
  }
  if (item.external) {
    return (
      <a
        key={item.label}
        aria-current={activeIndex === i ? "page" : undefined}
        className={shared}
        href={item.href}
        rel="noreferrer"
        target="_blank"
        onClick={handleClick}
      >
        {item.label}
      </a>
    )
  }
  return (
    <a
      key={item.label}
      aria-current={activeIndex === i ? "page" : undefined}
      className={shared}
      href={item.href}
      onClick={handleClick}
    >
      {item.label}
    </a>
  )
})}
```

`handleClick` is shared between both branches (external and non-external)
and always calls `e.preventDefault()` — so the external `<a target="_blank">`
never actually opens.

**The established, correct pattern** — `registry/new-york/blocks/navbar-section-v2/components/navbar-section-v2-root.tsx:296-298`:

```tsx
onClick={(e) => {
  if (!external) e.preventDefault()
}}
```

`navbar-section-v5-root.tsx:93-95` and `navbar-section-v7-root.tsx:174-179`
use the same `if (!external) e.preventDefault()` guard. Match this pattern.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `pnpm typecheck` | exit 0, no errors |
| Lint | `pnpm lint` | exit 0 |
| Registry validate | `pnpm registry:validate` | exit 0, all items valid |
| Full check | `pnpm check` | exit 0 |

## Scope

**In scope**:
- `registry/new-york/blocks/navbar-section-v4/components/navbar-section-v4.tsx`

**Out of scope**:
- `navbar-section-v9` — also lacks the `-root.tsx` split, but has no `external`
  nav items at all (confirmed: its `NAV_ITEMS` array has no `external: true`
  entries), so it does not share this bug. Do not touch it as part of this
  plan.
- The `-root.tsx` split other navbar versions went through (media-resolution
  refactor, unrelated to this bug) — do not apply it to `v4` here.
- `registry.json` / `public/r/navbar-section-v4.json` — these are regenerated
  by `pnpm registry:build`, not hand-edited; running `pnpm check` (which
  calls `registry:validate`, not `registry:build`) is sufficient verification
  for this change. If you do run `pnpm build` as an extra check, that's fine,
  but it is not required for this plan's done criteria.

## Git workflow

- Branch: `advisor/012-fix-navbar-v4-external-link`
- Single commit, conventional-commit style matching repo history, e.g.:
  `fix(navbar-section-v4): honor target=_blank on the external nav link`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Fix `handleClick` to skip `preventDefault()` for external items

Edit `registry/new-york/blocks/navbar-section-v4/components/navbar-section-v4.tsx`.
Change the shared `handleClick` closure so it only calls `preventDefault()`
when the item is not external:

```tsx
const handleClick = (e: { preventDefault: () => void }) => {
  if (!item.external) e.preventDefault()
  setActiveIndex(i)
}
```

(`item` and `i` are already in scope inside the `.map()` callback — no new
parameters needed.)

**Verify**: `grep -n "preventDefault" registry/new-york/blocks/navbar-section-v4/components/navbar-section-v4.tsx` shows the guarded call `if (!item.external) e.preventDefault()`, not a bare `e.preventDefault()`.

### Step 2: Typecheck, lint, registry validate

```bash
pnpm typecheck
pnpm lint
pnpm registry:validate
```

**Verify**: all three exit 0. The `handleClick` type signature (`(e: { preventDefault: () => void }) => void`) doesn't change, so no type errors are expected.

### Step 3: Manual smoke check

This block has no automated render/interaction test coverage (see Test plan
below) — verify by hand:

```bash
pnpm dev
```

Visit `/view/navbar-section-v4` (the isolated preview route). Open browser
devtools, temporarily edit the "Docs" item's `href` in React DevTools (or
just confirm visually that clicking it still updates the active-tab
underline as before), and click it — confirm a new tab attempts to open
(even though `href="#"` in the demo won't navigate anywhere meaningful, the
browser should still attempt to open a new tab/window rather than doing
nothing). Stop the dev server when done.

## Test plan

This repo currently has zero render/interaction-level test coverage for
registry blocks (`tests/registry/*.test.ts` only covers registry-manifest
consistency, not component behavior) and the Vitest environment is
configured as `"node"` (see `vitest.config.ts`), with no `jsdom` or
`@testing-library/react` installed. Adding real interaction-test
infrastructure is out of scope for this one-line fix — it's the same
underlying gap as the previously-identified "no render-smoke coverage across
registry blocks" finding, which is a separate, larger effort. Do not install
new test dependencies as part of this plan; rely on the manual smoke check
in Step 3 plus the existing static checks (typecheck/lint/registry-validate).

## Done criteria

- [ ] `handleClick` in `navbar-section-v4.tsx` only calls `preventDefault()` when `!item.external`
- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm lint` exits 0
- [ ] `pnpm registry:validate` exits 0
- [ ] Manual smoke check in Step 3 confirms the external link attempts to open a new tab
- [ ] No files outside `registry/new-york/blocks/navbar-section-v4/components/navbar-section-v4.tsx` modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- The code at `navbar-section-v4.tsx` doesn't match the "Current state" excerpt above (drifted since this plan was written) — re-read the file and confirm the same bug shape still exists before proceeding.
- `handleClick`'s signature or the `NAV_ITEMS`/`external` field shape has changed in a way that makes the one-line guard not apply cleanly.
- Fixing this reveals a similar `preventDefault()` bug in another block not listed in this plan's scope — do not fix it here; report it separately instead of expanding scope.

## Maintenance notes

- If a future refactor gives `navbar-section-v4` the `-root.tsx` split (e.g.
  because it later adds a local image/logo asset), carry this fix forward —
  don't let a copy-paste from an older reference reintroduce the bug.
- The broader gap this plan works around (no automated coverage for
  click/interaction behavior across any of the 82 registry blocks) remains
  open. A future dedicated plan should scope adding `jsdom` +
  `@testing-library/react` and a narrow smoke-test pattern (render each
  block, assert no throw; skip a documented exclusion list for
  GSAP/canvas/shader-heavy blocks) — do not attempt that here.
