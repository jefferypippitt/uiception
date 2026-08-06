# Plan 017: Restore anti-strobing cooldown and reduced-motion gate in both templates' theme toggles

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 8cdba30..HEAD -- components/theme-toggle.tsx registry/new-york/templates/portfolio-v1/components/theme-toggle.tsx registry/new-york/templates/portfolio-v2/components/theme-toggle.tsx`
> If any of these three files changed since this plan was written, re-read
> them and compare against the "Current state" excerpts below before
> proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug (accessibility)
- **Planned at**: commit `8cdba30`, 2026-08-06

## Why this matters

The host site's `components/theme-toggle.tsx` has two deliberate safety
mechanisms on its `d`-key theme-toggle shortcut: a 650ms cooldown that
ignores rapid re-triggers, and a check that skips the View Transition
animation entirely when the OS/browser requests reduced motion. The host's
own comment names the cooldown "Anti-epilepsy: ignore rapid re-triggers
until the previous transition settles."

Neither of the two installable templates (`portfolio-v1`, `portfolio-v2`,
under `registry/new-york/templates/`) has either safeguard. This matters
most for `portfolio-v2`, which — unlike `portfolio-v1` — actually uses
`document.startViewTransition` to animate the theme swap. Holding the `d`
key, a stuck keydown event, or an automation/assistive tool sending repeated
keydowns re-triggers a full-page view-transition flash on every keystroke,
with no debounce and no `prefers-reduced-motion` check anywhere in the file.
`portfolio-v1` doesn't use view transitions, so its gap is milder (redundant
`setTheme` calls per keypress), but it's the same missing safeguard,
inherited by every project that installs either template via the shadcn CLI.

This is the same class of fix as `plans/003-fix-reduced-motion-gap.md`
(Round 1, already merged) — a `prefers-reduced-motion` gap in this exact
theme/motion area — so the pattern and its resolution are already proven in
this repo.

## Current state

Three files matter here. Read all three before making any change.

**`components/theme-toggle.tsx`** (the host — already correct, this is the
pattern to port) — full current content, key parts:

```tsx
const TOGGLE_COOLDOWN_MS = 650

function prefersReducedMotion() {
    return (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
}

function useThemeToggleActions() {
    const { resolvedTheme, setTheme } = useTheme()
    const lastToggleAt = useRef<number>(0)

    const toggleTheme = useCallback(() => {
        // Anti-epilepsy: ignore rapid re-triggers until the previous transition settles.
        const now = Date.now()
        if (now - lastToggleAt.current < TOGGLE_COOLDOWN_MS) return
        lastToggleAt.current = now

        const flip = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
        const doc = document as VtDocument

        // Skip the view-transition entirely when the browser/OS requests reduced motion
        // (CSS sets animation:none but the VT snapshot+commit itself can still flash).
        if (!doc.startViewTransition || prefersReducedMotion()) return flip()

        const prevVt = stashBlocksCategoryTitleVt()
        document.documentElement.classList.add('theme-transitioning')
        doc.startViewTransition(flip).finished.finally(() => {
            document.documentElement.classList.remove('theme-transitioning')
            restoreBlocksCategoryTitleVt(prevVt)
        })
    }, [resolvedTheme, setTheme])

    return { toggleTheme }
}
```

Note: `stashBlocksCategoryTitleVt`/`restoreBlocksCategoryTitleVt` and the
`title-` view-transition-name juggling are **host-site-only** concerns (they
protect the `/blocks` category-morph animation) — do **not** port those into
either template. Only port `TOGGLE_COOLDOWN_MS`, `lastToggleAt`,
`prefersReducedMotion()`, and the cooldown/reduced-motion checks themselves.

**`registry/new-york/templates/portfolio-v1/components/theme-toggle.tsx`**
(no view transitions used, no cooldown, no reduced-motion check — full
current content, lines 34-56):

```tsx
export function ThemeKeyboardShortcut() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key !== "d" && event.key !== "D") return
      if (isEditableTarget(event.target)) return

      event.preventDefault()
      toggleTheme()
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [toggleTheme])

  return null
}
```

**`registry/new-york/templates/portfolio-v2/components/theme-toggle.tsx`**
(uses `startViewTransition` unconditionally — the higher-severity gap — full
current content, lines 39-49, 88-110):

```tsx
/** Canvas UI pattern: set theme inside flushSync (± view transition). */
function applyTheme(setTheme: (theme: string) => void, next: string) {
  const doc = document as VtDocument
  if (doc.startViewTransition) {
    doc.startViewTransition(() => {
      flushSync(() => setTheme(next))
    })
    return
  }
  setTheme(next)
}
// ...
export function ThemeKeyboardShortcut() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = useCallback(() => {
    applyTheme(setTheme, resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key !== "d" && event.key !== "D") return
      if (isEditableTarget(event.target)) return

      event.preventDefault()
      toggleTheme()
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [toggleTheme])

  return null
}
```

**Repo convention**: templates are self-contained registry items — they must
not import from the host's `components/theme-toggle.tsx` or from each other.
Each template gets its own copy of the cooldown constant and the
reduced-motion helper, adapted to its own file.

## Commands you will need

| Purpose   | Command                              | Expected on success |
|-----------|---------------------------------------|---------------------|
| Typecheck | `pnpm typecheck`                      | exit 0, no errors   |
| Tests     | `pnpm test:run`                       | all pass            |
| Lint      | `pnpm lint`                           | exit 0              |
| Registry  | `pnpm registry:validate`              | exit 0              |

## Scope

**In scope**:
- `registry/new-york/templates/portfolio-v1/components/theme-toggle.tsx`
- `registry/new-york/templates/portfolio-v2/components/theme-toggle.tsx`
- `tests/templates/portfolio-v1/theme-toggle.test.ts` (create)
- `tests/templates/portfolio-v2/theme-toggle.test.ts` (create)

**Out of scope**:
- `components/theme-toggle.tsx` (the host file) — already correct, do not touch.
- Anything related to `stashBlocksCategoryTitleVt`/category-title view
  transitions — host-only concern, do not port into templates.
- The `ThemeToggle` button component in either template (only
  `ThemeKeyboardShortcut`/`applyTheme`/`toggleTheme` need the guard — the
  click-driven button path is lower-frequency and not the reported hazard,
  though if you find the button also calls the same guarded function that's
  fine and expected).

## Git workflow

- Branch: `advisor/017-theme-toggle-strobe-safety-parity`
- Commit per template (two commits), message style: imperative, lowercase,
  matching repo convention (e.g. `git log --oneline` shows messages like
  "added new hero section and feature section").
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add the cooldown + reduced-motion guard to `portfolio-v1/components/theme-toggle.tsx`

Add near the top of the file (after imports):

```tsx
const TOGGLE_COOLDOWN_MS = 650

