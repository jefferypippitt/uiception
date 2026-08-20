# Plan 024: Honor `prefers-reduced-motion` for lifeline scroll momentum in page mode

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat b7c12b8..HEAD -- registry/new-york/templates/portfolio-v3/components/lifeline/use-lifeline-scroll.ts`
> If that file changed since this plan was written, compare the "Current
> state" excerpt below against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug (accessibility)
- **Planned at**: commit `b7c12b8`, 2026-08-19

## Why this matters

`portfolio-v3` is an installable page template built around a "lifeline" —
a horizontally-scrubbed career timeline the visitor drives with wheel/drag
gestures, which then continues under momentum/inertia physics after the
gesture ends (`use-lifeline-scroll.ts`). The hook already reads
`prefers-reduced-motion` correctly in several places (the intro entrance
animation, the lightbox), but the momentum-start gate in `scrub()` only
respects it when the lifeline is running in **embedded** mode
(`isEmbedRef.current === true`). The lifeline's default and primary mode —
resolved by `resolveMode()` whenever the timeline covers roughly half the
viewport with no other scrollable ancestor, i.e. installed as a normal full
page — is **not** embedded. So a visitor with `prefers-reduced-motion: reduce`
set, viewing this template the way it's meant to be viewed, still gets
continuous RAF-driven inertia after every wheel/drag input. This repo has
fixed the identical class of bug twice before (Plan 017's theme-toggle
cooldown, Plan 018's `TestimonialShader` visibility+reduced-motion gate) —
this is the same shape of gap in the newest template.

## Current state

- `registry/new-york/templates/portfolio-v3/components/lifeline/use-lifeline-scroll.ts` —
  the scroll/gesture/momentum hook for the lifeline. Relevant excerpt
  (line numbers as of `b7c12b8`):

```ts
145:  const isEmbedRef = useRef(false)
...
147:  const prefersReducedMotionRef = useRef(false)
...
518:    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
519:    const onMotionChange = () => {
520:      prefersReducedMotionRef.current = motionQuery.matches
521:    }
522:    prefersReducedMotionRef.current = motionQuery.matches
523:    motionQuery.addEventListener("change", onMotionChange)
...
601:    const scrub = (movement: number, target: number) => {
602:      applyTranslate(target)
603:
604:      const impulse = (movement / WHEEL_VELOCITY_FRAME_MS) * 0.35
605:      dragVelocity.current =
606:        dragVelocity.current * (1 - WHEEL_MOMENTUM_BLEND) +
607:        impulse * WHEEL_MOMENTUM_BLEND
608:
609:      if (isEmbedRef.current && prefersReducedMotionRef.current) return
610:
611:      if (momentumId.current === 0) {
612:        startMomentum()
613:      }
614:    }
```

  Line 609 is the bug: the reduced-motion short-circuit is gated behind
  `isEmbedRef.current &&`, so it's a no-op in the template's default page
  mode. `applyTranslate(target)` on line 602 (the direct 1:1 gesture
  response, not momentum) is unaffected and should stay unaffected — reduced
  motion means no *extra* inertia after the gesture ends, not that the
  timeline stops responding to input at all. That matches how the rest of
  the codebase treats reduced motion (e.g. `usePrefersReducedMotion` in the
  theme toggles — see Plan 017/018 — disables the *animated* transition, not
  the underlying state change).

- Everywhere else in this same file and its sibling hooks, reduced motion is
  checked unconditionally (not gated behind embed mode) — e.g.
  `use-lifeline-intro.ts`'s `shouldPlay` and `lifeline-lightbox.tsx`'s
  animation gating, both confirmed correct in this round's audit. This
  plan's fix brings `scrub()`'s momentum gate in line with that existing
  pattern in the same codebase.

## Commands you will need

| Purpose   | Command                                                              | Expected on success |
|-----------|-----------------------------------------------------------------------|----------------------|
| Install   | `pnpm install`                                                       | exit 0               |
| Typecheck | `pnpm typecheck`                                                     | exit 0, no errors    |
| Tests     | `pnpm test:run`                                                      | all pass             |
| Lint      | `pnpm lint`                                                          | exit 0               |
| Full gate | `pnpm check`                                                         | exit 0 (registry:validate + lint + test:run + typecheck all pass) |

## Scope

**In scope** (the only file you should modify):
- `registry/new-york/templates/portfolio-v3/components/lifeline/use-lifeline-scroll.ts`

**Out of scope** (do NOT touch, even though they look related):
- `use-lifeline-intro.ts`, `use-lifeline-vertical-scroll.ts`, `lifeline-lightbox.tsx` — already correctly handle reduced motion, confirmed during this round's audit. No changes needed.
- Any change to `isEmbedRef`'s role elsewhere in the file (e.g. line 555's boundary-hit tracking) — that logic is unrelated to reduced motion and must not be touched.
- `resolveMode()` / mode-resolution logic — out of scope; this plan only changes what happens once mode is already known.

## Git workflow

- Branch: `advisor/024-lifeline-reduced-motion-page-mode`
- One commit for the fix. Message style: imperative, lowercase type prefix matches this repo's convention seen in `git log` (e.g. `fix(portfolio-v3): honor prefers-reduced-motion for lifeline momentum in page mode`).
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Remove the embed-only gate on the reduced-motion momentum check

In `use-lifeline-scroll.ts`, change line 609 from:

```ts
if (isEmbedRef.current && prefersReducedMotionRef.current) return
```

to:

```ts
if (prefersReducedMotionRef.current) return
```

This makes the momentum short-circuit apply whenever the visitor has
reduced motion enabled, regardless of embed/page mode, while leaving the
direct-manipulation `applyTranslate(target)` on line 602 untouched (still
runs unconditionally, so the lifeline still tracks the gesture 1:1 — it
just doesn't keep drifting afterward under reduced motion).

**Verify**: `grep -n "prefersReducedMotionRef.current) return" registry/new-york/templates/portfolio-v3/components/lifeline/use-lifeline-scroll.ts` → outputs exactly one line, `      if (prefersReducedMotionRef.current) return`, with no `isEmbedRef.current &&` prefix.

### Step 2: Typecheck and lint

**Verify**: `pnpm typecheck` → exit 0, no errors. `pnpm lint` → exit 0.

### Step 3: Run the full test suite

No existing test exercises this hook directly (it's DOM/gesture-driven,
not covered by the current Vitest setup — confirmed during this round's
audit: no `use-lifeline-scroll.test.ts` exists and none is required by this
plan). Run the full suite to confirm no regression elsewhere.

**Verify**: `pnpm test:run` → all tests pass, same pass count as on a clean
checkout of `b7c12b8` (no new failures).

## Test plan

No new automated test is required — this hook is DOM/gesture-event-driven
(`window.matchMedia`, wheel/pointer/touch listeners, `ResizeObserver`) with
no existing Vitest harness in this repo for that shape of code (jsdom
lacks real gesture/RAF-timing fidelity, and no other `lifeline/` hook has a
unit test for this reason — confirmed by the absence of any
`tests/templates/portfolio-v3/lifeline*` or `use-lifeline*.test.ts` file).
If a manual/browser verification tool is available in your environment,
smoke-test by opening the `portfolio-v3` preview, enabling
"Emulate CSS prefers-reduced-motion: reduce" in devtools, and confirming a
wheel-scroll no longer continues drifting after you stop scrolling. If no
browser automation tool is available, state that plainly in your report
rather than claiming it was verified.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm lint` exits 0
- [ ] `pnpm test:run` exits 0, no new failures vs. a clean `b7c12b8` checkout
- [ ] `grep -n "isEmbedRef.current && prefersReducedMotionRef.current" registry/new-york/templates/portfolio-v3/components/lifeline/use-lifeline-scroll.ts` returns no matches (the embed-gated form is gone)
- [ ] `grep -n "if (prefersReducedMotionRef.current) return" registry/new-york/templates/portfolio-v3/components/lifeline/use-lifeline-scroll.ts` returns exactly one match
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row for 024 updated

