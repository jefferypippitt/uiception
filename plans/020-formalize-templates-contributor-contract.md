# Plan 020: Formalize the templates contributor contract (docs + stale-entry tests)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 8cdba30..HEAD -- CONTRIBUTING.md AGENTS.md .cursor/rules tests/registry/registry-templates.test.ts lib/templates.ts components/template-preview-by-version.tsx`
> If any of these changed since this plan was written, re-read them and
> compare against the "Current state" excerpts below before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S/M
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx / tech-debt
- **Planned at**: commit `8cdba30`, 2026-08-06

## Why this matters

`registry/new-york/templates/` (two templates today: `portfolio-v1`,
`portfolio-v2`) is a newer, structurally different registry surface than
`registry/new-york/blocks/` (89 items). The block surface has real
contributor guardrails: `CONTRIBUTING.md` documents the "four places a new
block touches" contract, `AGENTS.md` points agents at `.cursor/rules/*.mdc`
files before they touch block code, and
`tests/registry/registry-block-preview-map.test.ts` catches **both**
directions of drift — missing entries *and* stale/orphaned entries (added
in commit `7741378`, specifically to catch a real failure mode after a
block rename left dead preview-map entries behind).

Templates have none of this. `CONTRIBUTING.md` never mentions "template".
`AGENTS.md` routes agents only to the three block-scoped `.cursor/rules/*.mdc`
files. `tests/registry/registry-templates.test.ts` only checks the
catalog → disk direction (a template declared in `lib/templates.ts` has a
matching `registry.json` entry and preview file) — it never checks the
reverse (a `registry.json` entry or `template-preview-by-version.tsx`
key with no matching `lib/templates.ts` version), so a template
rename/removal can leave orphaned entries behind with no test failure. Each
template is many more files than a single block, so a silent orphan here is
a larger blast radius than the block-level problem `7741378` was built to
catch.

This is cheap to fix now (2 templates, small diff) and gets more expensive
to retrofit correctly once template #5 or #6 ships with its own
undocumented quirks — the accurate source content for the docs fix already
exists (`content/docs/04-template-structure.mdx`, site-facing marketing
content, not repo-facing dev docs), it just needs to be ported to the
contributor-facing files.

## Current state

- `content/docs/04-template-structure.mdx` — full current content, **the
  source of truth to port from**:

```mdx
---
title: Template structure
description: How templates differ from blocks and how a new one is registered.
order: 4
---

Templates are full standalone Next.js apps, not a single component. They live under
`registry/new-york/templates` instead of `registry/new-york/blocks`, and there's no fixed
folder shape beyond what the app itself needs:

​```text
registry/new-york/templates/{template-name}/
  app/         # Routes — layout, pages, nested folders
  components/  # UI, including components/ui
  content/     # MDX or other app content
  lib/         # Actions, data, schemas
  styles/      # Extra CSS beyond globals
  .env.example # Env vars the template expects
​```

A new template touches four places, same pattern as blocks:

1. `registry/new-york/templates/{template-name}/` — the template itself
2. `lib/templates.ts` — adds the version under its category (`id`, `title`,
   `registryPath`, `description`)
3. `registry.json` — a `registry:block` entry with `categories: ["template", ...]`,
   listing every file, `dependencies`, and any `envVars`
4. `components/template-previews/{id}.tsx` plus
   `components/template-preview-by-version.tsx` — preview definition and id map
```

- `CONTRIBUTING.md`'s existing block section (lines 45-74, "Adding or
  editing a block") — the pattern/tone to match for the new template
  section:

```md
## Adding or editing a block

Every block follows the shadcn-style layout described in [README.md](./README.md#block-structure):

​```
registry/new-york/blocks/<block-name>/
  <block-name>.tsx      # Entry point — section wrapper + imports only, no logic
  page.tsx              # Preview page
  components/           # Visual sub-components (swappable with GSAP / Three.js)
  hooks/                # Client animation logic (useEffect, GSAP timelines)
  lib/                  # Data, types, constants, config
  styles/
    <block-name>.css    # Keyframes, layout vars, dark mode via CSS vars
