# Plan 023: Codify a backend-integrated-template contract and add webhook route tests

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 560927f..HEAD -- registry/new-york/templates/landing-page-v1/app/api/webhooks/route.ts .cursor/rules/registry-templates.mdc CONTRIBUTING.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S/M
- **Risk**: LOW
- **Depends on**: none
- **Category**: direction (docs + tests, no product behavior change)
- **Planned at**: commit `560927f`, 2026-08-08

## Why this matters

`registry/new-york/templates/landing-page-v1` is the first template in this
repo with a live backend surface: an unauthenticated webhook endpoint
(`app/api/webhooks/route.ts`) that verifies Clerk/Svix signatures, and
`clerkMiddleware()` gating every route (`proxy.ts`). Every prior template
(`portfolio-v1`, `portfolio-v2`) was a static frontend with, at most, a
server action posting to a third-party form endpoint (Basin) — no inbound
request-verification logic, no signing secrets, no middleware.

Two things haven't caught up to this new pattern:

1. **No test coverage.** `tests/templates/portfolio-v1/actions.test.ts`
   thoroughly covers `contactFormAction` (6 cases: missing config,
   validation, honeypot, success, non-OK response, network failure) using
   `vi.stubGlobal("fetch", ...)`. The webhook route — which is a more
   security-sensitive surface (it's the one endpoint in this template that
   accepts unauthenticated inbound traffic) — has zero tests. There is no
   `tests/templates/landing-page-v1/` directory at all.
2. **No contract.** `.cursor/rules/registry-templates.mdc` (formalized one
   round ago, Plan 020) documents folder shape and self-containment for
   templates in general, but says nothing about backend routes: it doesn't
   require signature verification on inbound webhooks, doesn't set an
   expectation that server routes get test coverage, and doesn't say
   anything about secret-handling beyond what already exists implicitly in
   `.env.example` conventions.

Neither gap blocks anything today — the current implementation is
reasonable (it does verify the signature, it does keep secrets out of
`.env.example`). The risk is forward-looking: the next backend-integrated
template (a second waitlist variant, a Stripe checkout starter, anything
with its own webhook) has no test pattern to copy and no rule file to
follow, so quality here is currently riding on one contributor's judgment
rather than a documented, enforced contract — exactly the gap Plan 020
closed for template folder structure in general.

## Current state

- `registry/new-york/templates/landing-page-v1/app/api/webhooks/route.ts` —
  the route this plan adds tests for. Full current content:

  ```ts
  import { verifyWebhook } from "@clerk/nextjs/webhooks"
  import type { NextRequest } from "next/server"

  export async function POST(req: NextRequest) {
    let evt
    try {
      evt = await verifyWebhook(req)
    } catch (err) {
      console.error("Webhook verification failed:", err)
      return new Response("Verification failed", { status: 400 })
    }

    if (
      evt.type === "waitlistEntry.created" ||
      evt.type === "waitlistEntry.updated"
    ) {
      const { id, email_address, status } = evt.data
      // Hook your own side effects here (DB insert, Resend, Slack, etc.).
      console.log(`[waitlist] ${evt.type}`, { id, email: email_address, status })
    }

    return new Response("OK", { status: 200 })
  }
  ```

- `node_modules/@clerk/nextjs/dist/types/webhooks.d.ts` — `verifyWebhook`'s
  contract: `(request, options?) => Promise<WebhookEvent>`, **throws** on
  signature-verification failure, resolves to `{ type: string, data: ... }`
  on success. This is what you mock in tests — do not attempt to construct
  a real Svix-signed request.
- `vitest.config.ts` — `test.environment: "node"` (not jsdom), with an
  alias mapping `"server-only"` to its `empty.js` stub. Route handlers run
  fine in this environment since they're plain async functions over
  `Request`/`Response`.
