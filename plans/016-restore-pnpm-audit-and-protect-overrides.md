# Plan 016: Restore a working `pnpm audit` and protect the existing security overrides

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **This plan intentionally bundles two coupled findings.** The audit that
> produced this plan found (1) `pnpm audit` is non-functional on this repo's
> pinned pnpm v10 because the npm registry permanently retired the legacy
> audit endpoint it depends on (scheduled retirement completed 2026-07-15),
> and (2) the *only* fix — bumping to pnpm v11+ — would silently stop
> `package.json`'s `pnpm.overrides` field from being read at all, since
> pnpm 11 no longer reads settings from the `pnpm` field in `package.json`.
> Those three overrides exist specifically to patch known-vulnerable
> transitive dependencies. Fixing (1) without also fixing (2) in the same
> change would ship a real security regression as a side effect of a
> security fix — so this plan does both together, deliberately, rather than
> as two separate plans that could land out of order.
>
> **Drift check (run first)**: `git diff --stat 059f954..HEAD -- package.json pnpm-lock.yaml .github/workflows/ci.yml`
> If any of these changed since this plan was written, re-run the `pnpm
> --version` / `cat package.json` commands in "Current state" yourself
> before proceeding — the exact versions/line numbers below may be stale.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `059f954`, 2026-07-15

## Why this matters

`pnpm audit` is this repo's only tool for detecting known-vulnerable
dependencies, but it currently fails outright: `pnpm audit --json` on the
repo's pinned toolchain (pnpm `10.13.1`, matching `.github/workflows/ci.yml`'s
`pnpm/action-setup@v4` pin of `version: 10`) returns
`ERR_PNPM_AUDIT_BAD_RESPONSE` — the npm registry's legacy audit endpoint
responds `410 This endpoint is being retired. Use the bulk advisory
endpoint instead.` This isn't a transient outage: npm scheduled a brownout
leading to permanent retirement of the legacy endpoint effective
2026-07-15, and pnpm's own maintainers confirmed the fix is upgrading to
pnpm v11+, which uses the new bulk-advisory endpoint. `pnpm check` never
called `audit` in the first place (confirmed via `package.json`), so this
isn't a CI regression — automated dependency-vulnerability detection has
never actually been wired into this repo; it was always meant to be run
manually, and manual runs have been silently failing since the endpoint's
retirement.

Separately, `package.json`'s `"pnpm": { "overrides": {...} }` block pins
`postcss`, `@babel/core`, and `gray-matter>js-yaml` to patched version
ranges — the `js-yaml` pin specifically patches a known-vulnerable range in
a transitive dependency of `gray-matter` (used for changelog MDX
frontmatter parsing). Confirmed via a pnpm v11 dry run: pnpm 11 prints
`[WARN] The "pnpm" field in package.json is no longer read by pnpm. The
following keys were ignored: "pnpm.overrides"` — meaning the moment this
repo's toolchain moves to pnpm 11+ (required to fix the audit above), these
three security pins go silently inert, with no audit gate (since that's the
very thing being fixed) to catch the regression. pnpm 11 instead reads
`overrides` from a root-level `pnpm-workspace.yaml` file.

This plan bumps the pinned pnpm version, migrates the overrides to their
new location in the same change, and adds a CI step so a working audit
actually gets enforced going forward.

## Current state

- `package.json:79-85` — the block to remove:
  ```json
  "pnpm": {
    "overrides": {
      "postcss": "^8.5.10",
      "@babel/core": "^7.29.6",
      "gray-matter>js-yaml": "^3.15.0"
    }
  }
  ```
- `package.json` — no `"packageManager"` field exists today (confirmed via `grep -n "packageManager" package.json`, no match).
- `.github/workflows/ci.yml:15-18`:
  ```yaml
  - name: Setup pnpm
    uses: pnpm/action-setup@v4
    with:
      version: 10
  ```
- `.github/workflows/ci.yml:20-24` — Node is already pinned to `node-version: 22`, which satisfies pnpm 11's minimum Node requirement (Node 22+) — no Node version change needed.
- No `pnpm-workspace.yaml` exists at the repo root today.
- Local pnpm: `10.13.1`. Lockfile: `pnpm-lock.yaml` header shows `lockfileVersion: '9.0'`.
- Latest stable pnpm at planning time: `11.13.0` (confirmed via `npm view pnpm dist-tags` — `latest: '11.13.0'`; this is a stable release, not a prerelease — pnpm 11 passed through alpha/beta/rc stages and has been generally available since before this plan was written).
- `package.json:21` — `"check": "pnpm registry:validate && pnpm lint && pnpm test:run && pnpm typecheck"` — does not include `audit`; this plan adds `audit` as a separate script and CI step, not folded into `check`, so that a future dependency advisory doesn't block every local pre-push `pnpm check` run the way a correctness failure should.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Check current pnpm | `pnpm --version` | `10.13.1` (before), `11.13.0` (after Step 2) |
| Install | `pnpm install` | exit 0 |
| Audit | `pnpm audit --prod --audit-level high` | exit 0 after the fix (no HIGH/CRITICAL advisories in production dependencies today) |
| Verify override still applies | `pnpm why postcss` | shows the overridden version range, not whatever `postcss`'s own dependents would resolve to unpinned |
| Full check | `pnpm check` | exit 0 |
| Build | `pnpm build` | exit 0 |

