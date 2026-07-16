# Plan 013: Close the `font-pixel-*` blind spot in the font-portability test

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 059f954..HEAD -- tests/registry/registry-font-deps.test.ts tests/registry/registry-npm-deps.test.ts app/globals.css`
> If any of these changed since this plan was written, compare the "Current
> state" excerpts below against the live files before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `059f954`, 2026-07-15

## Why this matters

`tests/registry/registry-font-deps.test.ts` exists specifically to catch
registry blocks that reference a layout-only Tailwind font class (one backed
by a CSS variable defined in this site's own `app/globals.css`, e.g.
`--font-pixel-grid`) without importing the actual font — a bug that makes a
block look correct on uiception.com itself but silently falls back to a
default font for every consumer who installs it via `npx shadcn add`,
because their project has no such CSS variable.

The test has a blind spot: it explicitly excludes any class matching
`font-pixel-*` (`PACKAGE_FONT_PREFIX = ["font-pixel-"]`), on the documented
assumption that `registry-npm-deps.test.ts` already catches misuse of
package-based fonts like `geist/font/pixel`. That assumption is false —
`registry-npm-deps.test.ts` only checks that packages *actually imported* in
a file are declared as dependencies; it has no way to flag a Tailwind class
reference with **no import at all**, which is exactly the failure mode the
font-deps test is supposed to catch.

This is not a hypothetical gap. Commit `059f954` fixed exactly this bug in
`registry/new-york/blocks/how-it-works-section-v1/components/step-card.tsx`,
which previously used `className="font-pixel-grid ..."` with zero import of
`geist/font/pixel` anywhere in the file. Neither test would have caught a
repeat of that exact bug before this fix: `registry-font-deps` explicitly
skips `font-pixel-*`, and `registry-npm-deps` has nothing to check since
there's no import to validate. `app/globals.css` defines two more
layout-only pixel-font variables (`--font-pixel-square`,
`--font-pixel-circle`) that no block currently misuses — but if a future
block does, it ships silently with `pnpm test:run` green.

## Current state

- `tests/registry/registry-font-deps.test.ts` — the file to change.
- `tests/registry/registry-npm-deps.test.ts` — read-only reference; not
  modified by this plan, confirms the assumption above is false (its check
  is import-vs-declared-dependency only, lines 71–96, no mechanism to catch
  a used-but-unimported class).
- `app/globals.css:24-26` — the layout-only pixel font vars:
  ```css
  --font-pixel-square: var(--font-geist-pixel-square);
  --font-pixel-grid: var(--font-geist-pixel-grid);
  --font-pixel-circle: var(--font-geist-pixel-circle);
  ```
- `node_modules/geist/font/pixel/index.d.ts` confirms the matching npm
  package exports: `GeistPixelSquare`, `GeistPixelGrid`, `GeistPixelCircle`
  (plus `GeistPixelTriangle`/`GeistPixelLine`, unused in this repo today).
- Confirmed via `grep -rln "font-pixel-" registry/new-york/blocks` — **zero**
  files currently reference a raw `font-pixel-*` Tailwind class string (the
  one prior offender, `step-card.tsx`, now applies the font via
  `GeistPixelGrid.className` instead of a CSS class string, per `059f954`).
  This means the fix below changes zero currently-passing test outcomes —
  it only closes the gap for *future* misuse.

Current code — `tests/registry/registry-font-deps.test.ts:12-42`:

```ts
// Standard Tailwind font utilities — safe to use anywhere, no self-contained
// import needed. Everything else defined in globals.css @theme inline is
// layout-dependent and must be imported directly inside the block.
const TAILWIND_BUILTIN_FONTS = new Set(["font-sans", "font-mono", "font-serif"])

// Package-based fonts (e.g. geist/font/pixel) are caught by registry-npm-deps.
// These are safe as long as the package is declared — skip them here.
const PACKAGE_FONT_PREFIX = ["font-pixel-"]

/**
 * Parse globals.css and return every Tailwind font utility that comes from
 * a layout-defined CSS variable, e.g. --font-instrument-serif → font-instrument-serif
 */
function getLayoutFontClasses(): Set<string> {
  const css = readFileSync(join(root, "app/globals.css"), "utf8")

  // Extract the @theme inline block
  const themeMatch = css.match(/@theme\s+inline\s*\{([^}]+)\}/)
  if (!themeMatch) return new Set()

  const classes = new Set<string>()
  const varRe = /--font-([\w-]+)\s*:/g
  let m: RegExpExecArray | null
  while ((m = varRe.exec(themeMatch[1])) !== null) {
    const cls = `font-${m[1]}`
    if (TAILWIND_BUILTIN_FONTS.has(cls)) continue
    if (PACKAGE_FONT_PREFIX.some((p) => cls.startsWith(p))) continue
    classes.add(cls)
  }
  return classes
}