- `tests/templates/portfolio-v1/actions.test.ts` — the pattern to mirror
  for structure (not for mocking mechanism, since that file mocks
  `fetch`, not a package import). Relevant shape:

  ```ts
  import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
  import { contactFormAction } from "@/registry/new-york/templates/portfolio-v1/lib/actions"

  describe("contactFormAction", () => {
    beforeEach(() => { /* env setup */ })
    afterEach(() => { /* env teardown */ vi.unstubAllGlobals() })

    it("returns an error when ... is not configured", async () => { /* ... */ })
    // ...
  })
  ```

- `.cursor/rules/registry-templates.mdc` — current full content (54 lines,
  already read in full during recon). It has three sections: the folder
  shape table, "A new template touches four places", and "Templates are
  self-contained". This plan adds a fourth section after
  "Templates are self-contained" and before "Do not".
- `CONTRIBUTING.md:76-96` — the "Adding or editing a template" section
  added by Plan 020. It currently ends by pointing at
  `.cursor/rules/registry-templates.mdc` for "full folder-shape and
  self-containment rules" and lists the four touch-points for a new
  template. This plan adds one sentence pointing at the new backend-routes
  subsection, mirroring the existing pointer style.
- Baseline test suite state (confirmed by running it during recon, commit
  `560927f`): `pnpm test:run` → 23 test files, 94 tests, all passing.

## Commands you will need

| Purpose   | Command                                                        | Expected on success |
|-----------|-----------------------------------------------------------------|----------------------|
| Install   | `pnpm install`                                                  | exit 0               |
| Typecheck | `pnpm typecheck`                                                | exit 0, no errors    |
| Tests     | `pnpm test:run`                                                 | all pass, count increases from 94 |
| Tests (filtered) | `pnpm vitest run tests/templates/landing-page-v1/webhook.test.ts` | all pass (new file only) |
| Lint      | `pnpm lint`                                                     | exit 0               |
| Full gate | `pnpm check`                                                    | exit 0               |

## Suggested executor toolkit

- No special skills required. If a Vitest-mocking reference is useful,
  Vitest's own docs on `vi.mock` for ESM module mocking are the relevant
  section — this route imports `verifyWebhook` as a named export from
  `@clerk/nextjs/webhooks`, so the test needs `vi.mock("@clerk/nextjs/webhooks", ...)`
  with a factory returning a mocked `verifyWebhook`, not `vi.stubGlobal`
  (that only works for globals like `fetch`, not module imports).

## Scope

