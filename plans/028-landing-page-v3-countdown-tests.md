# Plan 028: Add unit tests for `landing-page-v3`'s countdown math

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat b7c12b8..HEAD -- registry/new-york/templates/landing-page-v3/lib/countdown.ts`
> If that file changed since this plan was written, compare the "Current
> state" excerpt below against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `b7c12b8`, 2026-08-19

## Why this matters

`landing-page-v3`'s flagship feature is an animated "split-flap" countdown
board driven by `remainingParts()` and `padDigits()` in `lib/countdown.ts` —
the one piece of real date-diff business logic in the template, everything
else being layout/formatting. `tests/templates/landing-page-v3/board.test.ts`
(404 lines) already thoroughly covers the *layout* logic (`layoutBoard`,
`padBoard`, `fitBoardFrame`) and even imports the `CountdownParts` *type*
from `countdown.ts` — but every test in that file builds `CountdownParts`
fixture objects by hand; none of them calls `remainingParts()` or
`padDigits()` themselves. The arithmetic that actually turns "now" and a
target date into the digits the visitor sees is untested, including the
zero-clamp behavior for an already-passed target — a wrong digit here is
directly visible on the template's core, most-scrutinized feature.

## Current state

- `registry/new-york/templates/landing-page-v3/lib/countdown.ts` (full
  file, 27 lines, as of `b7c12b8`):
  ```ts
  export type CountdownParts = {
    days: number
    hours: number
    minutes: number
    seconds: number
  }

  const MS_PER_SECOND = 1000
  const MS_PER_MINUTE = 60 * MS_PER_SECOND
  const MS_PER_HOUR = 60 * MS_PER_MINUTE
  const MS_PER_DAY = 24 * MS_PER_HOUR

  export function remainingParts(target: Date | string, now: Date): CountdownParts {
    const end = typeof target === "string" ? new Date(target) : target
    const diff = Math.max(0, end.getTime() - now.getTime())

    const days = Math.floor(diff / MS_PER_DAY)
    const hours = Math.floor((diff % MS_PER_DAY) / MS_PER_HOUR)
    const minutes = Math.floor((diff % MS_PER_HOUR) / MS_PER_MINUTE)
    const seconds = Math.floor((diff % MS_PER_MINUTE) / MS_PER_SECOND)

    return { days, hours, minutes, seconds }
  }

  export function padDigits(value: number, width = 2): string {
    return String(Math.max(0, Math.floor(value))).padStart(width, "0")
  }
  ```
  Both functions are pure (no I/O, no module-level state) — `remainingParts`
  takes `now` as an explicit parameter rather than reading `Date.now()`
  internally, so tests need no clock mocking.

- `tests/templates/landing-page-v3/board.test.ts:1-20` (imports, for
  pattern reference — do not modify this file):
  ```ts
  import { describe, expect, it } from "vitest"
  import {
    layoutBoard,
    padBoard,
    fitBoardFrame,
  } from "@/registry/new-york/templates/landing-page-v3/lib/board"
  import type { CountdownParts } from "@/registry/new-york/templates/landing-page-v3/lib/countdown"
  ```
  This confirms the same `@/registry/new-york/templates/landing-page-v3/lib/...`
  import-alias pattern works for this template; use it for `countdown.ts`
  too.

## Commands you will need

| Purpose   | Command                                                                                | Expected on success |
|-----------|-------------------------------------------------------------------------------------------|----------------------|
| Install   | `pnpm install`                                                                             | exit 0               |
| Run test  | `pnpm vitest run tests/templates/landing-page-v3/countdown.test.ts`                       | all new tests pass   |
| Typecheck | `pnpm typecheck`                                                                           | exit 0               |
| Full gate | `pnpm check`                                                                               | exit 0               |

## Scope

**In scope** (the only file you should create):
- `tests/templates/landing-page-v3/countdown.test.ts` (new file)

**Out of scope** (do NOT touch, even though they look related):
- `registry/new-york/templates/landing-page-v3/lib/countdown.ts` — test-only
  plan; do not modify the implementation, even for a cleanup.
- `tests/templates/landing-page-v3/board.test.ts` — already thorough for
  its own scope (layout), do not add countdown-arithmetic cases to it; keep
  them in the new file so each file's responsibility stays clear.

## Git workflow

- Branch: `advisor/028-landing-page-v3-countdown-tests`
- One commit. Message style matches this repo's convention (e.g.
  `test(landing-page-v3): cover countdown date-diff arithmetic`).
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create the test file

Create `tests/templates/landing-page-v3/countdown.test.ts`, importing both
functions from `@/registry/new-york/templates/landing-page-v3/lib/countdown`.

Cover these cases for `remainingParts`, using fixed `Date` objects (no
`Date.now()`, no fake timers needed — construct explicit `now`/`target`
pairs):
1. Exact boundary: target is exactly 2 days, 3 hours, 4 minutes, 5 seconds
   after `now` → `{ days: 2, hours: 3, minutes: 4, seconds: 5 }`.
2. Just under a day: target is 23h 59m 59s after `now` → `{ days: 0, hours: 23, minutes: 59, seconds: 59 }`.
3. Day rollover: target is exactly 24 hours after `now` → `{ days: 1, hours: 0, minutes: 0, seconds: 0 }`.
4. Target equals `now` → `{ days: 0, hours: 0, minutes: 0, seconds: 0 }`.
5. Target is in the past (before `now`) → clamps to `{ days: 0, hours: 0, minutes: 0, seconds: 0 }`, not negative numbers.
6. `target` passed as a string (e.g. an ISO date string) instead of a `Date` → parses correctly, same result shape as the equivalent `Date` object input.

Cover these cases for `padDigits`:
7. `padDigits(5)` → `"05"` (default width 2).
8. `padDigits(42)` → `"42"` (no truncation when already at width).
9. `padDigits(5, 3)` → `"005"` (custom width).
10. `padDigits(-3)` → `"00"` (clamps negative to zero — matches the `Math.max(0, ...)` in the implementation).

**Verify**: `pnpm vitest run tests/templates/landing-page-v3/countdown.test.ts` → 10 tests, all pass.

### Step 2: Typecheck and full gate

**Verify**: `pnpm typecheck` → exit 0. `pnpm check` → exit 0 (registry:validate + lint + test:run + typecheck all pass, total test count increases by 10 over a clean `b7c12b8` checkout).

## Test plan

Covered fully in Step 1 above — this plan's entire deliverable is the test
file itself. No production code changes accompany it.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `tests/templates/landing-page-v3/countdown.test.ts` exists
- [ ] `pnpm vitest run tests/templates/landing-page-v3/countdown.test.ts` exits 0, exactly 10 tests pass
- [ ] `pnpm check` exits 0
- [ ] No files outside `tests/templates/landing-page-v3/countdown.test.ts` are modified or created (`git status`)
- [ ] `plans/README.md` status row for 028 updated

## STOP conditions

Stop and report back (do not improvise) if:

- `remainingParts`/`padDigits`'s implementation doesn't match the "Current
  state" excerpt above (the codebase has drifted) — re-read the live file
  and adjust expected values to match the actual arithmetic, but if the
  function signatures themselves changed, stop and report instead of
  guessing the new contract.

## Maintenance notes

- If `remainingParts` ever gains a different rollover unit (e.g. months/
  years for a long-range countdown), extend this file's boundary-case list
  rather than assuming the existing day/hour/minute/second cases still
  cover the new behavior.