## Scope

**In scope**:
- `package.json` — remove the `pnpm.overrides` block, add `packageManager`, add an `audit` script.
- `pnpm-workspace.yaml` — new file, holds the migrated `overrides`.
- `pnpm-lock.yaml` — regenerated by `pnpm install` under pnpm 11.
- `.github/workflows/ci.yml` — bump the `pnpm/action-setup` version and add an audit step.

**Out of scope**:
- Fixing any of the 33 advisories `pnpm audit` surfaces once it works again
  (per the audit that produced this plan, all resolve only through
  `devDependencies` paths — eslint config chain, `vitest`→`vite`, `shadcn`
  CLI's bundled MCP SDK — none in production code). This plan restores the
  *tool*, not a dependency-upgrade spree. If the fresh `pnpm audit --prod
  --audit-level high` run in Step 4 surfaces something unexpected in
  *production* dependencies, STOP and report rather than silently
  upgrading packages to fix it — that's a separate, evaluated decision.
- The three icon libraries (`lucide-react`/`@phosphor-icons/react`/`@tabler/icons-react`) or any other dependency-consolidation finding — unrelated.
- Adding security response headers (CSP, etc.) — a separate finding, not part of this plan.
- Renaming or restructuring `pnpm.overrides`' three pinned ranges — carry them forward exactly as-is; if you believe one is now unnecessary (e.g. the upstream package no longer has the vulnerable transitive dependency), do not remove it as part of this plan — report it instead.

## Git workflow

- Branch: `advisor/016-restore-pnpm-audit-and-protect-overrides`
- Commit per logical step is fine, or a single commit — match repo convention (most prior `advisor/*` plans in this repo landed as one commit). Conventional-commit style, e.g.:
  `chore(deps): bump pnpm to v11, migrate overrides, restore working audit`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Migrate the overrides to `pnpm-workspace.yaml`

Create `pnpm-workspace.yaml` at the repo root:

```yaml
overrides:
  postcss: ^8.5.10
  "@babel/core": ^7.29.6
  "gray-matter>js-yaml": ^3.15.0
```

Remove the `"pnpm": { "overrides": {...} }` block from `package.json`
entirely (the whole `"pnpm"` top-level key, since overrides was its only
content).

**Verify**: `grep -n '"pnpm":' package.json` returns no matches. `cat pnpm-workspace.yaml` shows the three overrides.

### Step 2: Pin the package manager and bump the CI pnpm version

Add to `package.json` (top level, alongside `"private"`/`"type"`):

```json
"packageManager": "pnpm@11.13.0",
```

(Use whatever the actual latest stable `11.x` version is at execution time
if `11.13.0` is no longer current — check with `npm view pnpm version`.
Keep this in lockstep with the version set in CI in the next step.)

Edit `.github/workflows/ci.yml`, change:

```yaml
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10
```

to:

```yaml
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 11.13.0
```

(Match whatever exact version you used for `packageManager` above — keeping
these two in lockstep avoids a corepack/action-setup version mismatch.)

**Verify**: `grep -n "packageManager" package.json` shows the pinned version; `grep -A2 "Setup pnpm" .github/workflows/ci.yml` shows the matching version.

### Step 3: Reinstall under pnpm 11 and regenerate the lockfile

If pnpm isn't already at the version you pinned, install/activate it first
(e.g. `corepack use pnpm@11.13.0` or `npm install -g pnpm@11.13.0`,
whichever this environment supports), then:

```bash
pnpm install
```

**Verify**: exit 0. `pnpm --version` now reports the pinned `11.x` version.
`head -1 pnpm-lock.yaml` shows an updated `lockfileVersion` (pnpm 11 uses a
newer lockfile format than `9.0` — an automatic migration, not something
you need to hand-edit).

### Step 4: Confirm the overrides still apply and the audit now works

```bash
pnpm why postcss
pnpm audit --prod --audit-level high
```

**Verify**: `pnpm why postcss` shows the version resolved is consistent with
the `^8.5.10` override (not an unpinned lower version some dependency might
otherwise pull in). `pnpm audit --prod --audit-level high` **exits 0** (no
error, and no HIGH/CRITICAL advisories in production dependencies, per the
audit that produced this plan) — if it errors with the same
`ERR_PNPM_AUDIT_BAD_RESPONSE` as before, the version bump didn't take
effect; re-check Step 3.

### Step 5: Add an `audit` script and wire it into CI

Add to `package.json`'s `"scripts"` block (near `lint`/`typecheck`, not
inside `check`):

