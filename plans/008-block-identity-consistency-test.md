# Plan 008: Add a test that keeps `lib/blocks.ts`, `block-preview-by-version.tsx`, and `registry.json` in sync

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 8c219d4..HEAD -- lib/blocks.ts components/block-preview-by-version.tsx registry.json`
> If any of these changed since this plan was written, re-run the counting
> commands in "Current state" yourself before proceeding — the exact counts
> quoted below (77 entries, 109 total `id:` matches) will be stale.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none (pairs well with Plan 002 — CI — so this check runs automatically on every PR once both land)
- **Category**: tech-debt
- **Planned at**: commit `8c219d4`, 2026-07-09

## Why this matters

Which blocks exist is currently hand-maintained in three separate places
with no automated check that they agree:

1. `lib/blocks.ts` — the category taxonomy and every block version's `id`/`title`/`registryPath`, used to render the browse-by-category site pages.
2. `components/block-preview-by-version.tsx` — a hand-written import + `Record<string, ComponentType>` lookup keyed by the same `id` strings, used to render the actual preview iframe content at `/view/[versionId]`.
3. `registry.json` — the shadcn-CLI registry manifest (built via `pnpm registry:build`), the source of truth for what `npx shadcn add` actually installs.

These two files are the two highest-churn files in the repo's git history (24
changes each in the last 100 commits, per `git log --oneline -100
--name-only`), because every new block requires a manual, unchecked edit to
each of the three. Today they happen to be in sync — the audit verified 109
total `id:` occurrences in `lib/blocks.ts` (32 category ids + 77 version
ids) exactly match the 77 keys in `block-preview-by-version.tsx`'s
`blockComponents` map. But nothing enforces this: if a future block is added
to `lib/blocks.ts` and someone forgets the corresponding entry in
`block-preview-by-version.tsx`, the failure mode is silent and cosmetic — the
preview route just renders `Preview not available for "…"` (see
`block-preview-by-version.tsx:162-167`) instead of failing a build or a test.
This plan adds the missing safety net as a Vitest test, following this
repo's existing convention of static-source-parsing tests under
`tests/registry/`.

## Current state

### `lib/blocks.ts:1-46` — types (pure data module, safe to import directly in a test; no React/CSS side effects)

```ts
export type BlockCategoryId =
  | "navbar" | "hero-section" | "brands" | "how-it-works" | "case-study"
  | "about-us" | "resources" | "value-proposition" | "features"
  | "integrations" | "pricing" | "testimonials" | "cta" | "faq" | "stats"
  | "footer" | "changelog" | "team" | "contact" | "blog" | "gallery"
  | "video" | "timeline" | "comparison" | "newsletter" | "waitlist"
  | "social-proof" | "partners" | "backgrounds" | "sidebar" | "banner"
  | "mockups"

export type BlockVersion = {
  id: string
  title: string
  registryPath: string
}

export type BlockCategory = {
  id: BlockCategoryId
  title: string
  description: string
  versions: BlockVersion[]
}

export const blockCategories: BlockCategory[] = [ /* ...32 categories, 17 with versions: [] ... */ ]

export function getBlockCategoryById(id: string) {
  return blockCategories.find((category) => category.id === id)
}
```

`blockCategories.flatMap(c => c.versions.map(v => v.id))` gives every known
block version id — 77 of them today.

### `components/block-preview-by-version.tsx:1-171` — 77 `import` lines followed by a `Record<string, React.ComponentType>` object literal and a lookup function

```tsx
import HeroSectionV1 from "@/registry/new-york/blocks/hero-section-v1/components/hero-section-v1"
// ...76 more import lines...

const blockComponents: Record<string, React.ComponentType> = {
  "brands-section-v1": BrandsSectionV1,
  "brands-section-v2": BrandsSectionV2,
  "hero-section-v1": HeroSectionV1,
  // ...
  spreadsheet: Spreadsheet,     // <- some keys are bare identifiers, not quoted (any id without a hyphen)
  // ...
  "navbar-section-v10": NavbarSectionV10Page,
}

