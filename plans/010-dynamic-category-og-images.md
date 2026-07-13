# Plan 010: Dynamic per-category OpenGraph/Twitter images for `/blocks/[category]`

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat fc930a3..HEAD -- app/(site)/blocks/[category] lib/blocks.ts lib/block-periodic-layout.ts lib/config.ts`
> If any of these changed since this plan was written, compare the "Current
> state" excerpts below against the live files before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3 (direction — not ranked against bug/security fixes)
- **Effort**: S/M
- **Risk**: LOW
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `fc930a3`, 2026-07-09

## Why this matters

uiception is a visual product — 81 UI blocks browsable by category — but
every social share of a category link (e.g. `/blocks/hero-section`) currently
shows the same generic sitewide branding image (`siteConfig.ogImage`, a
static PNG), because `app/(site)/blocks/[category]/page.tsx`'s
`generateMetadata` only sets `title`/`description`, never `openGraph`. For a
design/component registry, a link preview that actually reflects the content
being shared (which category, how many blocks) is a much stronger signal
than generic branding, and it's cheap to build: Next.js's `opengraph-image`
file convention generates these on the fly with no new infrastructure,
external services, or screenshot pipeline required.

This plan generates **templated** cards (category title, block count, and
the site's existing periodic-table "element" motif — symbol + atomic
number, the same visual language already used on `/blocks`), not live
screenshots of rendered blocks. A live-screenshot pipeline (headless browser,
GSAP-safe capture, caching) is a much larger, riskier effort explicitly out
of scope here — see "Maintenance notes."

## Current state

### `app/(site)/blocks/[category]/page.tsx:17-29` (generateStaticParams + generateMetadata, current)

```tsx
export function generateStaticParams() {
  return blockCategories.map((category) => ({ category: category.id }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryData = blockCategories.find((item) => item.id === category)
  if (!categoryData) return {}
  return {
    title: categoryData.title,
    description: categoryData.description,
  }
}
```

No `openGraph` or `twitter` fields are set here — the page inherits the
static sitewide defaults from `app/layout.tsx:62-84`.

### `lib/blocks.ts:41-46` — the `BlockCategory` shape (id, title, description, versions[])

```ts
export type BlockCategory = {
  id: BlockCategoryId
  title: string
  description: string
  versions: BlockVersion[]
}
```

`category.versions.length` gives the block count for a category (0 for the
17 currently-empty categories — this plan does not need to special-case
those; an image showing "Category Title — 0 blocks" is accurate and fine).

### `lib/block-periodic-layout.ts:1-16` — the periodic-table "element" data (full type + first entries)

```ts
export type BlockPeriodicCell = {
  id: BlockCategoryId
  z: number
  symbol: string
  row: number
  col: number
  colSpan?: number
}

export const blockPeriodicCells: BlockPeriodicCell[] = [
  { id: "navbar",            z: 1,  symbol: "Nb", row: 1, col: 1  },
  { id: "hero-section",      z: 2,  symbol: "Hs", row: 1, col: 10 },
  { id: "brands",            z: 3,  symbol: "Br", row: 2, col: 1  },
  // ...29 more entries, one per category...
]
```

Every category (all 32, including the 17 empty ones) has an entry here with
a 2-letter `symbol` and an atomic-number-style `z`. This is the exact motif
`/blocks`'s periodic-table grid uses (`app/(site)/blocks/page.tsx`,
`BlockPeriodicTile`) — reusing it in the OG image ties the share card to the
site's actual browsing UI instead of inventing a new visual language.

### `lib/config.ts` — `siteConfig` and `META_THEME_COLORS` (abridged; full file is 50 lines)

```ts
export const siteConfig = {
  name: "uiception",
  url: "https://uiception.com",
  ogImage: "https://uiception.com/uiception_logo_og.png",
  description: "Launch with everything built. Just make it yours.",
  metaDescription:
    "Pre-built UI blocks for Next.js. Copy-paste hero sections, navbars, pricing tables, CTAs, and more. Built with shadcn/ui and Tailwind CSS.",
  // ...keywords, author, links, navItems...
}

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}
```

`META_THEME_COLORS.dark` (`#09090b`) is the exact background color already
used elsewhere for the site's dark theme — reuse it directly rather than
inventing a new hex value, so the generated image matches the site's actual
dark-mode background.

### Important constraint: `next/og`'s `ImageResponse` uses Satori, not a browser

There is **no existing usage of `next/og`/`ImageResponse` anywhere in this
repo** (confirmed: `grep -rn "next/og\|ImageResponse" app/` returns nothing)
— this is new territory, so two non-obvious Satori constraints matter:

1. **No CSS custom properties, no Tailwind classes, no `oklch()` colors.**
   Satori renders the JSX tree independently of the page's stylesheet —
   only inline `style={{ ... }}` objects with a limited CSS subset work.
   The site's actual theme tokens (`app/globals.css`, e.g.
   `--background: oklch(0.145 0 0)`) cannot be reused directly; this plan
   hardcodes plain hex colors instead (`META_THEME_COLORS.dark` plus a
   small palette below).
