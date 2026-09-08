# Plan 032: A test asserts `pnpm-workspace.yaml` security `overrides` are actually applied in the lockfile

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 088cc3e..HEAD -- pnpm-workspace.yaml pnpm-lock.yaml tests/registry`
> If `pnpm-workspace.yaml` changed since this plan was written, re-read its
> `overrides:` block and adjust the expected-values in Step 2 accordingly before
> proceeding.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dependencies
- **Planned at**: commit `088cc3e`, 2026-09-07

## Why this matters

Plan 016 (a prior round) moved this repo's security-pin `overrides` out of
`package.json` — where pnpm 11 silently ignores them — into
`pnpm-workspace.yaml`, specifically so the pins could not go inert unnoticed.
The only thing that currently notices a pin ceasing to apply is the CI
`pnpm audit --prod --audit-level high` step, and that has two blind spots:

- It fires only if the re-exposed advisory is still GitHub-rated **HIGH**. Three
  of the six pins (`nanoid`, `sharp`, `gray-matter>js-yaml`) patch advisories
  that are rated **moderate** — a regression on those passes `--audit-level high`
  silently.
- It depends on the npm advisory API being reachable in CI (commit `088cc3e`
  just added retry logic because it often times out).

No test asserts the `overrides` resolved. This plan adds one: it checks that the
lockfile's `overrides:` header matches `pnpm-workspace.yaml`, and that every
simple pinned package resolves at or above its floor in the lockfile. That makes
all six pins self-verifying in `pnpm check` regardless of advisory severity or
network.

## Current state

- `pnpm-workspace.yaml` — full file at `088cc3e`:

  ```yaml
  allowBuilds:
    bufferutil: false
    core-js: false
    msw: true
    sharp: true
    unrs-resolver: true
    utf-8-validate: false
  auditConfig:
    ignoreGhsas:
      - GHSA-w3rx-r6r6-pgpr
      - GHSA-5p2g-fcmc-qvqq
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
  overrides:
    postcss: ^8.5.10
    "@babel/core": ^7.29.6
    browserslist: ^4.28.7
    "gray-matter>js-yaml": ^3.15.1
    sharp: ^0.35.0
    nanoid: ^3.3.18
  ```

- `pnpm-lock.yaml` — `lockfileVersion: '9.0'`. Its header echoes the effective
  overrides (this is what pnpm actually applied):

  ```yaml
  overrides:
    postcss: ^8.5.10
    '@babel/core': ^7.29.6
    browserslist: ^4.28.7
    gray-matter>js-yaml: ^3.15.1
    sharp: ^0.35.0
    nanoid: ^3.3.18
  ```

  Note pnpm normalizes quoting (`"@babel/core"` → `'@babel/core'`,
  `"gray-matter>js-yaml"` → `gray-matter>js-yaml`). The **key/value pairs**
  match; the surrounding quote characters do not. The test must compare
  semantically (strip quotes), not byte-for-byte.

  Resolved versions currently in the lockfile (grep
  `^\s+<pkg>@` in `pnpm-lock.yaml`):
  - `postcss@8.5.19` (only version)
  - `@babel/core@7.29.7` (only version)
  - `browserslist@4.28.8` (only version)
  - `sharp@0.35.0` (only version)
  - `nanoid@3.3.18` (only version)
  - `js-yaml@3.15.1` **and** `js-yaml@4.1.1` — the `4.1.1` is a *different*
    package's legit dependency; the `gray-matter>js-yaml` pin only constrains
    gray-matter's copy, so the test must NOT assert "no js-yaml 4.x anywhere".

- Existing test infra: `tests/registry/*.test.ts` are vitest, Node env. Helper
  `tests/registry/load-registry.ts` exports `registryProjectRoot as root`
  (absolute path to the repo root). Tests read files with
  `readFileSync` from `node:fs` + `join` from `node:path`. No YAML parser
  dependency is available — parse with string/line logic.

### Repo conventions to match

- Model the new file on an existing config-reading test:
  `tests/registry/registry-npm-deps.test.ts` (imports `readFileSync`,
  `node:path`, `loadRegistry`/`registryProjectRoot` from `./load-registry`,
  `describe`/`it`/`expect` from vitest).
- Keep it dependency-free — plain string parsing, no `yaml`/`js-yaml`/`semver`
  imports (none are direct deps).

## Commands you will need

| Purpose        | Command                                                    | Expected on success |
|----------------|-----------------------------------------------------------|---------------------|
| Install        | `pnpm install`                                            | exit 0              |
| Targeted test  | `pnpm vitest run tests/registry/pnpm-overrides.test.ts`   | all pass            |
| Full tests     | `pnpm test:run`                                           | all pass            |
| Typecheck      | `pnpm typecheck`                                          | exit 0              |
| Lint           | `pnpm lint`                                               | exit 0; 16 pre-existing warnings |

Fresh worktree: `pnpm install` first (this also confirms the lockfile is
consistent with `pnpm-workspace.yaml` — `--frozen-lockfile` in CI would fail
otherwise).

## Scope

**In scope**:
- `tests/registry/pnpm-overrides.test.ts` (create)

**Out of scope** (do NOT touch):
- `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `package.json` — this plan only adds
  a test. If the test *fails* on the current tree, that is a real finding — STOP
  and report it, do not "fix" it by editing the lockfile.
- Any other test file, any source file, CI config.

## Git workflow

- Branch: `advisor/032-pnpm-overrides-regression-guard`
- One commit. Short imperative message.
- Do NOT push or open a PR.

## Steps

### Step 1: Write the test

Create `tests/registry/pnpm-overrides.test.ts`:

```ts
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { registryProjectRoot as root } from "./load-registry"

/** Pull the `key: value` pairs out of a top-level `overrides:` block in a YAML
 *  file, normalising away quote characters. */
