# Plan 033: Fix four stale spots in the contributor docs and workspace config

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 088cc3e..HEAD -- WORKFLOW.md CONTRIBUTING.md .env.example pnpm-workspace.yaml .cursor/rules/registry-templates.mdc package.json`
> If any of those changed since this plan was written, compare against the
> "Current state" excerpts before editing; on a mismatch, STOP.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx + docs
- **Planned at**: commit `088cc3e`, 2026-09-07

## Why this matters

Four small drifts, each cheap, together worth one pass:

1. **`pnpm check` runs `lint` but two pre-push docs don't mention it.**
   `package.json`: `"check": "pnpm registry:validate && pnpm lint && pnpm test:run && pnpm typecheck"`.
   `WORKFLOW.md` and `CONTRIBUTING.md` both describe `pnpm check` as
   "registry:validate + test:run + typecheck" and WORKFLOW.md's step-by-step
   list omits `pnpm lint` entirely. A contributor following those docs never
   runs ESLint locally, then CI rejects the push. Flagged three rounds running.
2. **`pnpm-workspace.yaml`'s `minimumReleaseAgeExclude` pins `next@16.2.12`**
   (and the 11 sibling `@next/*` packages) but `package.json` is on `next@16.3.0`.
   The list is currently inert (`minimumReleaseAge` is not configured anywhere),
   so this is dead config referencing a version no longer installed — it will
   mislead whoever next bumps Next or enables the min-release-age gate.
3. **`.cursor/rules/registry-templates.mdc` says test coverage for template
   registration points #2/#4 doesn't exist** — Plan 020 added exactly that
   coverage (`tests/registry/registry-templates.test.ts`). Stale docs that are
   actively wrong.
4. **Root `.env.example` has two truncated sentence fragments** (lines 1 and 10)
   — it's the first file a contributor opens after `pnpm install`.

## Current state

### 1. Lint step in docs

`WORKFLOW.md` (top of file):
```
# Pre-Push Workflow

Run these in order before pushing to GitHub / deploying to Vercel.

```bash
pnpm check              # registry:validate + test:run + typecheck
pnpm build              # prebuild runs registry:build, then next build (same as Vercel)
```

Or step by step:

```bash
pnpm registry:validate
pnpm registry:build     # only needed if you skip `pnpm build`
pnpm test:run
pnpm typecheck
pnpm build
```
```

`CONTRIBUTING.md` "Before opening a pull request" section:
```
Run the same checks CI runs:

```bash
pnpm check   # registry:validate + test:run + typecheck
pnpm build   # prebuild runs registry:build, then next build (same as Vercel)
```
```

`package.json:23`:
```json
"check": "pnpm registry:validate && pnpm lint && pnpm test:run && pnpm typecheck",
```

### 2. `minimumReleaseAgeExclude`

`pnpm-workspace.yaml` lines 12–24:
```yaml
minimumReleaseAgeExclude:
  - '@next/env@16.2.12'
  - '@next/swc-darwin-arm64@16.2.12'
  - '@next/swc-darwin-x64@16.2.12'
  - '@next/swc-linux-arm64-gnu@16.2.12'
  - '@next/swc-linux-arm64-musl@16.2.12'
  - '@next/swc-linux-x64-gnu@16.2.12'
  - '@next/swc-linux-x64-musl@16.2.12'
  - '@next/swc-win32-arm64-msvc@16.2.12'
  - '@next/swc-win32-x64-msvc@16.2.12'
  - next@16.2.12
  - '@next/eslint-plugin-next@16.2.12'
  - eslint-config-next@16.2.12
```

`package.json`: `"next": "16.3.0"`, `"eslint-config-next": "16.3.0"`.
`pnpm-lock.yaml` resolves `next@16.3.0`. There is **no** `minimumReleaseAge`
setting in `.npmrc` (absent), `pnpm-workspace.yaml`, or `package.json` — the
exclude list is inert today.

### 3. `registry-templates.mdc` stale claim

`.cursor/rules/registry-templates.mdc` lines 22–36:
```
A **new template** touches four places, same pattern as blocks:

1. `registry/new-york/templates/{template-name}/` — the template itself
2. `lib/templates.ts` — adds the version under its category (`id`, `title`,
   `registryPath`, `description`)
3. `registry.json` — a `registry:block` entry with `categories: ["template", ...]`,
   listing every file, `dependencies`, and any `envVars`
4. `components/template-previews/{id}.tsx` plus
   `components/template-preview-by-version.tsx` — preview definition and id map

Missing any of these breaks `pnpm registry:validate` or
`tests/registry/registry-templates.test.ts`, or leaves a dead/orphaned entry
that no test currently catches for #2/#4 (only #3's declared-files check is
enforced both directions).
```

The reality at `088cc3e` (`tests/registry/registry-templates.test.ts`):
- `#3` missing/stale: `it("has a registry.json item for every template …")` +
  `describe("template catalog has no stale registry.json entries")` — both
  directions.
- `#4` missing: `it("registers a host preview entry for every catalog template")`
  (checks both the `template-previews/{id}.tsx` file and the
  `template-preview-by-version.tsx` map entry). `#4` stale:
  `describe("template preview host has no stale entries")`.
- `#2` (`lib/templates.ts`) is the source of truth the #3/#4 checks derive from;
  a template folder that exists but is missing from `lib/templates.ts` is not
  independently caught. So the doc is right that *#2* has a gap, wrong that *#4*
  is unguarded.

### 4. `.env.example` fragments

`.env.example` lines 1 and 8–11 (`cat -A` shows them verbatim):
```
# Used only to build the "Open in v0"
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_APP_URL=

# Clerk powers the LIVE waitlist inside the landing-page-v1 template preview.
# is fine for working on UI. Grab both from https://dashboard.clerk.com/~/api-keys
# (a free dev instance), then Clerk Dashboard → Waitlist → enable waitlist.
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
```
Line 1 trails off after `"Open in v0"`. Line 10 begins mid-sentence (`# is fine
for working on UI.`).

## Commands you will need

| Purpose        | Command                             | Expected on success |
|----------------|-------------------------------------|---------------------|
| Install        | `pnpm install --frozen-lockfile`   | exit 0, lockfile unchanged |
| Typecheck      | `pnpm typecheck`                    | exit 0              |
| Full tests     | `pnpm test:run`                     | all pass (188)      |
| Lint           | `pnpm lint`                         | exit 0; 16 warnings |
| Registry validate | `pnpm registry:validate`        | all items valid     |

## Scope

**In scope**:
- `WORKFLOW.md` (modify)
- `CONTRIBUTING.md` (modify — one line)
- `pnpm-workspace.yaml` (modify — only the 12 `minimumReleaseAgeExclude` version
  strings)
- `.cursor/rules/registry-templates.mdc` (modify — one sentence)
- `.env.example` (modify — two comment lines)

**Out of scope**:
- `package.json`, `pnpm-lock.yaml` — must not change. If editing
  `pnpm-workspace.yaml` forces a lockfile change, STOP.
- Any source, test, or CI file.
- The `overrides:` / `auditConfig:` / `allowBuilds:` blocks of
  `pnpm-workspace.yaml` — leave them exactly as-is.
- `content/docs/` — the `.env.example`-per-template doc claim there is handled
  by a separate plan (034); do not touch it here.

## Git workflow

- Branch: `advisor/033-contributor-docs-and-workspace-config-refresh`
- One commit ("docs: fix stale lint-step / template-test / env-example notes").
- Do NOT push or open a PR.

## Steps

### Step 1: Add `lint` to the pre-push docs

`WORKFLOW.md`:
- Change the `pnpm check` comment to
  `# registry:validate + lint + test:run + typecheck`
- In the "Or step by step" block, add `pnpm lint` on its own line between
  `pnpm registry:build` and `pnpm test:run` so the list is:
  ```bash
  pnpm registry:validate
  pnpm registry:build     # only needed if you skip `pnpm build`
  pnpm lint
  pnpm test:run
  pnpm typecheck
  pnpm build
  ```

`CONTRIBUTING.md`:
- Change the one `pnpm check` comment to
  `# registry:validate + lint + test:run + typecheck`

**Verify**: `grep -n "registry:validate + lint + test:run + typecheck" WORKFLOW.md CONTRIBUTING.md`
→ one match in each; `grep -n "^pnpm lint$" WORKFLOW.md` → one match.

### Step 2: Refresh `minimumReleaseAgeExclude` to the installed Next version

In `pnpm-workspace.yaml`, replace `@16.2.12` with `@16.3.0` in all 12
`minimumReleaseAgeExclude` entries. Change nothing else — same keys, same order,
same quoting style.

**Verify**:
- `grep -c "16.2.12" pnpm-workspace.yaml` → `0`
- `grep -c "16.3.0" pnpm-workspace.yaml` → `12`
- `pnpm install --frozen-lockfile` → exit 0
- `git diff --stat pnpm-lock.yaml` → **no output** (lockfile unchanged)

### Step 3: Correct the `registry-templates.mdc` claim

Replace the "Missing any of these…" sentence with an accurate one:

```
Missing #1, #3, or #4 breaks `pnpm registry:validate` or
`tests/registry/registry-templates.test.ts` (which now enforces #3 and #4 in
both directions — missing entries and orphaned ones). #2 (`lib/templates.ts`)
is the catalog's source of truth; a template folder that exists but isn't listed
there is the one gap a test doesn't independently catch.
```

**Verify**: `grep -n "no test currently catches" .cursor/rules/registry-templates.mdc`
→ no matches.

### Step 4: Complete the `.env.example` fragments

- Line 1: `# Used only to build the "Open in v0"` →
  `# Used only to build the "Open in v0" links (open-in-v0-button.tsx).`
- Line 10: `# is fine for working on UI.` →
  `# Leaving these blank is fine for UI work — the page falls back to a local`
  and adjust the following line so the sentence flows, e.g.:
  ```
  # Clerk powers the LIVE waitlist inside the landing-page-v1 template preview.
  # Leaving these blank is fine for UI work — the page falls back to a local
  # demo form. Grab both keys from https://dashboard.clerk.com/~/api-keys
  # (a free dev instance), then Clerk Dashboard → Waitlist → enable waitlist.
  ```
  Keep the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=` / `CLERK_SECRET_KEY=` lines and
  every other key in the file exactly as they are — **only** the comment
  wording changes. Do not add real values.

**Verify**: `grep -nE '^# (Used only to build the "Open in v0" links|Leaving these blank)' .env.example`
→ two matches; every `KEY=` line still has an empty right-hand side
(`grep -nE '=[^ ]' .env.example` → only the `.../REDIRECT_URL=/` lines, if any).

### Step 5: Full verification

- `pnpm typecheck` → exit 0
- `pnpm lint` → exit 0, 16 warnings
- `pnpm test:run` → all pass (188)
- `pnpm registry:validate` → all items valid
- `git diff --stat 088cc3e..HEAD` → exactly the 5 in-scope files, no lockfile

## Test plan

No new tests — documentation and inert-config only. The guards are:
- `pnpm test:run` still green (proves `registry-templates.test.ts` behaves as the
  corrected doc now describes).
- `pnpm install --frozen-lockfile` green with zero `pnpm-lock.yaml` diff (proves
  the `minimumReleaseAgeExclude` edit is purely cosmetic).

## Done criteria

ALL must hold:

- [ ] `grep -rn "registry:validate + lint + test:run + typecheck" WORKFLOW.md CONTRIBUTING.md`
      → one match each
- [ ] `grep -n "^pnpm lint$" WORKFLOW.md` → one match
- [ ] `grep -c "16.2.12" pnpm-workspace.yaml` → 0
- [ ] `git diff --stat pnpm-lock.yaml` → no output
- [ ] `grep -c "no test currently catches" .cursor/rules/registry-templates.mdc` → 0
- [ ] `.env.example` has no trailing/leading sentence fragments; all `KEY=` values
      still blank
- [ ] `pnpm test:run`, `pnpm typecheck`, `pnpm lint`, `pnpm registry:validate`
      all pass, warning count 16
- [ ] `git diff --stat 088cc3e..HEAD` → only the 5 in-scope files
- [ ] `plans/README.md` row updated (unless a reviewer owns the index)

## STOP conditions

Stop and report if:

- Editing `pnpm-workspace.yaml`'s `minimumReleaseAgeExclude` produces any
  `pnpm-lock.yaml` diff on `pnpm install --frozen-lockfile` — that means the
  field is not inert as this plan assumes; report before proceeding.
- `package.json`'s `next` version is not `16.3.0` at HEAD (drift) — use whatever
  version `package.json` actually declares for the exclude-list strings, and note
  it.
- The `registry-templates.test.ts` structure at HEAD no longer matches the
  "Current state" description of what it enforces — re-read it and write the
  `.mdc` correction to match reality.

## Maintenance notes

- If `minimumReleaseAge` is ever actually configured, revisit whether the
  exclude list should be maintained by hand or dropped — a stale allow-list is
  worse than none.
- The `#2` (`lib/templates.ts`) gap the corrected `.mdc` now names honestly could
  be closed with a folder-scan test (walk `registry/new-york/templates/*`, assert
  each dir has a `lib/templates.ts` entry). Deferred — not in scope here.
- Reviewer: confirm no key values were added to `.env.example` and the lockfile
  is byte-unchanged.