/** Returns true when the OS/browser has requested reduced motion. */
function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

/** Pure so it can be unit tested without a DOM. */
export function shouldAllowToggle(lastToggleAt: number, now: number): boolean {
  return now - lastToggleAt >= TOGGLE_COOLDOWN_MS
}
```

Then change `ThemeKeyboardShortcut` to track `lastToggleAt` in a ref and
gate `toggleTheme`:

```tsx
export function ThemeKeyboardShortcut() {
  const { resolvedTheme, setTheme } = useTheme()
  const lastToggleAt = useRef<number>(0)

  const toggleTheme = useCallback(() => {
    const now = Date.now()
    if (!shouldAllowToggle(lastToggleAt.current, now)) return
    lastToggleAt.current = now
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  useEffect(() => {
    // ...unchanged...
  }, [toggleTheme])

  return null
}
```

Add `useRef` to the existing `import { useCallback, useEffect } from "react"`
line. `portfolio-v1` doesn't use view transitions, so `prefersReducedMotion`
isn't load-bearing here for the keyboard shortcut itself — the cooldown is
the actual fix for this file. Still add the helper for parity with
`portfolio-v2` and because `pnpm lint` may flag an unused import if you add
it without using it — **only add `prefersReducedMotion` if you use it**; if
`portfolio-v1` has no view-transition path to gate, it's fine to add only
the cooldown guard and skip `prefersReducedMotion` in this file.

**Verify**: `pnpm typecheck` → exit 0, no errors in this file.

### Step 2: Add the cooldown + reduced-motion guard to `portfolio-v2/components/theme-toggle.tsx`

This is the higher-severity file — it actually calls
`doc.startViewTransition` unconditionally. Add the same
`TOGGLE_COOLDOWN_MS` constant and `prefersReducedMotion()` helper (this file
already has a `VtDocument` type — reuse it), then update `applyTheme` and
`ThemeKeyboardShortcut`:

```tsx
const TOGGLE_COOLDOWN_MS = 650

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

export function shouldAllowToggle(lastToggleAt: number, now: number): boolean {
  return now - lastToggleAt >= TOGGLE_COOLDOWN_MS
}

/** Canvas UI pattern: set theme inside flushSync (± view transition). */
function applyTheme(setTheme: (theme: string) => void, next: string) {
  const doc = document as VtDocument
  if (doc.startViewTransition && !prefersReducedMotion()) {
    doc.startViewTransition(() => {
      flushSync(() => setTheme(next))
    })
    return
  }
  setTheme(next)
}

export function ThemeKeyboardShortcut() {
  const { resolvedTheme, setTheme } = useTheme()
  const lastToggleAt = useRef<number>(0)

  const toggleTheme = useCallback(() => {
    const now = Date.now()
    if (!shouldAllowToggle(lastToggleAt.current, now)) return
    lastToggleAt.current = now
    applyTheme(setTheme, resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  useEffect(() => {
    // ...unchanged...
  }, [toggleTheme])

  return null
}
```

Add `useRef` to the existing React import. Note: the `ThemeToggle` button
component in this file also calls `applyTheme` directly via `onClick` — that
call site is unaffected by the cooldown (mouse clicks aren't the reported
hazard) but now automatically respects `prefers-reduced-motion` too, which
is a strict improvement, not a behavior change to guard against.

**Verify**: `pnpm typecheck` → exit 0, no errors in this file.

### Step 3: Add unit tests for the pure cooldown helper

The repo's `vitest.config.ts` runs in `environment: "node"` (no DOM/jsdom),
so `prefersReducedMotion()` (which touches `window.matchMedia`) cannot be
unit tested directly in this suite — that's a known limitation, not
something to work around by adding jsdom (out of scope for this plan). The
extracted `shouldAllowToggle` function has no DOM dependency and is fully
testable.

Create `tests/templates/portfolio-v1/theme-toggle.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { shouldAllowToggle } from "@/registry/new-york/templates/portfolio-v1/components/theme-toggle"

describe("shouldAllowToggle", () => {
  it("blocks a re-trigger inside the cooldown window", () => {
    expect(shouldAllowToggle(1000, 1000 + 649)).toBe(false)
  })

  it("allows a re-trigger once the cooldown window has elapsed", () => {
    expect(shouldAllowToggle(1000, 1000 + 650)).toBe(true)
  })

  it("allows the very first toggle (lastToggleAt = 0)", () => {
    expect(shouldAllowToggle(0, Date.now())).toBe(true)
  })
})
```

Create `tests/templates/portfolio-v2/theme-toggle.test.ts` with the same
three cases, importing from
`@/registry/new-york/templates/portfolio-v2/components/theme-toggle`.

Model these after `tests/wordle/score.test.ts` (pure-function unit tests, no
mocking, `describe`/`it`/`expect` from vitest).

**Verify**: `pnpm test:run` → all pass, including the 6 new tests (3 per file).

## Test plan

- New tests: `tests/templates/portfolio-v1/theme-toggle.test.ts` and
  `tests/templates/portfolio-v2/theme-toggle.test.ts`, each testing
  `shouldAllowToggle` for: blocked-inside-window, allowed-at-boundary,
  allowed-on-first-call.
- Structural pattern: `tests/wordle/score.test.ts` (plain pure-function
  tests, no setup/teardown needed).
- Verification: `pnpm test:run` → all pass, including 6 new tests.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm test:run` exits 0; the 6 new tests exist and pass
- [ ] `pnpm lint` exits 0
- [ ] `pnpm registry:validate` exits 0
- [ ] Both `registry/new-york/templates/portfolio-v1/components/theme-toggle.tsx`
      and `.../portfolio-v2/components/theme-toggle.tsx` export a
      `shouldAllowToggle` function and reference `TOGGLE_COOLDOWN_MS = 650`
      (`grep -n "shouldAllowToggle\|TOGGLE_COOLDOWN_MS" registry/new-york/templates/portfolio-v1/components/theme-toggle.tsx registry/new-york/templates/portfolio-v2/components/theme-toggle.tsx` returns matches in both files)
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The code at the cited locations doesn't match the excerpts above (drift
  since this plan was written).
- A step's verification fails twice after a reasonable fix attempt.
- The fix appears to require touching the host's `components/theme-toggle.tsx`.
- You discover `portfolio-v1` actually does use view transitions somewhere
  else in the file that this plan didn't account for — re-read the whole
  file before assuming the excerpt above is complete, and if it's not,
  stop and report the discrepancy rather than guessing at the right fix.

## Maintenance notes

- If a third template ships and reuses either theme-toggle pattern, port the
  same `TOGGLE_COOLDOWN_MS`/`shouldAllowToggle`/`prefersReducedMotion` trio
  into it at creation time rather than after the fact.
- A reviewer should manually smoke-test both templates' `d`-shortcut in a
  browser with "Emulate CSS prefers-reduced-motion: reduce" enabled in
  DevTools, confirming no view-transition flash occurs in `portfolio-v2`.
- No jsdom/DOM-level test coverage exists for the reduced-motion branch
  itself (only the cooldown math is unit tested) — this is a known,
  accepted gap per Step 3's reasoning, not an oversight.