## STOP conditions

Stop and report back (do not improvise) if:

- Line 609 in the live file does not match the "Current state" excerpt above (the codebase has drifted since this plan was written) — re-locate the reduced-motion check inside `scrub()` and describe what changed before proceeding.
- Removing the `isEmbedRef.current &&` condition causes any existing test to fail — this would indicate a test somewhere depends on the buggy embed-gated behavior, which needs a human decision, not a workaround.
- You find that `isEmbedRef.current` is used for anything else inside the same `if` condition that this plan's excerpt didn't capture — re-read the surrounding 20 lines and report the discrepancy instead of guessing which part is safe to remove.

## Maintenance notes

- If `portfolio-v3`'s lifeline ever gains its own dedicated test file (e.g. a
  future plan adds `use-lifeline-scroll.test.ts` with a mocked
  `matchMedia`), add a case asserting momentum does not start when
  `prefers-reduced-motion: reduce` matches, in both embed and page mode.
- This is the third occurrence in this codebase of a reduced-motion check
  being scoped narrower than it should be (see Plans 017 and 018 in
  `plans/README.md`). Worth a note to the maintainer: when adding a new
  gesture/animation-heavy component, prefer checking
  `prefers-reduced-motion` unconditionally by default and narrowing the
  scope deliberately, rather than the reverse.
