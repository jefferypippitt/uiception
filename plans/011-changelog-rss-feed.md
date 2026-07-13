# Plan 011: Add an RSS feed for the changelog at `/feed.xml`

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat fc930a3..HEAD -- lib/changelog.ts lib/config.ts app/(site)/changelog content/changelog`
> If any of these changed since this plan was written, compare the "Current
> state" excerpts below against the live files before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3 (direction — not ranked against bug/security fixes)
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `fc930a3`, 2026-07-09

## Why this matters

`content/changelog/` holds 21 structured, dated `.mdx` entries (frontmatter:
`title`, `summary`/`description`, `date`, `items[]`), rendered at
`/changelog` — but there is no RSS/Atom feed anywhere on the site (confirmed:
no `feed.xml`/`rss.xml` route exists under `app/`). Anyone who wants to
follow new block releases without manually revisiting `/changelog` — RSS
readers, aggregators, or another site syndicating updates — has no way to do
so. The data is already structured exactly like a feed wants it (title,
summary, date, per-item links); this plan wires a standard RSS 2.0 route on
top of the existing `getChangelogEntries()` helper with no new dependency,
no content-model changes, and no changes to the `/changelog` page's rendered
output.

## Current state

### `lib/changelog.ts:27-35,99-140` — `ChangelogEntry` type and `getChangelogEntries()` (relevant excerpts)

```ts
export type ChangelogEntry = {
  title: string
  summary?: string
  description?: string
  date: string          // always "YYYY-MM-DD"
  dateDisplay: string
  items: ChangelogItem[]
  body: ComponentType   // compiled MDX — do not try to render this in the feed, see below
}

export async function getChangelogEntries(): Promise<ChangelogEntry[]> {
  // reads content/changelog/*.mdx, parses frontmatter with gray-matter,
  // compiles MDX body, returns entries sorted newest-first by `date`
}
```

`date` is always a plain `"YYYY-MM-DD"` string (normalized inside
`getChangelogEntries`, see `lib/changelog.ts:123-125`) — safe to pass
directly into `new Date(`${date}T00:00:00Z`)` for a feed `pubDate`.

**Do not attempt to render `entry.body` (the compiled MDX React component)
into the feed.** It's a React Server Component output meant for the
`/changelog` page, not renderable to a plain string outside of React's
render pipeline. Use `entry.summary ?? entry.description ?? entry.title` for
the feed item's description instead — this is exactly what the `/changelog`
page itself displays as the entry's subtitle (see
`app/(site)/changelog/page.tsx:63-67`), so the feed and the page stay
consistent.

### `app/(site)/changelog/page.tsx:42-46` — the per-entry anchor id (the feed's per-item link target)

```tsx
<div
  key={`${entry.date}-${entry.title}`}
  id={`entry-${entry.date}`}
  className="cl-row flex flex-col md:flex-row md:gap-12 pb-12 last:pb-0"
>
```

Each entry has a stable anchor `entry-<date>` on `/changelog` — use
`${siteConfig.url}/changelog#entry-${entry.date}` as each feed item's
`<link>`/`<guid>`. No new route or per-entry page is needed.

### `lib/config.ts` — `siteConfig` (relevant fields)

```ts
export const siteConfig = {
  name: "uiception",
  url: "https://uiception.com",
  metaDescription:
    "Pre-built UI blocks for Next.js. Copy-paste hero sections, navbars, pricing tables, CTAs, and more. Built with shadcn/ui and Tailwind CSS.",
  // ...
}
```

### Existing metadata-route conventions to follow: `app/sitemap.ts` and `app/robots.ts` (full files)

```ts
// app/robots.ts
import { siteConfig } from "@/lib/config"
import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/view/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
```

Both are fully static (no `revalidate`, no dynamic APIs used) — they're
generated once at build time from filesystem/static data, exactly like this
plan's feed route will be. **There is no Next.js special-file convention for
RSS feeds** (unlike `sitemap.ts`/`robots.ts`, which map to reserved file
names) — this plan uses a plain Route Handler instead, at
`app/feed.xml/route.ts`. A folder literally named `feed.xml` containing a
`route.ts` is how Next.js's App Router produces a `/feed.xml` URL for a
custom Route Handler; this is a standard, supported pattern.