```json
"audit": "pnpm audit --prod --audit-level high",
```

Add a new step to `.github/workflows/ci.yml`, after the existing "Run
checks" step:

```yaml
      - name: Dependency audit
        run: pnpm audit --prod --audit-level high
```

**Verify**: `grep -n '"audit"' package.json` shows the new script.
`grep -A2 "Dependency audit" .github/workflows/ci.yml` shows the new CI
step. This step is deliberately separate from `pnpm check`/the "Run checks"
step, not folded into it — a dependency-audit failure is a different kind
of signal than a lint/type/test failure and shouldn't be silently mixed in.

### Step 6: Full regression check

```bash
pnpm check
pnpm build
```

**Verify**: both exit 0. A pnpm major-version bump can occasionally change
hoisting/resolution behavior even without any `package.json` dependency
version changes — this step confirms the whole toolchain still works
end-to-end, not just the audit path.

## Test plan

No new automated tests apply here — this plan changes tooling/config, not
application code. The existing `tests/registry/*.test.ts` and
`tests/wordle/*.test.ts` suites (run via `pnpm check` in Step 6) are the
regression guard, confirming the pnpm version bump didn't change resolved
dependency behavior in a way that breaks anything.

## Done criteria

- [ ] `package.json` no longer has a `"pnpm"` top-level key; has a `"packageManager"` field pinning pnpm 11.x
- [ ] `pnpm-workspace.yaml` exists with the same three `overrides` entries that were previously in `package.json`
- [ ] `.github/workflows/ci.yml`'s `pnpm/action-setup` step and `package.json`'s `packageManager` field pin the same pnpm version
- [ ] `pnpm why postcss` confirms the override still applies
- [ ] `pnpm audit --prod --audit-level high` exits 0 locally
- [ ] `package.json` has a new `"audit"` script; `.github/workflows/ci.yml` has a new "Dependency audit" step calling it
- [ ] `pnpm check` exits 0
- [ ] `pnpm build` exits 0
- [ ] No files outside `package.json`, `pnpm-workspace.yaml` (new), `pnpm-lock.yaml`, `.github/workflows/ci.yml` modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- `pnpm install` under the new version fails to resolve, or produces peer-dependency errors it didn't before — do not force-resolve with `--force` or by loosening a version constraint; report the exact error.
- `pnpm why postcss` (or the equivalent check for `@babel/core`/`gray-matter>js-yaml`) shows the override is NOT being applied after migrating to `pnpm-workspace.yaml` — this would mean the migration syntax is wrong; do not proceed to remove the old `package.json` block's fallback without confirming the new location works. STOP and report rather than guessing at alternate syntax.
- `pnpm audit --prod --audit-level high` (Step 4, first run after the bump) surfaces a genuine HIGH/CRITICAL advisory in a *production* dependency — this is new information the plan didn't anticipate (the pre-planning audit found zero). STOP and report the advisory details rather than silently upgrading the flagged package; that's a separate decision for the operator.
- `pnpm build` fails in a way that traces to the pnpm version bump itself (not to the overrides or audit changes) — report the exact error; do not attempt to work around a pnpm 11 behavior change by downgrading back to 10 without reporting first, since that would silently leave the audit broken again.

## Maintenance notes

- The `audit` CI step uses `--audit-level high` deliberately — the 33
  advisories found during planning are all MODERATE/LOW or resolve only
  through dev-only dependency paths; gating CI on every such advisory would
  create noise this repo's maintainer would likely just learn to ignore.
  Revisit the threshold if the project's risk tolerance changes.
- If a future advisory legitimately can't be fixed by upgrading (e.g. no
  patched version exists yet, same situation `gray-matter>js-yaml` was
  originally in), the fix is another `pnpm-workspace.yaml` override entry —
  now that the override mechanism is confirmed working post-migration, that
  path stays open.
- Whoever next touches `package.json`'s dependency versions should be aware
  `packageManager` now pins the exact pnpm version used for install — CI and
  local dev should stay in sync via corepack; if `pnpm --version` locally
  ever drifts from the pinned value, `corepack use pnpm@<pinned-version>`
  resolves it.