export function BlockPreviewByVersionId({ versionId }: { versionId: string }) {
  const Component = blockComponents[versionId]

  if (!Component) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Preview not available for &quot;{versionId}&quot;.
      </div>
    )
  }

  return <Component />
}
```

**Do not import this file directly in a test.** It transitively imports ~77
registry block components, several of which import block-specific `.css`
files (e.g. `import "../styles/hero-section-v6.css"`) — Vitest's configured
`environment: "node"` (see `vitest.config.ts`) has no CSS handling, so a
direct import would fail. Extract the `blockComponents` object's keys by
parsing the file's source text instead, exactly like
`tests/registry/registry-imports.test.ts` already does for import
specifiers (see "Existing test convention" below). This was verified to work
correctly against the real file at plan-writing time:

```
$ node -e '... regex extraction script ...'
count: 77
```

The extraction regex (verified to produce exactly 77 keys matching the
known entries, including the unquoted `spreadsheet` key):

```js
const objMatch = source.match(/const blockComponents[^{]*\{([\s\S]*?)\n\}/)
const body = objMatch[1]
const keyRe = /^\s*(?:"([^"]+)"|([A-Za-z_$][\w$]*))\s*:/gm
// iterate keyRe.exec(body), push m[1] ?? m[2] for each match
```

### `registry.json` — 169KB, loaded via the existing test helper `tests/registry/load-registry.ts`

```ts
export function loadRegistry(): { items: RegistryItem[] } {
  return { items: loadRegistryItems() }
}
```

`RegistryItem.type` is `"registry:block"` for every installable block; its
`.name` field is the same id string used in `lib/blocks.ts` and
`block-preview-by-version.tsx` (confirmed by cross-referencing several
entries, e.g. `hero-section-v2`).

### Existing test convention to match: `tests/registry/registry-imports.test.ts:37-46`

```ts
function collectSpecifiers(source: string): string[] {
  const out: string[] = []
  for (const m of source.matchAll(/\bfrom\s+["']([^"']+)["']/g)) {
    out.push(m[1])
  }
  for (const m of source.matchAll(/\bimport\s+["']([^"']+)["']/g)) {
    out.push(m[1])
  }
  return out
}
```

This is exactly the "parse source as text with a regex" pattern this plan's
new test should follow — don't attempt an AST-based approach; it would be
inconsistent with the rest of `tests/registry/`.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Run new test only | `pnpm vitest run tests/registry/registry-block-preview-map.test.ts` | all pass |
| Full test run | `pnpm test:run` | all pass |
| Full check | `pnpm check` | exit 0 |
| Typecheck | `pnpm typecheck` | exit 0 |

## Scope

**In scope**:
- New file: `tests/registry/registry-block-preview-map.test.ts`

**Out of scope**:
- Do not modify `lib/blocks.ts`, `components/block-preview-by-version.tsx`,
  or `registry.json` — all three are currently in sync (verified at plan
  time); this plan only adds the check that would catch *future* drift.
- Do not attempt the TypeScript-level fix discussed as an alternative during
  the audit (deriving a `BlockVersionId` literal union from `blockCategories`
  via `as const` and changing `blockComponents` to
  `satisfies Record<BlockVersionId, ComponentType>`). That approach would
  change `BlockVersion.id`'s type from `string` to a large literal union
  everywhere it's used across the codebase (`lib/registry-server.ts`,
  `block-preview-toolbar.tsx`, etc.) — a much bigger, riskier change than a
  standalone test. If the maintainer wants compile-time enforcement later,
  that's a separate, larger plan.
- Do not change how `registry.json` is built or validated
  (`shadcn registry validate`, run via `registry:validate`) — this plan adds
  a narrower, additional check specific to the preview-map/blocks.ts
  relationship that `shadcn registry validate` doesn't cover.

## Git workflow

- Branch: `advisor/008-block-identity-consistency-test`
- Single commit, conventional-commit style, e.g.:
  `test(registry): assert lib/blocks.ts, preview map, and registry.json stay in sync`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Write the test file

Create `tests/registry/registry-block-preview-map.test.ts`:

```ts
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { blockCategories } from "@/lib/blocks"
import { loadRegistry, registryProjectRoot as root } from "./load-registry"

function extractPreviewMapKeys(): string[] {
  const filePath = join(root, "components/block-preview-by-version.tsx")
  const source = readFileSync(filePath, "utf8")

  const objMatch = source.match(/const blockComponents[^{]*\{([\s\S]*?)\n\}/)
  if (!objMatch) {
    throw new Error(
      "Could not find the `blockComponents` object literal in " +
        "components/block-preview-by-version.tsx — has its structure changed?"
    )
  }

  const body = objMatch[1]
  const keyRe = /^\s*(?:"([^"]+)"|([A-Za-z_$][\w$]*))\s*:/gm
  const keys: string[] = []
  let match: RegExpExecArray | null
  while ((match = keyRe.exec(body))) {
    keys.push(match[1] ?? match[2])
  }
  return keys
}