**In scope** (the only files you should create or modify):
- `tests/templates/landing-page-v1/webhook.test.ts` (create)
- `.cursor/rules/registry-templates.mdc` (add one new section)
- `CONTRIBUTING.md` (one added sentence in the existing "Adding or editing
  a template" section)
- `plans/README.md` (status row update only)

**Out of scope** (do NOT touch, even though they look related):
- `registry/new-york/templates/landing-page-v1/app/api/webhooks/route.ts`
  itself — this plan adds tests for the route as it exists today; it does
  not change the route's behavior. If a test reveals an actual bug, STOP
  (see below) rather than fixing it as a drive-by.
- `registry/new-york/templates/landing-page-v1/proxy.ts` (the Clerk
  middleware) — out of scope; not covered by this plan's test additions.
- Any other template's files.
- `registry.json` / `public/r/*.json` — this plan adds no new registry
  entries (no new files are added to the installable template payload;
  `tests/` is never part of what ships via the CLI install).

## Git workflow

- Branch: `advisor/023-backend-template-contract-and-webhook-tests`
- Commit per step; message style example from recent history:
  `test(templates): add webhook signature verification`. A reasonable
  message for the docs step:
  `docs(templates): codify backend-integrated template contract`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Write webhook route tests

Create `tests/templates/landing-page-v1/webhook.test.ts`. Mock
`@clerk/nextjs/webhooks` at the module level with `vi.mock`, controlling
what `verifyWebhook` resolves/rejects with per test. Cover:

1. **Verification failure → 400, no logged side effect beyond the error
   log.** Mock `verifyWebhook` to reject with an `Error`. Call the route's
   exported `POST` with a minimal `NextRequest`-like object (a real
   `new Request("http://localhost/api/webhooks", { method: "POST" })` cast
   or passed as-is — check whether the route's `NextRequest` type usage is
   structural enough that a plain `Request` satisfies it at the call site
   in a test; if TypeScript complains, use `as unknown as NextRequest` at
   the call site only, not in the route file). Assert the response status
   is `400` and the body text is `"Verification failed"`.
2. **`waitlistEntry.created` event → 200, `"OK"` body.** Mock
   `verifyWebhook` to resolve with
   `{ type: "waitlistEntry.created", data: { id: "wl_123", email_address: "a@example.com", status: "pending" } }`.
   Assert status `200`, body text `"OK"`.
3. **`waitlistEntry.updated` event → 200, `"OK"` body.** Same shape as
   above with `type: "waitlistEntry.updated"`.
4. **An unrelated/unhandled event type → still 200, no throw.** Mock
   `verifyWebhook` to resolve with `{ type: "user.created", data: {} }` (a
   real Clerk event type this route doesn't branch on). Assert status
   `200` — confirms the route's fallthrough doesn't crash on event types
   it doesn't specifically handle.

Follow `tests/templates/portfolio-v1/actions.test.ts`'s structure:
`describe`/`it` blocks, `beforeEach`/`afterEach` for any mock reset
(`vi.restoreAllMocks()` or `vi.resetModules()` as appropriate for module
mocks — module-level `vi.mock` factories persist across tests in the same
file unless you reconfigure the mock's return value per test via
`vi.mocked(verifyWebhook).mockResolvedValueOnce(...)` /
`mockRejectedValueOnce(...)`, which is the simpler approach here).

Do not attempt to construct a real Svix-signed request or import real
Clerk verification logic — the whole point of mocking `verifyWebhook` is to
test this route's own branching logic (the try/catch, the event-type
switch, the response shapes), not Clerk's/Svix's signature algorithm.

**Verify**: `pnpm vitest run tests/templates/landing-page-v1/webhook.test.ts`
→ 4 tests pass.

### Step 2: Add the backend-integrated-templates section to the rule file

In `.cursor/rules/registry-templates.mdc`, add a new `##` section titled
`Backend-integrated templates` after the existing `## Templates are
self-contained` section and before `## Do not`. Content requirements (word
this in the file's existing voice — direct, imperative, matching the
surrounding sections' tone):

- Any template that accepts inbound requests from a third party (a
  webhook, a form-submission endpoint that does more than proxy to a
  static external service) must verify the request's authenticity before
  acting on it — point at `landing-page-v1`'s
  `app/api/webhooks/route.ts` as the reference example (Svix/Clerk
  signature verification via `verifyWebhook`, wrapped in try/catch,
  returning 400 on failure before touching the payload).
- Secrets (signing secrets, API keys) are documented as blank placeholders
  in the template's `.env.example` only — never a real value, matching the
  existing convention already followed by `landing-page-v1/.env.example`
  and `portfolio-v1`'s `BASIN_ENDPOINT`.
- Any new server route (webhook handler, API route, server action calling
  an external service) needs test coverage under
  `tests/templates/<template-name>/` before it's considered complete — see
  `tests/templates/portfolio-v1/actions.test.ts` and
  `tests/templates/landing-page-v1/webhook.test.ts` (added by this plan)
  as the reference pattern: mock the external boundary (`fetch` via
  `vi.stubGlobal`, or a package import via `vi.mock`), not the route's own
  logic.

Keep the section short — 3 bullet points is enough, matching the existing
sections' density (the file is 54 lines total before this addition; don't
more than double it).

**Verify**: `git diff .cursor/rules/registry-templates.mdc` shows only an
added section, no changes to existing content. Re-read the full file after
editing to confirm it still reads coherently top to bottom.

### Step 3: Point CONTRIBUTING.md at the new section

In `CONTRIBUTING.md`, inside the existing "Adding or editing a template"
section (currently lines 76-96), add one sentence after the existing
pointer to `.cursor/rules/registry-templates.mdc` — something like: "If
your template accepts inbound requests (a webhook, an API route), see that
file's 'Backend-integrated templates' section for the verification and
test-coverage requirements." Do not restructure the rest of the section.

**Verify**: `git diff CONTRIBUTING.md` shows a single added sentence, no
other changes.

### Step 4: Full verification gate

**Verify**: `pnpm check` → exit 0. `pnpm test:run` → all pass, total test
count is 98 (94 baseline + 4 new). `pnpm lint` → exit 0 on the new test
file and both edited docs files (markdown files aren't lint-checked by
ESLint, but confirm `pnpm lint` still exits 0 overall).

## Test plan

- New tests: `tests/templates/landing-page-v1/webhook.test.ts`, 4 cases as
  specified in Step 1 (verification failure, `waitlistEntry.created`,
  `waitlistEntry.updated`, unhandled event type).
- Structural pattern to follow: `tests/templates/portfolio-v1/actions.test.ts`
  (describe/it organization, `beforeEach`/`afterEach` hygiene) — but use
  `vi.mock`/`vi.mocked(...).mockResolvedValueOnce`/`mockRejectedValueOnce`
  for the module-level mock instead of `vi.stubGlobal`, since the boundary
  here is a package import, not a global.
- Verification: `pnpm test:run` → 98/98 pass (94 existing + 4 new), no
  regressions in any other file.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm test:run` exits 0; total passing tests = 98 (94 + 4 new)
- [ ] `pnpm lint` exits 0
- [ ] `pnpm check` exits 0
- [ ] `.cursor/rules/registry-templates.mdc` contains a `## Backend-integrated templates` heading
- [ ] `CONTRIBUTING.md` references "Backend-integrated templates" (grep confirms)
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The code at `app/api/webhooks/route.ts` doesn't match the excerpt in
  "Current state" (drift since this plan was written) — re-read the live
  file and compare before writing tests against a stale assumption.
- Mocking `@clerk/nextjs/webhooks` via `vi.mock` fails to intercept the
  route's import (e.g. due to how the package is bundled/exported) after
  one reasonable attempt at fixing the mock — this is a real risk worth
  flagging rather than spending excessive time on, since ESM mocking
  quirks vary by package. Report what was tried.
- Writing the tests surfaces an actual bug in the route (e.g. it doesn't
  actually 400 on verification failure, or crashes on an unhandled event
  type) — do NOT fix the route as part of this plan (out of scope per
  above); report the finding with the failing test attached instead.
- `pnpm lint` or `pnpm typecheck` fails on the new test file for reasons
  unrelated to your test logic (e.g. a repo-wide lint rule you can't
  satisfy without changing the route file) — report rather than modifying
  out-of-scope files to work around it.

## Maintenance notes

- The next backend-integrated template should follow the new
  "Backend-integrated templates" section in `registry-templates.mdc` and
  can copy `tests/templates/landing-page-v1/webhook.test.ts`'s
  `vi.mock`-based structure directly.
- A reviewer should scrutinize: that the new tests actually exercise the
  route's real branching (not trivially passing — each assertion should
  check both status code and body, per the existing `actions.test.ts`
  convention of asserting exact strings, not just "truthy").
- Not covered by this plan (explicitly deferred): testing
  `landing-page-v1/proxy.ts` (the Clerk middleware itself), and any
  broader security-header hardening (SEC-01, tracked separately in
  `plans/README.md`'s Round 3/4 carryover notes) — this plan is scoped to
  the webhook route and the contributor contract only.
