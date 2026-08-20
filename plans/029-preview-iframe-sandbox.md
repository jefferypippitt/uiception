# Plan 029: Add a `sandbox` attribute to the block/template preview iframe

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat b7c12b8..HEAD -- components/block-preview-toolbar.tsx`
> If that file changed since this plan was written, compare the "Current
> state" excerpt below against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW-MED
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `b7c12b8`, 2026-08-19

## Why this matters

Every block and template preview on this site — over 90 blocks and all 6
template versions, including the three new templates this round
(`landing-page-v2`, `landing-page-v3`, `portfolio-v3`) — renders through one
shared `<iframe>` in `components/block-preview-toolbar.tsx`, and that
iframe has no `sandbox` attribute. Today's previewed content is all
first-party and allowlist-gated, so there's no active exploit path, but this
is defense-in-depth that costs little: an unsandboxed iframe gives
previewed content the same privileges as the parent page (full script
execution, same-origin storage/cookie access, top-level navigation) with no
extra barrier if a future block/template preview ever included unexpected
third-party content. Flagged and deliberately deferred in Round 4's audit
(too broad a surface to fix without a smoke-test pass); this round adds
concrete evidence that the surface has only grown (3 more full-page
templates now route through the same iframe).

## Current state

- `components/block-preview-toolbar.tsx:495-505` (as of `b7c12b8`):
  ```tsx
  <iframe
    key={iframeKey}
    src={previewPath}
    title={displayTitle}
    ref={iframeRef}
    loading="lazy"
    className={cn(
      "block h-full w-full rounded-lg border border-border/80 bg-background shadow-sm",
      !iframeLoaded && "invisible"
    )}
  />
  ```
  `previewPath` (line 308) is always same-origin: `` `/view/${versionId}` ``
  — never a third-party URL.

- The parent component reads `iframe.contentDocument.readyState` from the
  same file (`block-preview-toolbar.tsx:330-356`) to detect load completion
  on hard refresh. **This access requires the iframe to remain
  same-origin-accessible** — `contentDocument` throws for a cross-origin (or
  fully origin-opaque-sandboxed) frame. The sandbox value chosen in Step 1
  below must include `allow-same-origin` or this existing behavior breaks
  silently (the load-detection effect would start throwing inside its
  `try`/`catch` at line 341-348, which happens to swallow the error, but the
  loading spinner could then get stuck — this is exactly why Step 2's smoke
  test list includes a hard-refresh check).

- Confirmed during this round's audit: no `postMessage`/`contentWindow`
  cross-frame communication exists anywhere in `components/` or `app/`
  (`grep -rln "postMessage\|contentWindow"` returns nothing) — so sandboxing
  will not break any parent↔iframe messaging, because there isn't any.

- The preview route rendered inside the iframe is
  `app/(preview)/view/[versionId]/[[...slug]]/page.tsx`, which renders
  whichever block or template component matches `versionId` — this
  includes, among others: forms (`portfolio-v1`'s contact form,
  `landing-page-v2`'s registration form), an external Clerk `<Waitlist />`
  embed (`landing-page-v1`), WebGL canvases (`TestimonialShader`,
  `landing-page-v2`'s `glow-canvas.tsx`), and GSAP/Motion-driven interactive
  components (`portfolio-v3`'s lifeline). The sandbox value must not break
  any of these — see Step 2's required smoke-test list.

## Commands you will need

| Purpose   | Command          | Expected on success |
|-----------|------------------|----------------------|
| Install   | `pnpm install`   | exit 0               |
| Typecheck | `pnpm typecheck` | exit 0               |
| Tests     | `pnpm test:run`  | all pass             |
| Lint      | `pnpm lint`      | exit 0               |
| Full gate | `pnpm check`     | exit 0               |
| Dev server (for smoke test) | `pnpm dev` | starts on `localhost:3000` (or reports the port it bound) |

## Suggested executor toolkit

- If a browser-automation tool (Playwright, a headless browser, or similar)
  is available in your environment, use it for Step 2's smoke tests —
  this repo's Round 3 execution log (`plans/README.md`, Plan 012) shows a
  prior executor successfully used Playwright for exactly this kind of
  interaction check. If none is available, do the smoke tests via `curl`
  against the dev server (checking for 200 responses and expected HTML
  markers) and say plainly in your report that visual/interactive
  confirmation wasn't possible in your environment — do not claim a visual
  check you didn't actually perform.

## Scope

**In scope** (the only file you should modify):
- `components/block-preview-toolbar.tsx`

**Out of scope** (do NOT touch, even though they look related):
- `app/(preview)/view/[versionId]/[[...slug]]/page.tsx` or any block/
  template component rendered inside the preview — if a smoke test reveals
  a specific block/template breaks under the sandbox, that is a STOP
  condition (see below), not something to patch by modifying that block.
- `app/(preview)/layout.tsx` — no change needed there; the sandbox
  attribute lives on the `<iframe>` element in the parent toolbar, not the
  framed page's own layout.
- Any other `<iframe>` in the codebase, if one exists elsewhere (check with
  `grep -rn "<iframe" --include="*.tsx" .` before starting — if you find
  more than the one at `block-preview-toolbar.tsx:495`, only fix that one
  and report the others in NOTES rather than expanding scope).

## Git workflow

- Branch: `advisor/029-preview-iframe-sandbox`
- One commit. Message style matches this repo's convention (e.g.
  `security(preview): sandbox the block/template preview iframe`).
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add the `sandbox` attribute

In `components/block-preview-toolbar.tsx`, add a `sandbox` prop to the
`<iframe>` at line ~495:

```tsx
<iframe
  key={iframeKey}
  src={previewPath}
  title={displayTitle}
  ref={iframeRef}
  loading="lazy"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
  className={cn(
    "block h-full w-full rounded-lg border border-border/80 bg-background shadow-sm",
    !iframeLoaded && "invisible"
  )}
