# Plan 006: Add unit tests for Wordle scoring, date/puzzle-number math, and the server action

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 8c219d4..HEAD -- lib/wordle vitest.config.ts`
> If any of these changed since this plan was written, compare the excerpts
> below against the live files before proceeding; on a mismatch, treat it as
> a STOP condition.
>
> **Read this before starting**: Step 1 below fixes a real import hazard you
> will hit immediately if you skip it — `lib/wordle/words.ts` and
> `lib/wordle/answer.ts` both do `import "server-only"`, and that package's
> `index.js` **unconditionally throws** when resolved outside a
> `react-server`-conditioned bundler (confirmed by direct test — see "Current
> state"). Do Step 1 first or every test touching `submitWordleGuess` /
> `solutionForPuzzleNumber` will crash at import time, not at assertion time.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none (pairs well with Plan 002 — CI — so these tests are enforced automatically once both land, but neither blocks the other)
- **Category**: tests
- **Planned at**: commit `8c219d4`, 2026-07-09

## Why this matters

This is a static/content-driven UI registry with almost no runtime business
logic — except the Wordle mini-game. `lib/wordle/score.ts` (duplicate-letter-
aware guess scoring), `lib/wordle/daily.ts` (timezone-aware day-key and
puzzle-number computation, including a binary search for a calendar-day UTC
boundary), and `lib/wordle/actions.ts` (the only Next.js Server Action in the
repo — validates guess format, row bounds, dictionary membership, and puzzle-
number bounds before revealing the solution on loss) are the one place in
this codebase where a subtle bug ships silently: `pnpm check` only validates
registry metadata today (see `tests/registry/*.test.ts`), so none of this
logic is exercised by CI. An off-by-one in the timezone binary search or a
duplicate-letter scoring bug would never fail a check.

## Current state

### `lib/wordle/score.ts` (full file, 36 lines) — pure function, no imports beyond nothing external

```ts
export type WordleTileResult = "correct" | "present" | "absent"

const COLS = 5

export function scoreGuess(
  guess: string,
  solution: string
): WordleTileResult[] {
  const out: WordleTileResult[] = Array.from({ length: COLS }, () => "absent")
  const remaining = new Map<string, number>()

  for (const char of solution) {
    remaining.set(char, (remaining.get(char) ?? 0) + 1)
  }

  for (let i = 0; i < COLS; i++) {
    if (guess[i] === solution[i]) {
      out[i] = "correct"
      const char = guess[i]!
      remaining.set(char, (remaining.get(char) ?? 1) - 1)
    }
  }

  for (let i = 0; i < COLS; i++) {
    if (out[i] === "correct") continue

    const char = guess[i]!
    const count = remaining.get(char) ?? 0
    if (count > 0) {
      out[i] = "present"
      remaining.set(char, count - 1)
    }
  }

  return out
}
```

### `lib/wordle/daily.ts` (full file, 152 lines) — pure functions, no "server-only" import; safe to import directly

Key exports for this plan: `normalizeWordleTimeZone`, `dayKeyForTimeZone`,
`dailyPuzzleNumberForTimeZone`, `nextDailyPuzzleBoundaryUtcMs`,
`WORDLE_DAILY_EPOCH_DATE` (= `new Date(Date.UTC(2021, 5, 19))`,
i.e. 2021-06-19T00:00:00Z), `WORDLE_FALLBACK_TIME_ZONE` (= `"UTC"`).

The riskiest function is `startOfCalendarDayUtcMs` (internal, not exported —
tested indirectly through `nextDailyPuzzleBoundaryUtcMs`): it binary-searches
for the exact UTC millisecond boundary at which a given IANA time zone's
calendar date rolls over, expanding a `[before, after]` window outward first,
then bisecting. This is the kind of logic that's easy to get subtly wrong on
a future edit and hard to eyeball-verify — hence prioritizing it here.

### `lib/wordle/actions.ts` (full file, 61 lines) — the only Server Action in the repo

```ts
"use server"

import { solutionForPuzzleNumber } from "@/lib/wordle/answer"
import { dailyPuzzleNumberForTimeZone } from "@/lib/wordle/daily"
import { scoreGuess, type WordleTileResult } from "@/lib/wordle/score"
import { ALLOWED_GUESSES } from "@/lib/wordle/words"

export type WordleGuessActionResult =
  | {
      ok: true
      scores: WordleTileResult[]
      won: boolean
      lost: boolean
      answer?: string
    }
  | {
      ok: false
      error: "bad_guess" | "bad_row" | "not_in_list" | "bad_puzzle"
    }

export async function submitWordleGuess(
  guess: string,
  row: number,
  puzzleNumber?: number,
  timeZone?: string
): Promise<WordleGuessActionResult> {
  const guessRaw = typeof guess === "string" ? guess.toLowerCase().trim() : ""
  if (guessRaw.length !== 5 || !/^[a-z]{5}$/.test(guessRaw)) {
    return { ok: false, error: "bad_guess" }
  }
  if (!Number.isInteger(row) || row < 0 || row > 5) {
    return { ok: false, error: "bad_row" }
  }
  if (!ALLOWED_GUESSES.has(guessRaw)) {
    return { ok: false, error: "not_in_list" }
  }

  const todayPuzzleNumber = dailyPuzzleNumberForTimeZone(new Date(), timeZone)
  const targetPuzzleNumber =
    puzzleNumber == null ? todayPuzzleNumber : puzzleNumber
  if (
    !Number.isInteger(targetPuzzleNumber) ||
    targetPuzzleNumber < 1 ||
    targetPuzzleNumber > todayPuzzleNumber
  ) {
    return { ok: false, error: "bad_puzzle" }
  }

  const solution = solutionForPuzzleNumber(targetPuzzleNumber)
  const scores = scoreGuess(guessRaw, solution)
  const won = guessRaw === solution
  const lost = !won && row === 5

  return {
    ok: true,
    scores,
    won,
    lost,
    ...(lost ? { answer: solution } : {}),
  }
}
```

### `lib/wordle/answer.ts` (full file, 10 lines)

```ts
import "server-only"

import { WORDLE_SOLUTIONS } from "@/lib/wordle/words"

export function solutionForPuzzleNumber(puzzleNumber: number): string {
  const n = puzzleNumber - 1
  const m = WORDLE_SOLUTIONS.length
  const index = ((n % m) + m) % m
  return WORDLE_SOLUTIONS[index]!
}
```

### `lib/wordle/words.ts` (full file, 14 lines) — also has `import "server-only"`

```ts
import "server-only"

import { all, answers } from "../wordle-words-data.mjs"

export const WORDLE_SOLUTIONS: readonly string[] = answers
export const ALLOWED_GUESSES: ReadonlySet<string> = new Set(all)
```

### The import hazard, confirmed directly

`node_modules/server-only/index.js` is:

```js
throw new Error(
  "This module cannot be imported from a Client Component module. " +
    "It should only be used from a Server Component."
);
```

Its `package.json` maps the bare specifier `server-only` to `empty.js` (a
no-op) **only** under Node's `"react-server"` export condition, and to this
throwing `index.js` otherwise:

```json
"exports": {
  ".": {
    "react-server": "./empty.js",
    "default": "./index.js"
  }
}
```

Vitest's Node environment does not set the `react-server` condition (Next.js
sets it via its own webpack/Turbopack config at build time, which Vitest
doesn't use), so any test file that imports `lib/wordle/answer.ts` or
`lib/wordle/words.ts` — directly or transitively (e.g. importing
`lib/wordle/actions.ts`, which imports `answer.ts`) — will crash immediately
with the "cannot be imported from a Client Component" error, before any
assertion runs. Confirmed by running `require("server-only")` directly in
this repo's `node_modules` context: it throws exactly that message.

### `vitest.config.ts` (full file, 15 lines) — current state, before this plan's change

```ts
import { defineConfig } from "vitest/config"
import path from "node:path"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
})
```

Note `include: ["tests/**/*.test.ts"]` — new test files **must** live under
`tests/`, not colocated next to `lib/wordle/*.ts`, or Vitest won't discover
them.

