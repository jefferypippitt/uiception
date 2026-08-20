# Plan 026: Repoint dead `README.md#block-structure` links to `content/docs`

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat b7c12b8..HEAD -- CONTRIBUTING.md AGENTS.md README.md content/docs/03-block-structure.mdx`
> If any of these changed since this plan was written, compare the "Current
> state" excerpts below against the live files before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: docs
- **Planned at**: commit `b7c12b8`, 2026-08-19

## Why this matters

Commit `b7c12b8` ("added landing v3 template") trimmed `README.md` from 79
lines to 17, deleting its "Block structure" section along with the
tech-stack table and pre-push workflow (that content now lives in
`WORKFLOW.md` and `content/docs/03-block-structure.mdx`, rendered on the
live `/docs` page). Two docs a contributor reads before touching a block —
`CONTRIBUTING.md` (the canonical contributor guide) and `AGENTS.md` (the
agent-facing conventions pointer) — still link to the now-nonexistent
`README.md#block-structure` anchor. The page loads, the section doesn't
exist: a broken pointer for exactly the audience (new contributors, and
agents like this one) that most needs a working one.

## Current state

- `README.md` (17 lines total, confirmed current):
  ```
  1: # uiception
  ...
  7: ## Documentation
  ...
  11: ## Contributing
  ...
  15: ## License
  ```
  No "Block structure" heading exists anywhere in this file.

- `CONTRIBUTING.md:47`:
  ```
  Every block follows the shadcn-style layout described in [README.md](./README.md#block-structure):
  ```

- `AGENTS.md:28`:
  ```
  After adding or editing a block, also see `README.md` ("Block structure") and
  ```
  (This is the second half of a sentence starting at line 27; read the full
  sentence in the file before editing so your replacement reads naturally.)

- `content/docs/03-block-structure.mdx` — the doc that now actually
  contains the "Block structure" content ("title: Block structure" in its
  frontmatter). It's rendered by `app/(site)/docs/page.tsx`, which maps
  every `content/docs/*.mdx` file to an `<article id={entry.slug}>` on a
  single `/docs` page (`lib/docs.ts:50`: `slug: filename.replace(/\.mdx$/, "")`).
  For this file, `filename` is `03-block-structure.mdx`, so
  `entry.slug === "03-block-structure"` and the correct live anchor is
  **`/docs#03-block-structure`**.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|----------------------|
| Confirm no other dead references | `grep -rn "README.md#block-structure\|README.md (\"Block structure\")" --include="*.md" --include="*.mdx" .` (excluding `node_modules`, `.git`) | only the two known lines from `CONTRIBUTING.md`/`AGENTS.md` before the fix; none after |
| Lint (docs are not linted, this is a no-op sanity check) | `pnpm lint` | exit 0, unaffected by this change |

## Scope

**In scope** (the only files you should modify):
- `CONTRIBUTING.md`
- `AGENTS.md`

**Out of scope** (do NOT touch, even though they look related):
- `README.md` — do not restore a "Block structure" section here; the
  maintainer deliberately trimmed it in `b7c12b8` in favor of the `/docs`
  page. This plan only fixes the dead pointers, it does not reverse that
  decision.
- `content/docs/03-block-structure.mdx` — already correct, no change needed.
- Any other section of `CONTRIBUTING.md`/`AGENTS.md` beyond the one
  sentence in each named above.

## Git workflow

- Branch: `advisor/026-fix-dead-block-structure-links`
- One commit. Message style matches this repo's convention (e.g.
  `docs: repoint block-structure links from README.md to /docs`).
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Fix `CONTRIBUTING.md:47`

Change:
```
Every block follows the shadcn-style layout described in [README.md](./README.md#block-structure):
```
to:
```
Every block follows the shadcn-style layout described in [Block structure](/docs#03-block-structure):
```

**Verify**: `grep -n "README.md#block-structure" CONTRIBUTING.md` → no matches. `grep -n "/docs#03-block-structure" CONTRIBUTING.md` → one match.

### Step 2: Fix `AGENTS.md:28`

Read the full sentence spanning lines 27–29 first (it wraps across three
lines). Replace the `README.md ("Block structure")` reference with a
pointer to the same live doc, keeping the sentence grammatical — e.g.
change:
```
After adding or editing a block, also see `README.md` ("Block structure") and
`WORKFLOW.md` (pre-push commands: `pnpm check` then `pnpm build`).
```
to:
```
After adding or editing a block, also see [Block structure](/docs#03-block-structure)
and `WORKFLOW.md` (pre-push commands: `pnpm check` then `pnpm build`).
```

**Verify**: `grep -n "README.md.*Block structure" AGENTS.md` → no matches. `grep -n "/docs#03-block-structure" AGENTS.md` → one match.

### Step 3: Confirm no other dead references remain

**Verify**: `grep -rn "README.md#block-structure" --include="*.md" --include="*.mdx" . 2>/dev/null | grep -v node_modules` → no matches anywhere in the repo.

## Test plan

No automated test applies — this is a prose/link fix in two Markdown files
with no test coverage of doc content in this repo (confirmed: no test
greps `CONTRIBUTING.md`/`AGENTS.md` content). Verification is the grep
commands in Steps 1–3.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `grep -n "README.md#block-structure" CONTRIBUTING.md AGENTS.md` returns no matches
- [ ] `grep -n "/docs#03-block-structure" CONTRIBUTING.md AGENTS.md` returns exactly one match in each file
- [ ] `pnpm lint` exits 0 (unaffected, sanity check only)
- [ ] No files outside `CONTRIBUTING.md`/`AGENTS.md` are modified (`git status`)
- [ ] `plans/README.md` status row for 026 updated

## STOP conditions

Stop and report back (do not improvise) if:

- `README.md` already has a "Block structure" heading when you check (would
  mean it was restored since this plan was written) — re-verify whether the
  fix is still needed before making any edit.
- `content/docs/03-block-structure.mdx` no longer exists or its filename
  changed (would change the correct anchor) — recompute the anchor from the
  live filename via `lib/docs.ts`'s slug rule (strip `.mdx`) rather than
  guessing.

## Maintenance notes

- If `content/docs/03-block-structure.mdx` is ever renumbered (e.g. becomes
  `02-block-structure.mdx`), its slug — and therefore this anchor — changes
  too. Nothing currently tests that `CONTRIBUTING.md`/`AGENTS.md`'s doc
  links stay in sync with actual doc filenames; that's a small follow-up
  someone could add later (a grep-based test mirroring
  `tests/registry/registry-templates.test.ts`'s stale-entry-detection
  style) but is out of scope for this plan.