// Detects a self-contained font import (next/font/google or next/font/local)
const NEXT_FONT_IMPORT_RE = /from\s+["']next\/font\/(google|local)["']/
```

And the check that consumes `NEXT_FONT_IMPORT_RE` (lines 68-71, unchanged by
this plan, shown for context):

```ts
const hasSelfContainedImport = files.some((rel) =>
  NEXT_FONT_IMPORT_RE.test(readFileSync(join(root, rel), "utf8")),
)
```

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Run this test only | `pnpm vitest run tests/registry/registry-font-deps.test.ts` | 1 test file, all tests pass |
| Full test suite | `pnpm test:run` | all tests pass (18 files today) |
| Typecheck | `pnpm typecheck` | exit 0 |

## Scope

**In scope**:
- `tests/registry/registry-font-deps.test.ts` only.

**Out of scope**:
- `tests/registry/registry-npm-deps.test.ts` — do not modify; it's correctly
  scoped to its own narrower job (declared vs. imported packages) and
  doesn't need to change for this fix.
- Any registry block source file — no block currently has the bug this test
  closes the gap for for; this plan is test-only.
- Adding coverage for other font packages beyond `geist/font/pixel` — this
  repo currently only has one package-based font family in `globals.css`
  (the three `font-pixel-*` vars). Don't generalize beyond what's evidenced.

## Git workflow

- Branch: `advisor/013-fix-font-portability-test-blind-spot`
- Single commit, conventional-commit style matching repo history, e.g.:
  `test(registry): close font-pixel-* blind spot in font-portability check`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Remove the blanket `font-pixel-*` exclusion

Edit `tests/registry/registry-font-deps.test.ts`. Delete the
`PACKAGE_FONT_PREFIX` constant and its use inside `getLayoutFontClasses()`:

Remove:
```ts
// Package-based fonts (e.g. geist/font/pixel) are caught by registry-npm-deps.
// These are safe as long as the package is declared — skip them here.
const PACKAGE_FONT_PREFIX = ["font-pixel-"]
```

Remove this line from inside the `while` loop in `getLayoutFontClasses()`:
```ts
if (PACKAGE_FONT_PREFIX.some((p) => cls.startsWith(p))) continue
```

**Verify**: `grep -n "PACKAGE_FONT_PREFIX" tests/registry/registry-font-deps.test.ts` returns no matches.

### Step 2: Extend the self-contained-import check to recognize `geist/font/pixel`

Replace the `NEXT_FONT_IMPORT_RE` definition:

```ts
// Detects a self-contained font import (next/font/google or next/font/local)
const NEXT_FONT_IMPORT_RE = /from\s+["']next\/font\/(google|local)["']/
```

with:

```ts
// Detects a self-contained font import: next/font/google, next/font/local,
// or a package-based font (e.g. geist/font/pixel) — any of these satisfy
// the "this block owns its font, doesn't rely on the host site's globals.css" rule.
const NEXT_FONT_IMPORT_RE = /from\s+["'](next\/font\/(google|local)|geist\/font\/pixel)["']/
```

**Verify**: `grep -n "NEXT_FONT_IMPORT_RE" tests/registry/registry-font-deps.test.ts` shows the updated regex including `geist\/font\/pixel`.

### Step 3: Run the test and the full suite

```bash
pnpm vitest run tests/registry/registry-font-deps.test.ts
pnpm test:run
pnpm typecheck
```

**Verify**: both commands exit 0. Since no block currently uses a raw
`font-pixel-*` class string (confirmed in "Current state"), `layoutFontRe`
will not match anything and the test's assertion loop won't fire for any
file — the suite should be green with no behavior change today.

## Test plan

This plan modifies a test file directly, so "testing the test" means
proving it fails correctly when the bug shape it targets is reintroduced.
Do this by hand, then revert — do not commit a fixture reproducing the bug:

1. Temporarily edit `registry/new-york/blocks/how-it-works-section-v1/components/step-card.tsx`, changing `className={`${GeistPixelGrid.className} ...`}` back to `className="font-pixel-grid ..."` and removing the `import { GeistPixelGrid } from "geist/font/pixel"` line.
2. Run `pnpm vitest run tests/registry/registry-font-deps.test.ts` — **expect this to fail** with the assertion message referencing `font-pixel-grid` and "uses layout-only font class".
3. Revert the temporary edit (`git checkout -- registry/new-york/blocks/how-it-works-section-v1/components/step-card.tsx`) and re-run the test — confirm it passes again.

This confirms the fix actually closes the gap rather than just being inert.

## Done criteria

- [ ] `PACKAGE_FONT_PREFIX` no longer exists in `tests/registry/registry-font-deps.test.ts`
- [ ] `NEXT_FONT_IMPORT_RE` matches `geist/font/pixel` imports in addition to `next/font/google`/`next/font/local`
- [ ] `pnpm test:run` exits 0 (no regression — 18 test files, all passing, same as before this change)
- [ ] `pnpm typecheck` exits 0
- [ ] The manual regression check in "Test plan" above was performed and confirmed the test fails on the reintroduced bug, then reverted cleanly (`git status` shows no leftover changes to `step-card.tsx`)
- [ ] No files outside `tests/registry/registry-font-deps.test.ts` modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- The code at `registry-font-deps.test.ts` doesn't match the "Current state" excerpt (drifted since this plan was written) — re-read the file before proceeding.
- After Step 1–2, `pnpm test:run` fails on a file *other than* the manual regression check in "Test plan" — this would mean some block already relies on the excluded behavior in a way this plan didn't anticipate; STOP and report which file/block, don't fix it as part of this plan.
- The manual regression check in "Test plan" does NOT fail as expected — this would mean the fix doesn't actually close the gap; STOP and report rather than declaring done criteria met.

## Maintenance notes

- If a future PR adds a new package-based font family to `app/globals.css`'s
  `@theme inline` block (beyond `geist/font/pixel`), the corresponding
  self-contained-import package needs to be added to `NEXT_FONT_IMPORT_RE`
  in the same PR, or this test will silently exclude it the same way the
  original `PACKAGE_FONT_PREFIX` did. Consider a comment at the top of
  `app/globals.css`'s pixel-font block pointing back at this test file.
- This test only protects against the *unimported-class* failure mode.
  Broader render-level test coverage (does the font actually apply visually)
  remains a separate, larger, not-yet-planned gap.