### Existing test convention to match: `tests/registry/registry-blocks.test.ts:1-10`

```ts
import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { loadRegistry, registryProjectRoot as root } from "./load-registry"

describe("registry.json blocks", () => {
  it("has valid registry:block entries with files and paths on disk", () => {
    // ...
  })
})
```

Match this style: `describe`/`it` from `"vitest"`, one `describe` block per
concern, descriptive `it` titles.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Run new tests only | `pnpm vitest run tests/wordle` | all pass |
| Full test run | `pnpm test:run` | all pass, including existing `tests/registry/*` |
| Full check | `pnpm check` | exit 0 |
| Typecheck | `pnpm typecheck` | exit 0 |

## Scope

**In scope**:
- `vitest.config.ts` — add a `resolve.alias` entry redirecting the bare
  specifier `"server-only"` to a new empty shim file (see Step 1).
- New file: `tests/wordle/server-only-shim.ts` (the empty shim)
- New file: `tests/wordle/score.test.ts`
- New file: `tests/wordle/daily.test.ts`
- New file: `tests/wordle/actions.test.ts`

**Out of scope**:
- Do not modify `lib/wordle/*.ts` — all production code here is correct as
  audited; this plan only adds tests.
- Do not remove or alter the `import "server-only"` guards in
  `answer.ts`/`words.ts` — they exist to prevent the word lists from leaking
  into the client bundle (`answer.ts`'s docstring: "Keep this server-only.")
  and must stay for production correctness. The alias in `vitest.config.ts`
  only affects test resolution, never the real Next.js build (Next's own
  bundler config is untouched).
- Do not add a global `resolve.conditions: ["react-server"]` to
  `vitest.config.ts` as an alternative fix — that would change module
  resolution for every package in every test file (including `react`/
  `react-dom` if any test ever imports them), which is a much larger blast
  radius than aliasing one bare specifier. The alias approach in Step 1 is
  deliberately narrow.

## Git workflow

- Branch: `advisor/006-wordle-unit-tests`
- Single commit, conventional-commit style, e.g.:
  `test(wordle): add unit tests for scoring, daily puzzle math, and the guess action`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create the `server-only` test shim and alias it in Vitest config

Create `tests/wordle/server-only-shim.ts`:

```ts
export {}
```

Edit `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config"
import path from "node:path"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "server-only": path.resolve(__dirname, "tests/wordle/server-only-shim.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
})
```

**Verify**: create a throwaway test temporarily (or proceed straight to Step
4, which exercises this) confirming `import "@/lib/wordle/answer"` no longer
throws under Vitest.

### Step 2: `tests/wordle/score.test.ts` — scoring logic

Write tests using these three hand-verified cases (traced against the actual
algorithm above — use them exactly as given, don't invent new expected
arrays without tracing them yourself the same way):

1. **Full correct**: `scoreGuess("apple", "apple")` → `["correct","correct","correct","correct","correct"]`
2. **Full absent**: `scoreGuess("zzzzz", "apple")` — wait, `z` may coincidentally not appear in `"apple"`, which is fine and is exactly the point: `scoreGuess("bzzzz", "apple")` → since none of `b`,`z` appear in `"apple"`, expect `["absent","absent","absent","absent","absent"]`.
3. **Duplicate-letter, mixed correct/present/absent** (this is the important regression case): `scoreGuess("sassy", "spans")` → `["correct","present","present","absent","absent"]`.
   - Traced: position 0 `s`===`s` → `correct` (consumes one `s` from solution's remaining count of 2, leaving 1). Position 1 `a` is present in solution (not at this position) → `present`. Position 2 `s`: one `s` remains available in solution's remaining count → `present`. Position 3 `s`: no `s` left in remaining (both consumed) → `absent`. Position 4 `y`: not in solution at all → `absent`.
4. **Reverse duplicate case** (guess has a letter twice, solution has it once): `scoreGuess("ssabc", "abcds")` → `["present","absent","present","present","present"]`.
   - Traced: no positions match exactly. Loop 2: position 0 `s` claims the solution's one `s` → `present`; position 1 `s` finds none left → `absent`; positions 2-4 (`a`,`b`,`c`) each claim their one available letter in solution → all `present`.

```ts
import { describe, expect, it } from "vitest"
import { scoreGuess } from "@/lib/wordle/score"

describe("scoreGuess", () => {
  it("marks every tile correct when guess equals solution", () => {
    expect(scoreGuess("apple", "apple")).toEqual([
      "correct", "correct", "correct", "correct", "correct",
    ])
  })

  it("marks every tile absent when no letters overlap", () => {
    expect(scoreGuess("bzzzz", "apple")).toEqual([
      "absent", "absent", "absent", "absent", "absent",
    ])
  })

  it("only credits a repeated guess letter once when the solution has it once (mixed case)", () => {
    expect(scoreGuess("sassy", "spans")).toEqual([
      "correct", "present", "present", "absent", "absent",
    ])
  })

  it("only credits a repeated guess letter once when the solution has it once (no exact matches)", () => {
    expect(scoreGuess("ssabc", "abcds")).toEqual([
      "present", "absent", "present", "present", "present",
    ])
  })
})
```

**Verify**: `pnpm vitest run tests/wordle/score.test.ts` → all 4 pass. If any
fail, do not adjust the expected array to match the actual output blindly —
re-trace the algorithm by hand against the case that failed (the algorithm
source is quoted in full in "Current state" above) and figure out whether
your trace or the test was wrong before deciding it's a real bug (in which
case STOP and report — see "STOP conditions").

### Step 3: `tests/wordle/daily.test.ts` — date/timezone/puzzle-number math

```ts
import { describe, expect, it } from "vitest"
import {
  dailyPuzzleNumberForTimeZone,
  dayKeyForTimeZone,
  nextDailyPuzzleBoundaryUtcMs,
  normalizeWordleTimeZone,
  WORDLE_DAILY_EPOCH_DATE,
} from "@/lib/wordle/daily"

describe("normalizeWordleTimeZone", () => {
  it("returns a valid IANA zone unchanged", () => {
    expect(normalizeWordleTimeZone("America/New_York")).toBe("America/New_York")
  })

  it("falls back to UTC for an invalid zone", () => {
    expect(normalizeWordleTimeZone("Not/AZone")).toBe("UTC")
  })

  it("falls back to UTC for empty/undefined input", () => {
    expect(normalizeWordleTimeZone(undefined)).toBe("UTC")
    expect(normalizeWordleTimeZone("  ")).toBe("UTC")
  })
})

describe("dayKeyForTimeZone", () => {
  it("returns the UTC calendar date for a UTC instant", () => {
    const date = new Date(Date.UTC(2024, 0, 15, 12, 0, 0))
    expect(dayKeyForTimeZone(date, "UTC")).toBe("2024-01-15")
  })

  it("returns a different calendar date in a timezone behind UTC, across midnight", () => {
    // 2024-01-16T02:00:00Z is 2024-01-15T21:00:00 in America/New_York (EST, UTC-5, no DST in January)
    const date = new Date(Date.UTC(2024, 0, 16, 2, 0, 0))
    expect(dayKeyForTimeZone(date, "America/New_York")).toBe("2024-01-15")
    expect(dayKeyForTimeZone(date, "UTC")).toBe("2024-01-16")
  })
})

describe("dailyPuzzleNumberForTimeZone", () => {
  it("returns puzzle #1 on the epoch date itself", () => {
    expect(dailyPuzzleNumberForTimeZone(WORDLE_DAILY_EPOCH_DATE, "UTC")).toBe(1)
  })

  it("increments by exactly 1 the following day", () => {
    const nextDay = new Date(WORDLE_DAILY_EPOCH_DATE.getTime() + 86_400_000)
    expect(dailyPuzzleNumberForTimeZone(nextDay, "UTC")).toBe(2)
  })
})

describe("nextDailyPuzzleBoundaryUtcMs", () => {
  it("returns exact UTC midnight of the next day when timeZone is UTC", () => {
    const date = new Date(Date.UTC(2024, 0, 15, 10, 0, 0))
    expect(nextDailyPuzzleBoundaryUtcMs(date, "UTC")).toBe(Date.UTC(2024, 0, 16))
  })

  it("returns the correct UTC instant for a non-UTC timezone's midnight rollover", () => {
    // 2024-01-15T10:00:00Z is 2024-01-15T05:00:00 in America/New_York (EST).
    // The next New York midnight (2024-01-16T00:00:00-05:00) is 2024-01-16T05:00:00Z.
    const date = new Date(Date.UTC(2024, 0, 15, 10, 0, 0))
    expect(nextDailyPuzzleBoundaryUtcMs(date, "America/New_York")).toBe(
      Date.UTC(2024, 0, 16, 5, 0, 0)
    )
  })
})
```

**Verify**: `pnpm vitest run tests/wordle/daily.test.ts` → all pass. The
`nextDailyPuzzleBoundaryUtcMs` non-UTC case is the most important assertion
in this plan — it directly exercises the binary-search boundary logic
identified as the highest-risk code in the audit. If it fails, re-derive the
expected UTC instant by hand (convert the target local midnight to UTC using
the zone's known offset for that date, accounting for DST if the date you
choose has any) rather than adjusting the assertion to match a possibly-wrong
implementation.

### Step 4: `tests/wordle/actions.test.ts` — the server action

```ts
import { describe, expect, it } from "vitest"
import { submitWordleGuess } from "@/lib/wordle/actions"
import { solutionForPuzzleNumber } from "@/lib/wordle/answer"
import { dailyPuzzleNumberForTimeZone } from "@/lib/wordle/daily"
import { ALLOWED_GUESSES } from "@/lib/wordle/words"

const PUZZLE_1_SOLUTION = solutionForPuzzleNumber(1)

describe("submitWordleGuess — input validation", () => {
  it("rejects a guess that isn't 5 letters", async () => {
    const result = await submitWordleGuess("ab", 0, 1, "UTC")
    expect(result).toEqual({ ok: false, error: "bad_guess" })
  })

  it("rejects a guess with non-letter characters", async () => {
    const result = await submitWordleGuess("ab1de", 0, 1, "UTC")
    expect(result).toEqual({ ok: false, error: "bad_guess" })
  })

  it("rejects an out-of-range row", async () => {
    const result = await submitWordleGuess(PUZZLE_1_SOLUTION, 6, 1, "UTC")
    expect(result).toEqual({ ok: false, error: "bad_row" })
  })

  it("rejects a non-integer row", async () => {
    const result = await submitWordleGuess(PUZZLE_1_SOLUTION, 1.5, 1, "UTC")
    expect(result).toEqual({ ok: false, error: "bad_row" })
  })

  it("rejects a guess not in the allowed word list", async () => {
    const notAWord = "qzxjk"
    expect(ALLOWED_GUESSES.has(notAWord)).toBe(false) // precondition
    const result = await submitWordleGuess(notAWord, 0, 1, "UTC")
    expect(result).toEqual({ ok: false, error: "not_in_list" })
  })

  it("rejects a puzzle number greater than today's", async () => {
    const todayPuzzleNumber = dailyPuzzleNumberForTimeZone(new Date(), "UTC")
    const result = await submitWordleGuess(
      PUZZLE_1_SOLUTION,
      0,
      todayPuzzleNumber + 1000,
      "UTC"
    )
    expect(result).toEqual({ ok: false, error: "bad_puzzle" })
  })

  it("rejects puzzle number 0", async () => {
    const result = await submitWordleGuess(PUZZLE_1_SOLUTION, 0, 0, "UTC")
    expect(result).toEqual({ ok: false, error: "bad_puzzle" })
  })
})

describe("submitWordleGuess — happy path", () => {
  it("returns won: true and does not reveal the answer when the guess is correct", async () => {
    const result = await submitWordleGuess(PUZZLE_1_SOLUTION, 0, 1, "UTC")
    expect(result.ok).toBe(true)
    if (!result.ok) throw new Error("unreachable")
    expect(result.won).toBe(true)
    expect(result.lost).toBe(false)
    expect(result.scores).toEqual(["correct", "correct", "correct", "correct", "correct"])
    expect(result).not.toHaveProperty("answer")
  })

  it("returns lost: true and reveals the answer on the final row with a wrong guess", async () => {
    const wrongGuess = [...ALLOWED_GUESSES].find((w) => w !== PUZZLE_1_SOLUTION)
    if (!wrongGuess) throw new Error("test setup: no alternate word found in ALLOWED_GUESSES")

    const result = await submitWordleGuess(wrongGuess, 5, 1, "UTC")
    expect(result.ok).toBe(true)
    if (!result.ok) throw new Error("unreachable")
    expect(result.won).toBe(false)
    expect(result.lost).toBe(true)
    expect(result.answer).toBe(PUZZLE_1_SOLUTION)
  })

  it("does not reveal the answer on a wrong guess before the final row", async () => {
    const wrongGuess = [...ALLOWED_GUESSES].find((w) => w !== PUZZLE_1_SOLUTION)
    if (!wrongGuess) throw new Error("test setup: no alternate word found in ALLOWED_GUESSES")

    const result = await submitWordleGuess(wrongGuess, 2, 1, "UTC")
    expect(result.ok).toBe(true)
    if (!result.ok) throw new Error("unreachable")
    expect(result.won).toBe(false)
    expect(result.lost).toBe(false)
    expect(result).not.toHaveProperty("answer")
  })
})
```

**Verify**: `pnpm vitest run tests/wordle/actions.test.ts` → all pass. If the
import of `@/lib/wordle/actions` (or its transitive `answer.ts`/`words.ts`)
throws the "cannot be imported from a Client Component" error, Step 1's
alias didn't take effect — re-check `vitest.config.ts` before touching
anything else.

## Test plan

Covered above: `tests/wordle/score.test.ts` (4 cases), `tests/wordle/daily.test.ts`
(8 cases), `tests/wordle/actions.test.ts` (9 cases). Model file structure and
`describe`/`it` naming after `tests/registry/registry-blocks.test.ts`.
Verification: `pnpm test:run` → all pass, including the existing
`tests/registry/*` suite (unaffected by this plan) plus these 21 new cases.

## Done criteria

- [ ] `pnpm vitest run tests/wordle` → all pass
- [ ] `pnpm test:run` → all pass (existing + new tests)
- [ ] `pnpm typecheck` → exit 0
- [ ] `pnpm check` → exit 0
- [ ] `vitest.config.ts`'s `server-only` alias does not affect production
      builds — confirm with `pnpm build` still succeeding (the alias only
      lives in `vitest.config.ts`, which Next.js's own build never reads)
- [ ] Only the files listed in "Scope" are modified/created (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- If any hand-traced expected value in Step 2 or Step 3 doesn't match actual
  output after you've double-checked your trace against the quoted algorithm
  source — this could mean a real bug in `lib/wordle/score.ts` or
  `lib/wordle/daily.ts`. Do not "fix" production code to match your test (out
  of scope for this plan) and do not silently adjust the test to match
  whatever the code currently does (that defeats the purpose). STOP and
  report the specific case and the discrepancy.
- If `ALLOWED_GUESSES` or `WORDLE_SOLUTIONS` turn out to be empty at test
  time (would indicate `lib/wordle-words-data.mjs` failed to load) — STOP,
  this is a pre-existing data problem outside this plan's scope.
- If aliasing `"server-only"` in `vitest.config.ts` causes any *existing*
  test in `tests/registry/*` to fail — those tests don't import anything
  wordle-related, so this would be unexpected; STOP and report rather than
  debugging Vitest's alias resolution further.

## Maintenance notes

- If `lib/wordle/daily.ts`'s DST handling needs deeper coverage later (e.g. a
  spring-forward/fall-back boundary test), add it to
  `tests/wordle/daily.test.ts` following the same hand-traced-expectation
  discipline used here — don't add a test whose expected value was generated
  by running the function once and copying its output.
- The `tests/wordle/server-only-shim.ts` file is test-only infrastructure; if
  a future contributor adds another `"server-only"`-guarded module elsewhere
  in `lib/`, it will automatically benefit from the same alias — no need to
  duplicate the shim.