2. **Every element with more than one child needs an explicit
   `display: "flex"`** (or `"none"`) — Satori does not implement the full
   CSS box model and will throw or mis-layout otherwise. Every `<div>` in
   the template below sets `display: "flex"` for this reason; do not remove
   it as "redundant" when copying the pattern elsewhere.

No custom web font is loaded in this plan (Satori requires fonts to be
fetched as an `ArrayBuffer` and passed via the `fonts` option, which is
extra complexity not needed for a first version) — the image uses Satori's
default sans-serif fallback. See "Maintenance notes" for adding the site's
actual font later.

### Important constraint: the served image URL is NOT `/blocks/<category>/opengraph-image`

The route lives under `app/(site)/blocks/[category]/` — `(site)` is a route
**group** (this repo also has a sibling `(preview)` group; route groups
don't appear in the URL). Next.js's metadata-route file convention appends a
content-hash suffix to the generated route's filename whenever a parent path
segment is a route group or parallel route, specifically to keep the URL
unique and cacheable. That means the real, servable URL for this image is
**not** predictable from the file path alone (it looks something like
`/blocks/hero-section/opengraph-image-<hash>`, but the exact hash is not
something to guess or hardcode).

Do not hardcode a guessed URL anywhere in this plan's verification steps.
Instead, Step 4 below discovers the real URL the same way a browser or a
social-media crawler would: by requesting the actual category page and
reading the `<meta property="og:image" content="...">` tag Next.js injects
into its `<head>` — that tag always contains the correct, live URL,
whatever it happens to be.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `pnpm typecheck` | exit 0, no errors |
| Full check | `pnpm check` | exit 0 |
| Build | `pnpm build` | exit 0; build output lists the new image routes |
| Dev server (manual verification) | `pnpm dev` | starts on localhost:3000 |

## Scope

**In scope**:
- New file: `app/(site)/blocks/[category]/opengraph-image.tsx`
- New file: `app/(site)/blocks/[category]/twitter-image.tsx`

**Out of scope**:
- Any live screenshot of an actual rendered block (headless-browser capture,
  caching, GSAP/canvas-safe rendering) — a much larger effort; this plan is
  templated cards only, using data already in `lib/blocks.ts`/
  `lib/block-periodic-layout.ts`.
- OG images for individual block versions (`/view/[versionId]`) or the
  homepage/changelog — this plan is scoped to category pages only, where the
  evidence for the gap was verified. Extending the same pattern to other
  routes is a natural follow-up (see "Maintenance notes"), not this plan.
- Loading a custom web font into the image (Geist, IBM Plex Serif, etc.) —
  adds real complexity (fetching font bytes, `fonts` option) for a
  first-version templated card; out of scope here.
- Any change to `app/layout.tsx`'s sitewide OG/Twitter defaults, or to the
  static `public/opengraph-image.png`/`public/uiception_logo_og.png` assets
  — those remain the fallback for non-category routes.
- Any change to `app/(site)/blocks/[category]/page.tsx` itself — the file
  convention picks up the new image files automatically for the same route
  segment; the page component needs no edits.

## Git workflow

- Branch: `advisor/010-dynamic-category-og-images`
- Single commit, conventional-commit style matching repo history, e.g.:
  `feat(blocks): add dynamic OG/Twitter images for category pages`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create `opengraph-image.tsx`

Create `app/(site)/blocks/[category]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og"

import { blockCategories } from "@/lib/blocks"
import { blockPeriodicCells } from "@/lib/block-periodic-layout"
import { META_THEME_COLORS, siteConfig } from "@/lib/config"

export const alt = "uiception block category"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: categoryId } = await params
  const category = blockCategories.find((item) => item.id === categoryId)
  const cell = blockPeriodicCells.find((item) => item.id === categoryId)

  const title = category?.title ?? categoryId
  const symbol = cell?.symbol ?? "??"
  const atomicNumber = cell?.z ?? 0
  const count = category?.versions.length ?? 0

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: META_THEME_COLORS.dark,
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            border: "2px solid #27272a",
            borderRadius: 24,
            padding: "48px 64px",
            width: 400,
          }}
        >
          <div style={{ display: "flex", fontSize: 28, color: "#71717a" }}>
            {atomicNumber}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 120,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {symbol}
          </div>
          <div style={{ display: "flex", fontSize: 32, marginTop: 16 }}>
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#71717a",
              marginTop: 8,
            }}
          >
            {count} {count === 1 ? "block" : "blocks"}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 24,
            color: "#a1a1aa",
            letterSpacing: 2,
          }}
        >
          {siteConfig.name.toUpperCase()}
        </div>
      </div>
    ),
    { ...size }
  )
}
```

**Verify**: `pnpm typecheck` → exit 0.

### Step 2: Create `twitter-image.tsx`

Create `app/(site)/blocks/[category]/twitter-image.tsx` with **exactly the
same content as `opengraph-image.tsx`** — copy the full file you just
created in Step 1 byte-for-byte, including every import, every export
(`alt`, `size`, `contentType`, `default`), and the entire JSX tree. Do not
retype it from memory or paraphrase it; use your file tool to duplicate
the file you already have on disk. This is intentional duplication, not an
oversight — Next.js's file convention treats `opengraph-image.tsx` and
`twitter-image.tsx` as separate files, and relying on one re-exporting from
the other is undocumented behavior this plan avoids. Duplicating a
self-contained file matches this repo's existing tolerance for cross-block
duplication (see `AGENTS.md` → `.cursor/rules/registry-blocks-source-layout.mdc`
for the same philosophy applied to registry blocks).

**Verify**: `pnpm typecheck` → exit 0. `diff app/(site)/blocks/[category]/opengraph-image.tsx app/(site)/blocks/[category]/twitter-image.tsx` → no output (files byte-for-byte identical). If this diff shows any output, the copy was not exact — redo it rather than patching the difference by hand.

### Step 3: Build and confirm no errors

```bash
pnpm build
```

**Verify**: exit 0. The build output will mention `opengraph-image`/
`twitter-image` somewhere in its route listing under `/blocks/[category]`,
but do not try to read an exact servable URL out of this output — per
"Important constraint" above, the real URL includes a hash suffix that
isn't printed in a directly usable form here. Treat `pnpm build` exiting 0
as this step's only requirement; Step 4 does the real, URL-agnostic
verification. If the build fails with an error inside either new file,
re-read "Important constraint: Satori" above before attempting a fix — the
most likely causes are a missing `display: "flex"` on a multi-child element
or a color value Satori can't parse (stick to hex/rgb, never `oklch()`).

### Step 4: Manual verification

```bash
pnpm dev
```

Discover the real, live image URL the way a browser or social crawler
would — by reading the `og:image` meta tag Next.js injects into the actual
category page — then fetch that discovered URL directly:

```bash
OG_URL=$(curl -s http://localhost:3000/blocks/hero-section \
  | grep -o 'property="og:image" content="[^"]*"' \
  | sed -E 's/.*content="([^"]*)".*/\1/')
echo "Discovered OG image URL: $OG_URL"
curl -s -o /dev/null -w "%{http_code} %{content_type} %{size_download}\n" "$OG_URL"
```

**Verify**: `OG_URL` is non-empty (if it's empty, the `og:image` meta tag
wasn't found — see STOP conditions). The final `curl` line prints HTTP 200,
`content_type` `image/png`, and `size_download` a few KB (not 0, not an
error page). Repeat the same two commands for one **empty** category, e.g.
substitute `newsletter` for `hero-section` in the first `curl` — should
still discover a URL and return a valid PNG showing "0 blocks", not an
error. Stop the dev server when done. (`-o /dev/null` discards the binary
image body since this check only needs the response metadata; no temp file
is written, so there's nothing to clean up afterward.)

## Test plan

No new automated tests — this repo has no component/image-render test
infrastructure (confirmed during the prior audit), and Satori-rendered PNG
output has no meaningful assertion surface in this codebase's Vitest
(`environment: "node"`) setup. Verification is `pnpm build` succeeding plus
the manual curl checks in Step 4 (one populated category, one empty
category).

## Done criteria

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm check` exits 0
- [ ] `pnpm build` exits 0
- [ ] The discovered `og:image` URL for a populated category (`hero-section`) returns HTTP 200, `image/png`, non-zero size
- [ ] The discovered `og:image` URL for an empty category (e.g. `newsletter`) returns HTTP 200, `image/png`, non-zero size (no crash on `versions.length === 0`)
- [ ] `opengraph-image.tsx` and `twitter-image.tsx` are identical (`diff` shows no output)
- [ ] No files outside the two in-scope files modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- `pnpm build` fails with a Satori/ImageResponse rendering error you can't
  resolve by fixing a `display: "flex"` omission or a non-hex color — report
  the exact error rather than stripping styles down until it happens to work.
- Step 4's `OG_URL` comes back empty for either category (the `grep`/`sed`
  found no `og:image` meta tag in the page HTML) — this would mean either
  the category page's metadata isn't picking up the new image file (report
  the full HTML `<head>` output so a human can see what metadata tags *are*
  present), or the dev server returned an error page instead of the real
  page (check the raw `curl -s http://localhost:3000/blocks/hero-section`
  output for an error before assuming the meta tag itself is the problem).
- A category id exists in `blockCategories` but has no matching entry in
  `blockPeriodicCells` (or vice versa) — the template already falls back to
  `"??"`/`0` for a missing `cell`, so this shouldn't crash, but if you
  observe it, report which category id is missing from which list rather
  than silently adding a placeholder entry to `lib/block-periodic-layout.ts`
  (that file is out of scope for this plan).
- The build takes noticeably longer or times out after adding these files —
  report it; 32 additional statically-generatable images should not
  meaningfully affect build time, and a large regression would suggest
  something is wrong with the image generation (e.g. an accidental infinite
  loop or oversized asset), not something to "wait out."

## Maintenance notes

- Natural follow-ups, each a separate future plan: (1) apply the same
  templated-card pattern to `/view/[versionId]` (per-block-version OG
  images) and `/changelog`; (2) load the site's actual Geist font into the
  image via Satori's `fonts` option once a first version validates the
  approach works end-to-end; (3) if the maintainer later wants live
  block screenshots instead of templated cards, that's a materially
  different, larger effort (headless browser capture + caching + handling
  GSAP/canvas-heavy blocks) — treat it as a new plan, not an extension of
  this one.
- If `lib/block-periodic-layout.ts`'s `symbol`/`z` values change (e.g. a
  category is renamed or renumbered), the OG images update automatically
  since they read from the same source — no coupling to worry about beyond
  what already exists between that file and `/blocks`'s own grid.