​```

A **new block** touches four places, not just its own folder:

1. `registry/new-york/blocks/<block-name>/` — the block itself
2. `lib/blocks.ts` — block metadata/registration
3. `registry.json` — shadcn registry entry
4. `components/block-preview-by-version.tsx` — preview wiring

**Deleting a block** means removing it everywhere it was added: the block folder, its
`public/r/*.json` output, and its entries in `registry.json`, `lib/blocks.ts`, and
`block-preview-by-version.tsx`. A partial removal will break the registry build or leave
dead preview links.

**Adding a new category** additionally requires updating all four `title-<id>` selector
blocks in `app/globals.css` — missing one breaks the view-transition morph between
sections.
```

- `AGENTS.md` (lines 1-23, the file to add a pointer to):

```md
# Project conventions

Before touching anything under `registry/new-york/blocks/`, read these
project-specific rules — they are not optional style preferences, they are
enforced by `pnpm registry:validate` and reviewed in every PR:

- **`.cursor/rules/registry-blocks-source-layout.mdc`** — the required block
  folder structure ...
- **`.cursor/rules/registry-blocks-tailwind.mdc`** — Tailwind v4
  utilities-first styling rules ...
- **`.cursor/rules/registry-block-media.mdc`** — how block images/video work ...

After adding or editing a block, also see `README.md` ("Block structure") and
`WORKFLOW.md` (pre-push commands: `pnpm check` then `pnpm build`).
```

(A large auto-generated Next.js docs index follows below a `---` separator
in the same file — do not touch that section.)

- `tests/registry/registry-templates.test.ts` — full current content (108
  lines) has three `describe` blocks: "template catalog stays in sync with
  registry.json" (checks catalog → registry.json direction only),
  "template registry target paths" (path-shape validation, unrelated to
  this plan), and "template preview host" (checks catalog → preview-file
  and catalog → map-key direction only). Neither of the first and third
  `describe` blocks has a reverse/stale-entry check.

- `tests/registry/registry-block-preview-map.test.ts` — the exemplar to
  mirror, in full (60 lines) — already shown in the block-identity test the
  repo uses today. Its key technique: extract keys from a source file via
  regex (`extractPreviewMapKeys`), then compute set differences in both
  directions:

```ts
it("has a preview-map entry for every block version declared in lib/blocks.ts", () => {
  const missing = versionIds.filter((id) => !previewMapKeys.includes(id))
  expect(missing, `versions missing from block-preview-by-version.tsx: ${missing.join(", ")}`).toEqual([])
})

it("has no stale preview-map entries that don't correspond to a declared block version", () => {
  const stale = previewMapKeys.filter((key) => !versionIds.includes(key))
  expect(stale, `preview-map keys with no matching lib/blocks.ts version: ${stale.join(", ")}`).toEqual([])
})
```

- `components/template-preview-by-version.tsx` — the file whose keys need
  extracting for the new stale-entry test. Relevant excerpt (lines 11-14):

```tsx
/** Host-only preview map — add an entry when you ship a new template. */
export const templatePreviews: Record<string, TemplatePreviewDefinition> = {
  "portfolio-v1": portfolioV1Preview,
  "portfolio-v2": portfolioV2Preview,
}
```

- `lib/templates.ts`'s `getFreeTemplateVersions()` — already imported by
  `tests/registry/registry-templates.test.ts` (`import { getFreeTemplateVersions } from "@/lib/templates"`) — reuse this existing import, don't
  re-derive template IDs another way.

## Commands you will need

| Purpose   | Command                              | Expected on success |
|-----------|---------------------------------------|---------------------|
| Typecheck | `pnpm typecheck`                      | exit 0, no errors   |
| Tests     | `pnpm test:run`                       | all pass            |
| Lint      | `pnpm lint`                           | exit 0              |
| Registry  | `pnpm registry:validate`              | exit 0              |

## Scope

**In scope**:
- `CONTRIBUTING.md` — add a new "Adding or editing a template" section
- `AGENTS.md` — add a pointer to the new `.cursor/rules/registry-templates.mdc` (see Step 1)
- `.cursor/rules/registry-templates.mdc` (create)
- `tests/registry/registry-templates.test.ts` — add two stale-entry test cases

**Out of scope**:
- `content/docs/04-template-structure.mdx` — this is site-facing marketing
  content and already correct; treat it as a read-only source to port from,
  do not edit it.
- `README.md` — a "Block structure" section exists there for blocks; adding
  an equivalent template section to `README.md` is a reasonable follow-up
  but is not required by this plan's done criteria (keep this plan focused
  on `CONTRIBUTING.md`/`AGENTS.md`/the new rule file/tests). If you have
  spare effort budget, a short addition is welcome but not required.
- `registry.json`, `lib/templates.ts`, any actual template source files —
  this plan only adds documentation and tests; it does not add, remove, or
  modify any template.
- The path-shape validation `describe` block in
  `registry-templates.test.ts` ("template registry target paths") — leave
  it exactly as-is, only add new test cases alongside it.

## Git workflow

- Branch: `advisor/020-formalize-templates-contributor-contract`
- Commit per step or per logical unit.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create `.cursor/rules/registry-templates.mdc`

`AGENTS.md` explicitly tells agents to read `.cursor/rules/*.mdc` files
before touching block code — templates have no equivalent, so an agent
editing template code today gets no rule pointer at all. Create
`.cursor/rules/registry-templates.mdc`, mirroring the frontmatter style of
`.cursor/rules/registry-blocks-source-layout.mdc` (`description`, `globs`,
`alwaysApply: true`), with content ported from
`content/docs/04-template-structure.mdx` (see "Current state" above):

```mdc
---
description: Registry templates are full standalone Next.js apps, structurally different from single-component blocks
globs: registry/new-york/templates/**,registry.json
alwaysApply: true
---

# Registry templates

Templates are full standalone Next.js apps, not a single component. They live under
`registry/new-york/templates/` instead of `registry/new-york/blocks/`, and there's no
fixed folder shape beyond what the app itself needs:

​```
registry/new-york/templates/{template-name}/
  app/         # Routes — layout, pages, nested folders
  components/  # UI, including components/ui
  content/     # MDX or other app content
  lib/         # Actions, data, schemas
  styles/      # Extra CSS beyond globals
  .env.example # Env vars the template expects
​```

## A new template touches four places

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

## Templates are self-contained

Unlike blocks, which may cross-import from other blocks (see
`registry-blocks-source-layout.mdc`), each template must not import from the
host site's own `components/`/`lib/`, nor from another template. Every
dependency a template needs — including UI primitives like `Button` — is
copied into the template's own `components/ui/` rather than shared. This is
deliberate: a template is meant to be installed via `npx shadcn@latest init
--template ...` as a self-contained starting point, not tied to this
repo's own component tree.

## Do not

- Import from `@/components/*` or `@/lib/*` paths that resolve to the host
  site rather than the template's own copies.
- Add a template file without a matching `registry.json` entry (breaks
  `pnpm registry:validate`).
```

(Remove the zero-width-space markers before the triple-backtick fences
above — they're only present in this plan to keep the plan file's own
markdown from breaking; the actual `.mdc` file should use plain triple
backticks.)

**Verify**: file exists at `.cursor/rules/registry-templates.mdc` with
frontmatter matching the style of the other three `.mdc` files in that
directory (`head -5 .cursor/rules/registry-templates.mdc` shows `---`,
`description:`, `globs:`, `alwaysApply: true`, `---`).

### Step 2: Add a pointer to the new rule file in `AGENTS.md`

In `AGENTS.md`, add a fourth bullet to the existing list (after the
`registry-block-media.mdc` bullet, before the "After adding or editing a
block" paragraph):

```md
- **`.cursor/rules/registry-templates.mdc`** — how installable page
  templates (`registry/new-york/templates/`) differ from blocks: no fixed
  folder shape, self-contained (no cross-imports from the host site or
  other templates), and the four registration points a new template must
  touch.
```

Also update the file's opening sentence, which currently reads "Before
touching anything under `registry/new-york/blocks/`" — broaden it to cover
templates too:

```md
Before touching anything under `registry/new-york/blocks/` or
`registry/new-york/templates/`, read these project-specific rules ...
```

**Verify**: `grep -n "registry-templates.mdc" AGENTS.md` returns a match.

### Step 3: Add an "Adding or editing a template" section to `CONTRIBUTING.md`

Add a new section immediately after the existing "Adding or editing a
block" section (after its "Adding a new category additionally requires..."
paragraph, before "## Style conventions"):

```md
## Adding or editing a template

Templates are full standalone Next.js apps under `registry/new-york/templates/`,
structurally different from the single-component blocks above — see
[`.cursor/rules/registry-templates.mdc`](./.cursor/rules/registry-templates.mdc)
for the full folder-shape and self-containment rules.

A **new template** touches four places, same pattern as blocks:

1. `registry/new-york/templates/<template-name>/` — the template itself
2. `lib/templates.ts` — adds the version under its category (`id`, `title`,
   `registryPath`, `description`)
3. `registry.json` — a `registry:block` entry with `categories: ["template", ...]`,
   listing every file, `dependencies`, and any `envVars`
4. `components/template-previews/<id>.tsx` plus
   `components/template-preview-by-version.tsx` — preview definition and id map

**Deleting a template** means removing it everywhere it was added, same as
deleting a block: the template folder, its `public/r/*.json` output, and
its entries in `registry.json`, `lib/templates.ts`, and
`template-preview-by-version.tsx`.
```

**Verify**: `grep -n "Adding or editing a template" CONTRIBUTING.md` returns a match.

### Step 4: Add stale-entry tests to `registry-templates.test.ts`

Mirror `registry-block-preview-map.test.ts`'s technique. Add a new
`describe` block (or extend the existing "template preview host" block —
either placement is fine, just don't duplicate the existing `getFreeTemplateVersions()`/`loadRegistry()` calls unnecessarily):

```ts
function extractTemplatePreviewKeys(): string[] {
  const filePath = join(root, "components/template-preview-by-version.tsx")
  const source = readFileSync(filePath, "utf8")

  const objMatch = source.match(/export const templatePreviews[^{]*\{([\s\S]*?)\n\}/)
  if (!objMatch) {
    throw new Error(
      "Could not find the `templatePreviews` object literal in " +
        "components/template-preview-by-version.tsx — has its structure changed?"
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

describe("template preview host has no stale entries", () => {
  it("has no template-preview-by-version.tsx entries with no matching lib/templates.ts version", () => {
    const versionIds = getFreeTemplateVersions().map((v) => v.id)
    const previewKeys = extractTemplatePreviewKeys()
    const stale = previewKeys.filter((key) => !versionIds.includes(key))
    expect(stale, `templatePreviews keys with no matching lib/templates.ts version: ${stale.join(", ")}`).toEqual([])
  })
})

describe("template catalog has no stale registry.json entries", () => {
  it("has no registry.json template item with no matching lib/templates.ts version", () => {
    const freeVersions = getFreeTemplateVersions()
    const versionIds = freeVersions.map((v) => v.id)
    const { items } = loadRegistry()
    const templateItems = items.filter(
      (i) => i.type === "registry:block" && isTemplateItem(i.files)
    )
    const registryNames = templateItems.map((i) => i.name)
    const stale = registryNames.filter((name) => !versionIds.includes(name!))
    expect(stale, `registry.json template entries with no matching lib/templates.ts version: ${stale.join(", ")}`).toEqual([])
  })
})
```

Place these `describe` blocks in the existing file, reusing the file's
existing `isTemplateItem`, `loadRegistry`, `root`, and
`getFreeTemplateVersions` imports/helpers already at the top of the file —
do not redeclare them.

**Verify**: `pnpm test:run` → all pass, including the 2 new tests. Both
should pass against the current, non-stale state of the repo (this is a
regression-guard addition, not a fix for an existing failure).

## Test plan

- New tests: two new `it` cases in `tests/registry/registry-templates.test.ts`
  (stale `template-preview-by-version.tsx` entries, stale `registry.json`
  template entries), both expected to pass against current repo state.
- Structural pattern: `tests/registry/registry-block-preview-map.test.ts`'s
  existing "has no stale preview-map entries" test.
- Verification: `pnpm test:run` → all pass, including the 2 new tests.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm test:run` exits 0; the 2 new tests exist and pass
- [ ] `pnpm lint` exits 0
- [ ] `pnpm registry:validate` exits 0
- [ ] `.cursor/rules/registry-templates.mdc` exists
- [ ] `grep -n "registry-templates.mdc" AGENTS.md` returns a match
- [ ] `grep -n "Adding or editing a template" CONTRIBUTING.md` returns a match
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The code/docs at the cited locations don't match the excerpts above
  (drift since this plan was written).
- The new stale-entry tests fail against the current repo state — that
  would mean an actual stale entry already exists, which is a real finding
  worth reporting rather than silently "fixing" by loosening the test.
- `components/template-preview-by-version.tsx`'s `templatePreviews` object
  literal structure doesn't match what `extractTemplatePreviewKeys`'s regex
  expects (e.g. it's no longer a simple object literal) — report the actual
  structure rather than forcing the regex to match.

## Maintenance notes

- The next new template should trigger updating this same set of places:
  the four registration points already enforced by
  `registry-templates.test.ts` (now checked in both directions), plus the
  new `.cursor/rules/registry-templates.mdc` guidance an agent should read
  first.
- `plans/README.md`'s Round 4 findings also flagged (not fixed by this
  plan): template media assets aren't covered by `pnpm images:compress`/`videos:compress`
  (`scripts/compress-images.mjs`/`compress-videos.mjs` hardcode a
  `blocks`-only path) — a good candidate for a small follow-up plan if
  selected in a future round.
- A reviewer should confirm the new `.mdc` file's `globs` pattern
  (`registry/new-york/templates/**,registry.json`) doesn't unintentionally
  overlap/conflict with the existing block `.mdc` files' `globs` — it
  shouldn't, since the paths are disjoint, but worth a glance.