/>
```

Rationale for each token (do not add or remove tokens without updating this
list and re-running Step 2's full smoke-test suite):
- `allow-scripts` — every block/template is a live React app; without this the preview is blank.
- `allow-same-origin` — required for the `contentDocument.readyState` check described in "Current state"; also required for the previewed page's own same-origin fetches/cookies (e.g. Clerk) to work at all.
- `allow-forms` — `portfolio-v1`'s contact form and `landing-page-v2`'s registration form must remain submittable inside the preview.
- `allow-popups` + `allow-popups-to-escape-sandbox` — the Clerk `<Waitlist />` embed in `landing-page-v1` and any block that opens links in a new tab (`target="_blank"`, confirmed present in several blocks per this round's and prior rounds' audits) need popups to escape the sandbox, or they silently fail to open.
- `allow-modals` — `alert`/`confirm`/native `<dialog>` usage inside any previewed component (e.g. shadcn `Dialog`-based blocks) would otherwise silently no-op.

Deliberately **not** included: `allow-top-navigation` (a preview should
never be able to navigate the parent page/tab away — this is the actual
security property this plan is adding) and `allow-downloads` (no known
preview triggers a file download; if Step 2 finds one that needs it, that's
a STOP condition to report, not something to add unilaterally).

**Verify**: `grep -n 'sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"' components/block-preview-toolbar.tsx` → one match.

### Step 2: Smoke-test the preview across representative surfaces

Start the dev server (`pnpm dev`) and, using whatever tool is available
per "Suggested executor toolkit" above, check each of the following
preview URLs still works as expected:

1. **A plain static block** — e.g. `/view/about-section-v1` — loads, no console errors, content visible.
2. **A WebGL/canvas-heavy block** — the `testimonials-section` version using `TestimonialShader` (check `lib/blocks.ts` for the exact version id) — canvas renders, no console errors.
3. **A template with a real form** — `/view/portfolio-v1` (contact form) and `/view/landing-page-v2` (registration form) — form fields are focusable/typeable; a submit attempt does not throw a sandbox-related console error (it may still fail validation or a missing-env-var check — that's expected and fine, you're checking for *sandbox* errors specifically, e.g. "Blocked a frame with origin ... from accessing a cross-origin frame" or "sandboxed and lacks the allow-forms flag").
4. **A template with an external embed** — `/view/landing-page-v1` (Clerk `<Waitlist />`) — the embed renders without a sandbox-related console error.
5. **The newest, most interaction-heavy template** — `/view/portfolio-v3` — the lifeline scroll/drag interaction still responds (this exercises `allow-scripts` + `allow-same-origin` under real gesture/RAF code, not just a static render).
6. **Hard-refresh load detection** — reload the outer `/blocks/[category]` (or `/templates/[category]`) page containing the toolbar directly (not just the iframe's own URL) and confirm the loading spinner clears (doesn't stay stuck) — this exercises the `contentDocument.readyState` code path described in "Current state".

**Verify**: for each of the 6 checks above, no browser console error
mentions "sandbox" or "blocked a frame"; document what you actually
observed for each (not what you expect) in your final report's NOTES,
including whether you had real browser access or only `curl`-level HTTP
checks.

### Step 3: Full verification gate

**Verify**: `pnpm typecheck` → exit 0. `pnpm lint` → exit 0. `pnpm test:run` → all pass, no new failures. `pnpm check` → exit 0.

## Test plan

No existing automated test covers the preview iframe's rendering behavior
in a real browser (confirmed: no `tests/` file references
`block-preview-toolbar` or the `/view/` route with a DOM/browser assertion
— it's outside Vitest's jsdom-only scope). This plan's verification is the
manual/automated smoke-test list in Step 2, not a new unit test. If your
environment has Playwright or similar available, consider it stronger
evidence than a `curl` check, but do not skip Step 2 either way.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `grep -n 'sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"' components/block-preview-toolbar.tsx` returns exactly one match
- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm lint` exits 0
- [ ] `pnpm test:run` exits 0, no new failures vs. a clean `b7c12b8` checkout
- [ ] All 6 smoke-test checks in Step 2 completed and their observed results documented (not assumed)
- [ ] No files outside `components/block-preview-toolbar.tsx` are modified (`git status`)
- [ ] `plans/README.md` status row for 029 updated

## STOP conditions

Stop and report back (do not improvise) if:

- Any of Step 2's smoke tests shows a real sandbox-caused failure (a
  feature that worked before this change breaks after it) — report exactly
  which check failed and what console error appeared. Do not add more
  sandbox tokens to try to fix it yourself; a broader `sandbox` value
  defeats more of the security benefit and is a judgment call for the
  reviewer, not the executor.
- You find more than one `<iframe>` in the codebase during the "Out of
  scope" grep check — report the others, do not modify them.
- No browser-automation tool is available AND `curl`-level checks cannot
  meaningfully verify a check (e.g. check 5's gesture-interaction test) —
  say so plainly for that specific check rather than fabricating a result.

## Maintenance notes

- If a future block or template needs a sandbox permission not in this
  plan's list (e.g. `allow-downloads` for an export feature, or
  `allow-orientation-lock` for a mobile-specific interaction), that's a
  deliberate addition someone should make consciously — pointing back at
  this plan's rationale list — not something to silently expand.
- This `sandbox` attribute lives in exactly one place
  (`block-preview-toolbar.tsx`) shared by every block and template preview;
  there's no per-block override mechanism, so any future preview-breaking
  regression traces back to this one file.
