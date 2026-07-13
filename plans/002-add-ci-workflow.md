# Plan 002: Add a GitHub Actions workflow that enforces `pnpm check` on every PR

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 8c219d4..HEAD -- package.json .github/`
> If either changed since this plan was written, re-read the current
> `package.json` scripts and confirm `.github/workflows/` is still absent
> before proceeding. On a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none (but plans 006 and 008 add new tests — landing this plan first means those tests are enforced automatically the moment they merge, rather than relying on a human running `pnpm check` locally)
- **Category**: dx
- **Planned at**: commit `8c219d4`, 2026-07-09

## Why this matters

`README.md:49-56` and `WORKFLOW.md:1-8` both document `pnpm check` (which
runs `registry:validate` + `test:run` + `typecheck`) followed by `pnpm build`
as the required pre-push sequence. Nothing enforces this automatically:
`.github/workflows/` does not exist in this repo, and Vercel's own build step
only runs `next build` (via the `prebuild: registry:build` hook) — it never
runs `test:run` or `typecheck`. The only safety net today is a human
remembering to run `pnpm check` before pushing. Adding a CI workflow makes
the documented gate real and automatic, and it's what makes the new tests
added in plans 006 and 008 actually load-bearing instead of optional.

## Current state

- `package.json:21` — `"check": "pnpm registry:validate && pnpm test:run && pnpm typecheck"`
- `package.json:12-25` — full scripts block for reference:
  ```json
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "prebuild": "pnpm registry:build",
    "start": "next start",
    "lint": "eslint",
    "format": "prettier --write \"**/*.{ts,tsx}\"",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run",
    "check": "pnpm registry:validate && pnpm test:run && pnpm typecheck",
    "registry:validate": "shadcn registry validate",
    "registry:build": "shadcn build",
    "images:compress": "node scripts/compress-images.mjs",
    "videos:compress": "node scripts/compress-videos.mjs"
  }
  ```
- `.github/workflows/` does not exist (confirmed via directory listing at plan time).
- `pnpm-lock.yaml:1` — `lockfileVersion: '9.0'`, indicating a pnpm 9+/10-compatible lockfile. The local dev environment used pnpm `10.13.1` and Node `v24.14.0` at the time of the audit; `README.md:24` states the project requirement is only "Node.js 20+, pnpm" with no exact pin. Use Node 22 (current LTS) and pnpm major version 10 in the workflow — both satisfy the documented minimum and match what was verified to work locally.
- No `packageManager` field in `package.json`, no `.npmrc`, no `.nvmrc` — nothing else to read a pinned version from.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Local dry run | `pnpm check` | exit 0 |
| Lint (not currently part of `check`, do not add it to the workflow beyond what `check` already does unless asked) | `pnpm lint` | exit 0 |

## Scope

**In scope**:
- New file: `.github/workflows/ci.yml`

**Out of scope**:
- Do not add `pnpm build` to the workflow's required steps beyond what's specified in Step 1 — keep this plan focused on `pnpm check`, matching the leverage of "make the documented gate real." Adding a full production build to CI is a reasonable follow-up but doubles CI time and is not what was asked for here; note it in "Maintenance notes" instead.
- Do not add a deploy step, a release step, or any secrets/environment configuration — this workflow only needs to check out code, install dependencies, and run `pnpm check`.
- Do not modify `package.json` scripts.
- Do not add Dependabot or other dependency-update automation — out of scope for this plan.

## Git workflow

- Branch: `advisor/002-add-ci-workflow`
- Single commit, conventional-commit style matching repo history, e.g.:
  `feat(ci): add GitHub Actions workflow to enforce pnpm check on PRs`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create the workflow file

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run checks
        run: pnpm check
```

**Verify**: `cat .github/workflows/ci.yml` shows valid YAML (no tabs, consistent 2-space indent matching the block above). If you have a YAML linter available, run it; otherwise visually confirm indentation is consistent.

### Step 2: Validate the workflow locally as far as possible

You cannot run GitHub Actions locally without additional tooling (`act` is not assumed to be installed). Instead, validate the two things the workflow depends on:

```bash
pnpm install --frozen-lockfile
pnpm check
```

**Verify**: both commands exit 0 on your current branch. This confirms the exact commands the workflow will run succeed outside of CI.

### Step 3: Confirm the workflow triggers are correct

Re-read the `on:` block you wrote and confirm it matches: runs on every pull request (any target branch) and on every push to `main`. Do not scope it to specific paths (e.g. `paths: ["registry/**"]`) — the whole point is that `pnpm check` also validates non-registry app code (typecheck covers `app/`, `lib/`, `hooks/`, etc.), so a path filter would defeat the purpose.

## Test plan

No application tests are added by this plan. The "test" for this plan is the workflow itself running successfully once pushed — which the executor cannot observe directly in an isolated worktree. Confirm correctness via Steps 2 and 3 above (running the exact underlying commands locally, and reviewing the trigger config) instead.

## Done criteria

- [ ] `.github/workflows/ci.yml` exists and contains valid YAML
- [ ] The workflow's `run` step is exactly `pnpm check` (or `pnpm install --frozen-lockfile` followed by `pnpm check`)
- [ ] `pnpm check` exits 0 when run locally against the current branch
- [ ] No files outside `.github/workflows/ci.yml` modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- `pnpm install --frozen-lockfile` fails locally — this means `pnpm-lock.yaml` is out of sync with `package.json` on the current branch, which is a pre-existing problem unrelated to this plan. Report it rather than running a bare `pnpm install` to "fix" the lockfile as a side effect of this plan.
- `pnpm check` fails locally for reasons unrelated to CI setup (e.g. a real test failure) — do not add `continue-on-error` or otherwise weaken the workflow to work around a failing check. Report the failure.

## Maintenance notes

- If a future contributor adds `pnpm build` to the required pre-push sequence in `README.md`/`WORKFLOW.md`, the CI workflow should be updated to match — currently it intentionally only runs `pnpm check`, not `pnpm build`, to keep CI fast (see "Out of scope" above).
- If Plans 006 or 008 (new Vitest tests) land after this plan, no workflow change is needed — `pnpm check` already runs the full `tests/**/*.test.ts` suite via `pnpm test:run`, so new test files are picked up automatically.
- Branch protection rules (requiring this check to pass before merge) are a repo-settings change, not a code change, and are out of scope for this plan — mention to the human maintainer as a follow-up.