function parseOverridesBlock(yaml: string): Record<string, string> {
  const lines = yaml.split(/\r?\n/)
  const start = lines.findIndex((l) => l.trimEnd() === "overrides:")
  if (start === -1) throw new Error("no `overrides:` block found")

  const out: Record<string, string> = {}
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim() === "") break
    if (!/^\s+\S/.test(line)) break // dedented back to a new top-level key
    const m = line.match(/^\s+(.+?):\s*(.+?)\s*$/)
    if (!m) continue
    const key = m[1].trim().replace(/^['"]|['"]$/g, "")
    const value = m[2].trim().replace(/^['"]|['"]$/g, "")
    out[key] = value
  }
  return out
}

/** Does `version` satisfy the caret range `^A.B.C` (same major, >= A.B.C)? */
function satisfiesCaret(range: string, version: string): boolean {
  const r = range.replace(/^\^/, "").split(".").map(Number)
  const v = version.split(".").map(Number)
  if (v[0] !== r[0]) return false
  if (v[1] !== r[1]) return v[1] > r[1]
  return (v[2] ?? 0) >= (r[2] ?? 0)
}

const workspace = readFileSync(join(root, "pnpm-workspace.yaml"), "utf8")
const lock = readFileSync(join(root, "pnpm-lock.yaml"), "utf8")

const declared = parseOverridesBlock(workspace)
const effective = parseOverridesBlock(lock)

describe("pnpm-workspace.yaml overrides are applied", () => {
  it("the lockfile's overrides header matches pnpm-workspace.yaml", () => {
    expect(effective).toEqual(declared)
  })

  const simple = Object.entries(declared).filter(([key]) => !key.includes(">"))

  it.each(simple)(
    "%s resolves at or above its pinned floor in the lockfile",
    (pkg, range) => {
      const re = new RegExp(
        `^\\s+'?${pkg.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}'?@(\\d+\\.\\d+\\.\\d+)`,
        "gm"
      )
      const found = [...lock.matchAll(re)].map((m) => m[1])
      expect(found.length, `no resolved ${pkg} in pnpm-lock.yaml`).toBeGreaterThan(0)
      for (const version of found) {
        expect(
          satisfiesCaret(range, version),
          `${pkg}@${version} does not satisfy the pinned override ${range}`
        ).toBe(true)
      }
    }
  )

  const scoped = Object.entries(declared).filter(([key]) => key.includes(">"))

  it.each(scoped)(
    "scoped override %s has a matching-major resolution present",
    (key, range) => {
      const child = key.split(">").pop()!
      const major = range.replace(/^\^/, "").split(".")[0]
      const re = new RegExp(
        `^\\s+'?${child}'?@${major}\\.`,
        "m"
      )
      expect(
        re.test(lock),
        `expected a ${child}@${major}.x resolution in pnpm-lock.yaml for override ${key}`
      ).toBe(true)
    }
  )
})
```

### Step 2: Sanity-check the expectations against the real tree

Confirm the values this test asserts still match reality:

- `grep -A8 '^overrides:' pnpm-workspace.yaml` — 6 entries, as in "Current state".
- `grep -A8 '^overrides:' pnpm-lock.yaml` — same 6 keys/values.
- `grep -E "^\s+(postcss|browserslist|nanoid|sharp)@|'@babel/core'@|js-yaml@" pnpm-lock.yaml` —
  every listed `postcss`/`browserslist`/`nanoid`/`sharp`/`@babel/core` is a
  single version at/above the floor; `js-yaml` shows a `3.15.1` (and a separate
  `4.1.1`, which the test ignores).

If any of these differ, the test's regexes or expectations need adjusting — do
that, keeping the intent (header match + floor check).

**Verify**: `pnpm vitest run tests/registry/pnpm-overrides.test.ts` → all pass.

### Step 3: Full verification

- `pnpm typecheck` → exit 0
- `pnpm lint` → exit 0, 16 warnings (unchanged)
- `pnpm test:run` → all pass; the new file adds ~8 test cases (1 header +
  5 simple floors + 1 scoped, via `it.each`)
- `git diff --stat 088cc3e..HEAD` → only `tests/registry/pnpm-overrides.test.ts`

## Test plan

- New `tests/registry/pnpm-overrides.test.ts`:
  - `effective` (lockfile header) deep-equals `declared` (pnpm-workspace.yaml),
    quotes normalised.
  - each non-scoped override (`postcss`, `@babel/core`, `browserslist`, `sharp`,
    `nanoid`): every resolved `pkg@x.y.z` in the lockfile satisfies the caret.
  - each scoped override (`gray-matter>js-yaml`): a `js-yaml@3.x` resolution
    exists.
- Model: `tests/registry/registry-npm-deps.test.ts`.

## Done criteria

ALL must hold:

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm lint` exits 0; 16 warnings, none new
- [ ] `pnpm test:run` exits 0; `tests/registry/pnpm-overrides.test.ts` runs and
      every case passes
- [ ] The test genuinely exercises the assertion — temporarily changing
      `browserslist: ^4.28.7` to `browserslist: ^99.0.0` in a scratch copy of the
      parse input (NOT the real file) would fail the floor check. (You don't have
      to perform this; it's a description of what "meaningful" means for review.)
- [ ] `git diff --stat 088cc3e..HEAD` shows only the one new test file
- [ ] `plans/README.md` row updated (unless a reviewer owns the index)

## STOP conditions

Stop and report if:

- The new test FAILS on the current tree. That means an override has genuinely
  drifted (or the lockfile is stale) — a real finding. Report which assertion
  failed and the observed values. Do NOT edit `pnpm-workspace.yaml` /
  `pnpm-lock.yaml` to make it pass.
- `pnpm-workspace.yaml`'s `overrides:` block at HEAD differs from "Current state"
  (drift) — report the new block; the Step 1 test is generic enough to still
  work but Step 2's expectations need a re-check.
- The lockfile format differs enough that `parseOverridesBlock` can't find an
  `overrides:` block (e.g. lockfileVersion bumped and the header moved) — report
  it; do not force a brittle parse.

## Maintenance notes

- If a future override uses a non-caret range (`~`, `>=`, exact), extend
  `satisfiesCaret` or branch on the range operator — right now every pin is a
  caret.
- This test does not do full dependency-graph resolution, so a `parent>child`
  scoped override is only checked loosely (a matching-major resolution exists).
  That's deliberate — tight verification would need `pnpm list --json` and a
  graph walk. Revisit only if a scoped pin regression slips through.
- A reviewer should confirm the header-match assertion (`effective` vs
  `declared`) is the load-bearing one — it's what catches "edited the workspace
  file, forgot to run install".