describe("block identity stays in sync across lib/blocks.ts, the preview map, and registry.json", () => {
  const versionIds = blockCategories.flatMap((category) =>
    category.versions.map((version) => version.id)
  )
  const previewMapKeys = extractPreviewMapKeys()
  const { items } = loadRegistry()
  const registryBlockNames = new Set(
    items.filter((i) => i.type === "registry:block").map((i) => i.name)
  )

  it("has at least one version id (sanity check the extraction itself works)", () => {
    expect(versionIds.length).toBeGreaterThan(0)
    expect(previewMapKeys.length).toBeGreaterThan(0)
  })

  it("has a preview-map entry for every block version declared in lib/blocks.ts", () => {
    const missing = versionIds.filter((id) => !previewMapKeys.includes(id))
    expect(missing, `versions missing from block-preview-by-version.tsx: ${missing.join(", ")}`).toEqual([])
  })

  it("has no stale preview-map entries that don't correspond to a declared block version", () => {
    const stale = previewMapKeys.filter((key) => !versionIds.includes(key))
    expect(stale, `preview-map keys with no matching lib/blocks.ts version: ${stale.join(", ")}`).toEqual([])
  })

  it("has a registry.json block for every block version declared in lib/blocks.ts", () => {
    const missing = versionIds.filter((id) => !registryBlockNames.has(id))
    expect(missing, `versions missing from registry.json: ${missing.join(", ")}`).toEqual([])
  })
})
```

**Verify**: `pnpm vitest run tests/registry/registry-block-preview-map.test.ts`
→ all 4 cases pass (this confirms current state is in sync, matching the
audit's finding).

### Step 2: Full check

```bash
pnpm test:run
pnpm check
pnpm typecheck
```

**Verify**: all exit 0.

### Step 3: Prove the test actually catches drift (temporary, revert before finishing)

To confirm this test isn't a false-positive-only check, temporarily comment
out one line inside the `blockComponents` object in
`components/block-preview-by-version.tsx` (e.g. the `"gallery-section-v2":
GallerySectionV2,` line), re-run the new test file, and confirm the second
`it` block ("has a preview-map entry for every block version...") now fails
with a message naming `gallery-section-v2`. Then **revert the temporary
change** (`git checkout -- components/block-preview-by-version.tsx` or undo
your edit manually) before moving on — this step is a validation of the
test, not a real change.

**Verify**: the test fails with the expected block id named in the failure
message; after reverting, `pnpm vitest run tests/registry/registry-block-preview-map.test.ts`
passes again.

## Test plan

The new test file itself is the test plan for this plan — see Step 1 for the
4 cases (sanity check, preview-map completeness, preview-map staleness,
registry.json completeness). Step 3 is a self-check that the test suite
actually detects the failure mode it exists to catch, modeled after the
general principle "a test that can't fail isn't testing anything" — but
Step 3's temporary edit must be reverted, it is not part of the final diff.

## Done criteria

- [ ] `tests/registry/registry-block-preview-map.test.ts` exists with the 4
      `it` cases described above
- [ ] `pnpm vitest run tests/registry/registry-block-preview-map.test.ts` →
      all pass against the current (unmodified) codebase
- [ ] Step 3's temporary-breakage check confirmed the test fails when it
      should, and the temporary edit was reverted (`git status` shows no
      changes to `components/block-preview-by-version.tsx`)
- [ ] `pnpm test:run`, `pnpm check`, `pnpm typecheck` all exit 0
- [ ] Only `tests/registry/registry-block-preview-map.test.ts` created;
      no other file modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- If any of the 4 test cases fails against the **unmodified** codebase (i.e.
  before Step 3's deliberate breakage) — this means real drift already
  exists between the three sources of truth, contradicting the audit's
  "verified in sync today" finding. STOP and report the exact mismatch
  rather than silently fixing `lib/blocks.ts` or
  `block-preview-by-version.tsx` to make the test pass — reconciling real
  drift is a different, separately-scoped fix.
- If the `extractPreviewMapKeys` regex fails to find the `blockComponents`
  object (the `objMatch` throw fires) — this means the file's structure
  changed since this plan was written (e.g. renamed the object, or its
  declaration no longer matches `const blockComponents[^{]*\{`). Re-derive
  the regex against the live file rather than forcing a match; if you can't
  get a reliable regex without risking false negatives, STOP and report.

## Maintenance notes

- This test will fail loudly the next time a block is added to
  `lib/blocks.ts` without a matching `block-preview-by-version.tsx` entry (or
  vice versa, or without a matching `registry.json` entry) — that's the
  entire point. Whoever adds block #82 should expect this test to guide them
  to the missing piece rather than discovering it via a blank preview in the
  browser.
- If `components/block-preview-by-version.tsx`'s structure changes
  significantly (e.g. moves from a flat `Record` to a dynamic
  `React.lazy`-based lookup keyed differently), this test's extraction regex
  will need to be updated to match the new structure — it is coupled to the
  current `const blockComponents: Record<...> = { ... }` shape by design.