No `feed`/`rss` npm package exists in this repo (`package.json` has neither)
— this plan hand-rolls minimal valid RSS 2.0 XML rather than adding a new
dependency, since the escaping needs are simple (plain-text titles/summaries,
no HTML body content).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `pnpm typecheck` | exit 0, no errors |
| Full check | `pnpm check` | exit 0 |
| Build | `pnpm build` | exit 0; build output lists the new `/feed.xml` route |
| Dev server (manual verification) | `pnpm dev` | starts on localhost:3000 |

## Scope

**In scope**:
- New file: `app/feed.xml/route.ts`
- `app/(site)/changelog/page.tsx` — add feed auto-discovery via
  `alternates.types` in the existing `metadata` export (Step 2)

**Out of scope**:
- Adding a `feed`/`rss` npm dependency — hand-roll the XML per Step 1's
  template; the content is simple enough not to need a library, and this
  keeps the dependency tree unchanged.
- Rendering the full MDX `body` into feed item descriptions — frontmatter
  fields only (`title`, `summary`/`description`), per "Current state" above.
- Any change to `content/changelog/*.mdx` files or `lib/changelog.ts` — the
  existing `getChangelogEntries()` helper is reused as-is.
- Adding `/feed.xml` to `app/sitemap.ts` — feeds aren't pages and don't
  belong in an XML sitemap; leave `sitemap.ts` untouched.
- An Atom feed, or a second feed format — RSS 2.0 only, per this plan.

## Git workflow

- Branch: `advisor/011-changelog-rss-feed`
- Single commit, conventional-commit style matching repo history, e.g.:
  `feat(changelog): add RSS feed at /feed.xml`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create the feed route

