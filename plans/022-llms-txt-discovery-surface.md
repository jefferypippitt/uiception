# Plan 022: Add `/llms.txt` machine-readable discovery surface

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 560927f..HEAD -- app/rss.xml lib/blocks.ts lib/templates.ts lib/config.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `560927f`, 2026-08-08

## Why this matters

uiception is a shadcn-compatible registry — install any block or template
with `npx shadcn@latest add https://uiception.com/r/<name>.json`. Agentic
coding tools (Claude Code, Cursor, etc.) are a real installer audience, but
there is currently no page that tells an agent (or a human skimming
docs-as-text) what's installable without crawling the full site. This gap
has been flagged in three prior `/improve` rounds (Round 2's DIR-B, Round
3's DIR-E) and never selected — each time blocked on "needs a maintainer
format call." This round resolves that: the underlying catalog
(`public/r/registry.json`, 102 items, 224KB) is already public, lean, and
regenerated on every build, so pointing a small `llms.txt` at it is a
same-day addition, not a new data pipeline. `llms.txt` (https://llmstxt.org)
is the closest thing to a convention for this — a single markdown-flavored
text file at the site root that summarizes what the site offers and links
to the machine-readable detail.

## Current state

- `app/rss.xml/route.ts` — the closest existing pattern: a dynamic
  `route.ts` that composes site content into a machine-readable text format
  at request time, using `siteConfig` from `lib/config.ts` for the base URL.
  Full file for reference:

  ```ts
  import { getChangelogEntries } from "@/lib/changelog"
  import { siteConfig } from "@/lib/config"

  function escapeXml(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
  }

  export async function GET() {
    const entries = await getChangelogEntries()
    // ...builds an XML string...
    return new Response(xml, {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    })
  }
  ```

  (Read the rest of `app/rss.xml/route.ts` yourself before starting — the
  above is excerpted for the return-shape pattern, not copied verbatim.)

- `lib/blocks.ts:1-45` — exports `blockCategories: BlockCategory[]`, an
  array of `{ id, title, description, versions: BlockVersion[] }`. Iterate
  this directly; do not hardcode category names.
- `lib/templates.ts:1-53` — exports `templateCategories: TemplateCategory[]`,
  same shape (`{ id, title, description, versions: TemplateVersion[] }`).
- `lib/config.ts:6-16` — `siteConfig.url` (`"https://uiception.com"`),
  `siteConfig.name`, `siteConfig.metaDescription`. Use these instead of
  hardcoding strings, so the file stays correct if the site is ever
  re-branded or re-hosted.
- URL conventions confirmed by reading the route tree
  (`app/(site)/blocks/[category]/page.tsx`, `app/(site)/templates/[category]/page.tsx`):
  a block category page is `${siteConfig.url}/blocks/<categoryId>`, a
  template category page is `${siteConfig.url}/templates/<categoryId>`.
- The registry JSON itself: `public/r/registry.json` is rebuilt by
  `pnpm registry:build` (runs automatically before `pnpm build`) from
  `registry.json` at the repo root — do not hand-edit either file as part
  of this plan; nothing here touches the registry source.

## Commands you will need

| Purpose   | Command                              | Expected on success           |
|-----------|---------------------------------------|-------------------------------|
| Install   | `pnpm install`                        | exit 0                        |
| Typecheck | `pnpm typecheck`                      | exit 0, no errors             |
| Lint      | `pnpm lint`                           | exit 0                        |
| Tests     | `pnpm test:run`                       | all pass                      |
| Full gate | `pnpm check`                          | exit 0 (validate+lint+test+typecheck) |
| Dev smoke | `pnpm dev` then `curl -s http://localhost:3000/llms.txt` | 200, `Content-Type: text/plain`, body contains `registry.json` |

## Scope

**In scope** (the only files you should create or modify):
- `app/llms.txt/route.ts` (create)
- `plans/README.md` (status row update only)

**Out of scope** (do NOT touch, even though they look related):
- `registry.json` / `public/r/registry.json` — build artifacts, not this
  plan's concern.
- `app/robots.ts` / `app/sitemap.ts` — unrelated Next.js metadata routes;
  do not add `llms.txt` references there unless a later plan asks for it.
- `lib/blocks.ts` / `lib/templates.ts` — read-only for this plan; do not
  add new exports, just consume the existing arrays.

## Git workflow

- Branch: `advisor/022-llms-txt-discovery-surface`
- Commit per step; message style matches repo convention (see `git log
  --oneline -10` — short imperative subject, no scope prefix required but
  `feat(...)`/`fix(...)` prefixes appear in recent history, e.g.
  `fix(deps): patch high-severity audit failures in js-yaml and nanoid`).
  A reasonable message here: `feat(discovery): add /llms.txt catalog surface`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create the route

Create `app/llms.txt/route.ts` (a folder named `llms.txt` containing
`route.ts` — this is how `app/rss.xml/route.ts` produces a route at
`/rss.xml`; Next.js treats the folder name as the literal path segment).

The handler:
1. Imports `blockCategories` from `@/lib/blocks`, `templateCategories` from
   `@/lib/templates`, and `siteConfig` from `@/lib/config`.
2. Builds a plain-text (not XML/HTML) body shaped like the `llms.txt`
   convention: an `# <site name>` H1, a one-line `>` blockquote summary,
   then a short paragraph pointing at the machine-readable catalog, then a
   `## Blocks` section listing every category as
   `- [<title>](<siteConfig.url>/blocks/<id>): <n> version(s)` (skip
   categories where `versions.length === 0` — an empty category is not a
   useful link for an agent), then a `## Templates` section in the same
   shape iterating `templateCategories`, then a short `## Docs` section
   linking `/docs`, `/changelog`, and `${siteConfig.url}/rss.xml`.
3. Returns `new Response(body, { headers: { "Content-Type": "text/plain;
   charset=utf-8" } })`.

Do not add caching headers, revalidation config, or `dynamic`/`revalidate`
route segment exports — none of the other text-format routes in this repo
(`rss.xml`) set them either; match that, don't add new conventions.

Example shape of one category line (illustrative, not literal — compute the
version count from `versions.length`, don't hardcode it):

```
- [Hero Section](https://uiception.com/blocks/hero-section): 12 versions
```

**Verify**: `pnpm typecheck` → exit 0, no errors.

### Step 2: Smoke-test the live route

Run `pnpm dev` in the background, then `curl -s http://localhost:3000/llms.txt`.

Confirm:
- HTTP 200.
- Response body starts with `# uiception`.
- Body contains the literal substring `registry.json`.
- Body lists at least one block category (e.g. grep for `/blocks/hero-section`)
  and the `landing-pages` template category (grep for `/templates/landing-pages`).
- Body does NOT list any category with 0 versions (cross-check: pick one
  known-empty category id from `lib/blocks.ts`, e.g. `waitlist` or
  `contact` — as of this plan's "Planned at" commit both have
  `versions: []` — and confirm neither `/blocks/waitlist` nor
  `/blocks/contact` appears in the output; if either does, the
  `versions.length === 0` filter in Step 1 is wrong).

Stop the dev server after verifying.

**Verify**: manual curl output matches all bullets above.

### Step 3: Full verification gate

**Verify**: `pnpm check` → exit 0 (registry:validate + lint + test:run +
typecheck all pass). `pnpm build` → exit 0, and confirm `/llms.txt` appears
in the build's route listing output (as a `ƒ` dynamic or `○` static route —
either is fine, this route has no user-specific data so it's safe either
way).

## Test plan

No new automated test file is required — this route has no branching logic
beyond the empty-category filter, and its correctness is fully covered by
the manual smoke check in Step 2 plus the typecheck/build gates. If you
want extra confidence, a minimal test following the pattern in
`tests/templates/portfolio-v1/actions.test.ts` (import the route's `GET`
export directly and inspect the returned `Response`) is acceptable but not
required for done criteria.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm check` exits 0
- [ ] `pnpm build` exits 0 and lists `/llms.txt` as a route
- [ ] `curl -s http://localhost:3000/llms.txt` (against `pnpm dev` or
      `pnpm start` after build) returns 200 with `Content-Type: text/plain`
      and body containing `registry.json`
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `lib/blocks.ts` or `lib/templates.ts` no longer export
  `blockCategories`/`templateCategories` in the shape described above (the
  codebase has drifted since this plan was written).
- The empty-category filter would exclude every block category (i.e. all
  categories show `versions: []`) — that would mean the registry itself is
  broken, not this route; stop and report rather than shipping a page that
  links to nothing.
- `pnpm build` fails specifically because of this new route (e.g. a
  metadata-route naming conflict) — Next.js may already reserve `llms.txt`
  semantics in a version newer than this plan assumed; check the installed
  `next` version's changelog before working around it.

## Maintenance notes

- If a future template or block category is added, this route requires no
  code change — it derives its content from `blockCategories` /
  `templateCategories` at request time.
- If the site ever gains a dedicated `/api/blocks` JSON endpoint (discussed
  and explicitly not built in Rounds 2–4 — `public/r/registry.json` already
  serves that purpose), this file's "machine-readable catalog" pointer
  should be reviewed to make sure it still points at the right URL.
- A reviewer should scrutinize: the empty-category filter (must exclude
  0-version categories) and that no secret/env-var content leaks into this
  publicly-served file (it shouldn't — this route only touches
  `lib/blocks.ts`/`lib/templates.ts`/`lib/config.ts`, none of which contain
  secrets).
