# Plan 027: Add test coverage for `landing-page-v2`'s `registerAction`

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat b7c12b8..HEAD -- registry/new-york/templates/landing-page-v2/lib/actions.ts registry/new-york/templates/landing-page-v2/lib/site.ts`
> If either changed since this plan was written, compare the "Current
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

`landing-page-v2` is an installable event/conference-registration template.
Its `registerAction` server action (`lib/actions.ts`) has real, non-trivial
validation logic — four required-field/format checks — but is the only
template in `lib/templates.ts` with **zero** test coverage: `tests/templates/`
has directories for `landing-page-v1`, `landing-page-v3`, `portfolio-v1`,
and `portfolio-v3`, but none for `landing-page-v2`. The project's own
contributor contract (`.cursor/rules/registry-templates.mdc`, "Backend-
integrated templates") technically only *requires* tests once a route calls
a real external service — `registerAction` is currently a documented stub
with the live call commented out — so this isn't a contract violation. It
is, however, the same shape of pure, cheap-to-test validation logic that
`tests/templates/portfolio-v1/actions.test.ts` already covers for
`portfolio-v1`'s (also `"use server"`) contact action, and closing the gap
now means the validation logic is protected before someone wires in a real
backend call and the contract makes tests mandatory anyway.

## Current state

- `registry/new-york/templates/landing-page-v2/lib/actions.ts` (54 lines,
  full file as of `b7c12b8`):
  ```ts
  "use server"

  export type RegisterResult =
    | { success: true }
    | { error: string }

  export async function registerAction(
    formData: FormData
  ): Promise<RegisterResult> {
    const role = String(formData.get("role") ?? "").trim()
    const track = String(formData.get("track") ?? "").trim()
    const team = String(formData.get("team") ?? "").trim()
    const contact = String(formData.get("contact") ?? "").trim()

    if (!role) {
      return { error: "Pick a role to continue." }
    }

    if (!track) {
      return { error: "Pick a track to continue." }
    }

    if (!contact) {
      return { error: "Enter an email so we can send your ticket." }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
      return { error: "Enter a valid email address." }
    }

    const payload = {
      role,
      track,
      team: team || null,
      contact,
    }

    // --- Your backend goes here ------------------------------------------
    // Example:
    //   await fetch(process.env.REGISTER_ENDPOINT!, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(payload),
    //   })
    // ---------------------------------------------------------------------
    void payload

    return { success: true }
  }
  ```
  Note: `team` is optional (no validation branch for it) and is not
  currently used to gate anything — it's read but only referenced inside
  the unused `payload` object.

- `registry/new-york/templates/landing-page-v2/lib/site.ts:21-100` defines
  the form's question schema — the field names your test's `FormData` must
  use are exactly `role`, `track`, `team`, `contact` (confirmed matching
  `actions.ts`'s `formData.get(...)` calls, no drift).

- The structural pattern to follow —
  `tests/templates/portfolio-v1/actions.test.ts` (full file, 88 lines):
  ```ts
  import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
  import { contactFormAction } from "@/registry/new-york/templates/portfolio-v1/lib/actions"

  function formData(fields: Record<string, string>): FormData {
    const fd = new FormData()
    for (const [key, value] of Object.entries(fields)) fd.set(key, value)
    return fd
  }

  const validFields = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "This message is definitely long enough to pass validation.",
  }

  describe("contactFormAction", () => {
    // ...
    it("returns a validation error for an invalid email, without calling fetch", async () => {
      const fetchSpy = vi.fn()
      vi.stubGlobal("fetch", fetchSpy)

      const result = await contactFormAction(
        formData({ ...validFields, email: "not-an-email" })
      )

      expect(result.error).toBeDefined()
      expect(fetchSpy).not.toHaveBeenCalled()
    })
    // ...
  })
  ```
  This repo's import-alias convention for test files reaches into the
  registry via `@/registry/new-york/templates/{name}/lib/actions` — confirmed
  working in the existing test above; use the same pattern for
  `landing-page-v2`.

  `registerAction` has no external boundary yet (no `fetch`), so your test
  does **not** need `vi.stubGlobal("fetch", ...)` — that part of the
  reference pattern doesn't apply here. Focus purely on the validation
  branches and the `team` optional-field behavior.

## Commands you will need

| Purpose   | Command                                                                                   | Expected on success |
|-----------|---------------------------------------------------------------------------------------------|----------------------|
| Install   | `pnpm install`                                                                               | exit 0               |
| Run test  | `pnpm vitest run tests/templates/landing-page-v2/actions.test.ts`                           | all new tests pass   |
| Typecheck | `pnpm typecheck`                                                                             | exit 0               |
| Full gate | `pnpm check`                                                                                 | exit 0               |

## Scope

**In scope** (the only file you should create):
- `tests/templates/landing-page-v2/actions.test.ts` (new file)

**Out of scope** (do NOT touch, even though they look related):
- `registry/new-york/templates/landing-page-v2/lib/actions.ts` — this is a
  test-only plan; do not modify the action itself (including "while you're
  in there" cleanups). If you believe the code has a bug, report it in your
  NOTES instead of fixing it.
- `.cursor/rules/registry-templates.mdc` — no contract change needed; this
  plan closes a coverage gap the contract doesn't currently mandate, it
  doesn't change what the contract requires.
- Any other template's test directory.

## Git workflow

- Branch: `advisor/027-landing-page-v2-actions-tests`
- One commit. Message style matches this repo's convention (e.g.
  `test(landing-page-v2): cover registerAction validation branches`).
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create the test directory and file

Create `tests/templates/landing-page-v2/actions.test.ts`, importing
`registerAction` from `@/registry/new-york/templates/landing-page-v2/lib/actions`
and reusing the `formData(...)` helper pattern from
`tests/templates/portfolio-v1/actions.test.ts` (reproduce the helper
locally in the new file — it's a small, self-contained function, not
something to import cross-test-file).

Cover these cases, one `it()` each:
1. Missing `role` → `{ error: "Pick a role to continue." }`
2. `role` present, missing `track` → `{ error: "Pick a track to continue." }`
3. `role` and `track` present, missing `contact` → `{ error: "Enter an email so we can send your ticket." }`
4. `role`, `track`, `contact` present but `contact` is not a valid email (e.g. `"not-an-email"`) → `{ error: "Enter a valid email address." }`
5. All required fields valid, `team` omitted → `{ success: true }`
6. All required fields valid, `team` provided → `{ success: true }` (confirms the optional field doesn't break success)

Use realistic values matching `site.ts`'s question `choices` for `role`/
`track` (e.g. `"engineer"`, `"ai"`) though the action itself doesn't
validate against the choice list — any non-empty string satisfies the
required-field check, so this is for readability, not correctness.

**Verify**: `pnpm vitest run tests/templates/landing-page-v2/actions.test.ts` → 6 tests, all pass.

### Step 2: Typecheck and full gate

**Verify**: `pnpm typecheck` → exit 0. `pnpm check` → exit 0 (registry:validate + lint + test:run + typecheck all pass, total test count increases by 6 over a clean `b7c12b8` checkout).

## Test plan

Covered fully in Step 1 above — this plan's entire deliverable is the test
file itself. No production code changes accompany it.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `tests/templates/landing-page-v2/actions.test.ts` exists
- [ ] `pnpm vitest run tests/templates/landing-page-v2/actions.test.ts` exits 0, exactly 6 tests pass
- [ ] `pnpm check` exits 0
- [ ] No files outside `tests/templates/landing-page-v2/actions.test.ts` are modified or created (`git status`)
- [ ] `plans/README.md` status row for 027 updated

## STOP conditions

Stop and report back (do not improvise) if:

- `lib/actions.ts`'s validation branches or error message strings don't
  match the "Current state" excerpt above (the codebase has drifted) —
  re-read the live file and adjust your test expectations to match reality,
  but if the drift is large enough that you're guessing at intent, stop and
  report instead.
- `registerAction` has gained a real `fetch`/external call since this plan
  was written — that would mean the templates contract now *requires*
  mocking that boundary (per `.cursor/rules/registry-templates.mdc`), which
  is a bigger scope than this plan covers; stop and report rather than
  silently expanding scope.

## Maintenance notes

- When `registerAction` eventually gains a real backend call (per its own
  `// Your backend goes here` comment), the contract in
  `.cursor/rules/registry-templates.mdc` will make testing that boundary
  mandatory — extend this same file with a `vi.stubGlobal("fetch", ...)`
  case at that point, following `tests/templates/portfolio-v1/actions.test.ts`'s
  full pattern (including the "endpoint not configured" and "fetch throws"
  cases), not just the validation branches this plan adds now.