Create `app/feed.xml/route.ts`:

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

  const items = entries
    .map((entry) => {
      const link = `${siteConfig.url}/changelog#entry-${entry.date}`
      const description = entry.summary ?? entry.description ?? entry.title
      const pubDate = new Date(`${entry.date}T00:00:00Z`).toUTCString()

      return `
    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${escapeXml(link)}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`
    })
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.name)} Changelog</title>
    <link>${escapeXml(siteConfig.url)}/changelog</link>
    <description>${escapeXml(siteConfig.metaDescription)}</description>
    <language>en-us</language>${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  })
}
```

No `revalidate` export is needed — like `sitemap.ts`/`robots.ts`, this
route has no dynamic runtime API calls (no `cookies()`, `headers()`, etc.),
so Next.js generates it statically at build time from `content/changelog/`;
it only changes on redeploy, which is correct since the underlying `.mdx`
files only change via commits to this repo.

**Verify**: `pnpm typecheck` → exit 0.

### Step 2: Add feed auto-discovery to the changelog page

In `app/(site)/changelog/page.tsx`, change:

```tsx
export const metadata: Metadata = {
  title: "Changelog",
  description: "Latest updates and announcements.",
}
```

to:

```tsx
export const metadata: Metadata = {
  title: "Changelog",
  description: "Latest updates and announcements.",
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
}
```

This emits a `<link rel="alternate" type="application/rss+xml" href="/feed.xml">`
tag in the page `<head>`, which is how browsers/feed readers auto-discover a
site's feed from a content page — standard Next.js `Metadata` API, same
pattern already used for `title`/`description` on this page.

**Verify**: `pnpm typecheck` → exit 0.

### Step 3: Build and confirm the route is generated

```bash
pnpm build
```

**Verify**: exit 0. The build output's route listing should include
`/feed.xml`, prefixed with a symbol indicating how it was rendered (Next.js
prints a legend at the end of the listing, typically `○ (Static)` vs.
`ƒ (Dynamic)`). Check which symbol `/feed.xml` has. It's expected to be
static (`○`) per "Current state" above (no dynamic runtime APIs are used in
the route). If it shows as dynamic (`ƒ`) instead, that's not a failure —
the feed will still work correctly on every request — but note it in your
final report, since it means the "only changes on redeploy" reasoning in
this plan's "Maintenance notes" doesn't hold and the feed would instead be
regenerated per-request.

### Step 4: Manual verification

```bash
pnpm dev
```

Check status and headers first (discarding the body, since only the
headers matter for this check):

```bash
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" http://localhost:3000/feed.xml
```

**Verify**: HTTP 200, content type `application/rss+xml; charset=utf-8`.

Then capture the body into a shell variable (no temp file needed — this
keeps the check self-contained and avoids leaving any file outside the
repo for `git status` to not notice) and confirm structure and count:

```bash
FEED=$(curl -s http://localhost:3000/feed.xml)
echo "$FEED" | head -c 200
echo "$FEED" | grep -c "<item>"
ls content/changelog | wc -l
```

**Verify**: the `head -c 200` output starts with
`<?xml version="1.0" encoding="UTF-8"?>`; the `<item>` count from `grep -c`
equals the file count from `ls content/changelog | wc -l` (one `<item>` per
changelog `.mdx` file).

Finally, confirm the auto-discovery tag from Step 2 is present on the
changelog page itself:

```bash
curl -s http://localhost:3000/changelog | grep -o 'rel="alternate" type="application/rss+xml"[^>]*'
```

**Verify**: this prints a match containing `href="/feed.xml"`. Stop the dev
server when done.

## Test plan

No new automated tests — this repo has no HTTP-route-level test
infrastructure (confirmed during the prior audit; Vitest here covers pure
functions and static-source-parsing only). Verification is `pnpm build`
succeeding plus the manual curl/grep checks in Step 4, which directly
exercise the route's real output.

## Done criteria

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm check` exits 0
- [ ] `pnpm build` exits 0 and lists `/feed.xml` in its route output (note its Static/Dynamic marker in your report either way)
- [ ] `curl http://localhost:3000/feed.xml` returns HTTP 200 with `Content-Type: application/rss+xml; charset=utf-8`
- [ ] The feed's `<item>` count (via `grep -c "<item>"` on the captured body) equals the number of files in `content/changelog/`
- [ ] `/changelog`'s rendered HTML contains `<link rel="alternate" type="application/rss+xml" href="/feed.xml">`
- [ ] No files outside `app/feed.xml/route.ts` (new) and `app/(site)/changelog/page.tsx` (metadata-only edit) modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- `getChangelogEntries()` throws or returns fewer entries than
  `content/changelog/*.mdx` file count when called from the route handler —
  this would suggest a Route Handler execution-context difference from how
  the `/changelog` page calls it (e.g. a `cwd`/module-resolution issue); do
  not add error suppression or an empty-array fallback to hide it — report
  the exact error.
- Any changelog entry's `title`/`summary`/`description` contains characters
  that still break the XML after `escapeXml` (e.g. control characters) —
  report which entry and field rather than adding broader sanitization
  logic not covered by this plan's scope.
- `pnpm build`'s route listing does not include `/feed.xml` after Step 1 —
  double-check the folder is named exactly `feed.xml` (not `feed` or
  `feed.xml.ts`) directly under `app/`, containing a file named exactly
  `route.ts`.

## Maintenance notes

- Every new `content/changelog/*.mdx` entry automatically appears in the
  feed on the next build/deploy — no changes needed here when the
  changelog is updated going forward.
- If the site ever wants per-entry permalink pages (rather than
  `/changelog#entry-<date>` anchors), update the `link`/`guid` construction
  in `app/feed.xml/route.ts` to point at the new URL shape — this is the
  only place that assumption is encoded.
- If feed *content* (not just metadata) is ever desired — i.e. rendering
  each entry's full MDX body into the feed as HTML — that requires
  rendering MDX to a static HTML string server-side (e.g. via
  `renderToStaticMarkup`) rather than the compiled-component approach
  `lib/changelog.ts` currently uses for the React page. That's a
  meaningfully larger change to `lib/changelog.ts`'s return shape and is
  out of scope for this plan.
