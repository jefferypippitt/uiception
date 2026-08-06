# Plan 021: Validate frontmatter, isolate per-file errors, and fix O(N) single-entry lookups in portfolio-v1's content pipeline

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 8cdba30..HEAD -- registry/new-york/templates/portfolio-v1/lib/posts.ts`
> If this file changed since this plan was written, re-read it and compare
> against the "Current state" excerpt below before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug + perf
- **Planned at**: commit `8cdba30`, 2026-08-06

## Why this matters

`portfolio-v1/lib/posts.ts` loads MDX content (writing posts, books) with
three related problems, all confirmed by direct reading of the file:

1. **Unvalidated frontmatter cast**: `const frontmatter = data as ContentFrontmatter`
   (line 89) blindly trusts gray-matter's parsed YAML with no runtime check
   — despite this same template already using zod for its contact-form
   schema (`lib/schemas.ts`), establishing the pattern this file should
   follow but doesn't. If `date` is missing or misspelled,
   `normalizeDate(undefined)` falls through to `String(undefined).slice(0, 10)`
   → the literal string `"undefine"`, which downstream renders as `Invalid
   Date` with no build/dev warning anywhere.
2. **No per-file error isolation**: `loadEntries` runs every `.mdx` file's
   `compileMDX` call inside one `Promise.all` with no per-file try/catch —
   one malformed file (bad MDX/JSX syntax) rejects the whole `Promise.all`,
   which takes down `getWriting()`/`getBooks()` entirely — both the listing
   pages *and* every individual post/book page (full crash), instead of
   degrading gracefully by skipping just the broken file.
3. **O(N) single-entry lookups**: `getWritingEntry(slug)` and `getBook(slug)`
   both call the full `getWriting()`/`getBooks()` (which compiles **every**
   file, including running KaTeX math parsing on all of them) just to
   `.find()` the one entry actually requested — wasted compute per
   single-post-page render, growing linearly as content scales.

All shipped fixture content (4 writing posts, 2 books) is well-formed today,
so problems 1 and 2 are currently latent, not actively triggered — but this
template is installed by end users who will add their own content, and a
typo'd frontmatter key or one bad MDX file currently has an
disproportionately large blast radius (the whole section, not just the one
broken post).

## Current state

`registry/new-york/templates/portfolio-v1/lib/posts.ts` — full current content:

```ts
import fs from "node:fs/promises"
import path from "node:path"

import matter from "gray-matter"
import { compileMDX } from "next-mdx-remote/rsc"
import type { ComponentType } from "react"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

export type ContentFrontmatter = {
  title: string
  description?: string
  date: string
  published?: boolean
}

export type ContentEntry = {
  slug: string
  title: string
  description?: string
  date: string
  body: ComponentType
}

const TEMPLATE_CONTENT_FALLBACK = path.join(
  process.cwd(),
  "registry/new-york/templates/portfolio-v1/content"
)

async function resolveContentDir(kind: "writing" | "books"): Promise<string | null> {
  const candidates = [
    path.join(process.cwd(), "content", kind),
    path.join(TEMPLATE_CONTENT_FALLBACK, kind),
  ]

  for (const dir of candidates) {
    try {
      await fs.access(dir)
      return dir
    } catch {
      // try next
    }
  }
  return null
}

function normalizeDate(date: unknown): string {
  // gray-matter parses unquoted YAML dates (e.g. `date: 2025-09-20`) into Date objects.
  if (date instanceof Date) {
    return date.toISOString().slice(0, 10)
  }
  return String(date).slice(0, 10)
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number)
  const d = new Date(Date.UTC(year, month - 1, day))
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

export function formatContentDate(dateStr: string): string {
  return formatDate(dateStr)
}

async function loadEntries(kind: "writing" | "books"): Promise<ContentEntry[]> {
  const directory = await resolveContentDir(kind)
  if (!directory) return []

  let filenames: string[] = []
  try {
    filenames = await fs.readdir(directory)
  } catch {
    return []
  }

  const mdxFiles = filenames.filter((filename) => filename.endsWith(".mdx"))

  const entries = await Promise.all(
    mdxFiles.map(async (filename) => {
      const fullPath = path.join(directory, filename)
      const source = await fs.readFile(fullPath, "utf8")
      const { data, content } = matter(source)
      const frontmatter = data as ContentFrontmatter

      if (frontmatter.published === false) {
        return null
      }

      const compiled = await compileMDX<ContentFrontmatter>({
        source: content,
        options: {
          parseFrontmatter: false,
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeKatex],
          },
        },
      })
      const Body = () => compiled.content

      const entry: ContentEntry = {
        slug: filename.replace(/\.mdx$/, ""),
        title: frontmatter.title,
        description: frontmatter.description,
        date: normalizeDate(frontmatter.date),
        body: Body,
      }
      return entry
    })
  )

  return entries
    .filter((entry): entry is ContentEntry => entry !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function getWriting(): Promise<ContentEntry[]> {
  return loadEntries("writing")
}

export async function getWritingEntry(slug: string): Promise<ContentEntry | null> {
  const entries = await getWriting()
  return entries.find((entry) => entry.slug === slug) ?? null
}

export async function getBooks(): Promise<ContentEntry[]> {
  return loadEntries("books")
}

export async function getBook(slug: string): Promise<ContentEntry | null> {
  const books = await getBooks()
  return books.find((book) => book.slug === slug) ?? null
}
```

Callers (do not need to change, but confirm they still work — see Step 5):
- `registry/new-york/templates/portfolio-v1/app/writing/page.tsx` — calls `getWriting()`
- `registry/new-york/templates/portfolio-v1/app/writing/[slug]/page.tsx` — calls `getWritingEntry(slug)`
- `registry/new-york/templates/portfolio-v1/app/books/page.tsx` — calls `getBooks()`
- `registry/new-york/templates/portfolio-v1/app/books/[slug]/page.tsx` — calls `getBook(slug)`

Real fixture content (used directly by the new tests in Step 4 — no
mocking needed, since when tests run with `process.cwd()` at the repo root,
`content/writing`/`content/books` don't exist there, so `resolveContentDir`
falls through to `TEMPLATE_CONTENT_FALLBACK`, which does):
- `registry/new-york/templates/portfolio-v1/content/writing/` — 4 `.mdx` files, all with valid `date:` frontmatter (confirmed: `how-big-is-far.mdx`, `rip-pluto.mdx`, `the-book-that-started-it.mdx`, `what-the-sky-is-made-of.mdx`)
- `registry/new-york/templates/portfolio-v1/content/books/` — 2 `.mdx` files, both with valid `date:` frontmatter (`why-anything-happens.mdx`, `wonders-of-the-outer-system.mdx`)

**Repo convention**: `lib/schemas.ts` in this same template already
establishes the zod-validation pattern to follow:

```ts
import { z } from "zod"

export const ContactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  // ...
})
```

## Commands you will need

| Purpose   | Command                              | Expected on success |
|-----------|---------------------------------------|---------------------|
| Typecheck | `pnpm typecheck`                      | exit 0, no errors   |
| Tests     | `pnpm test:run`                       | all pass            |
| Lint      | `pnpm lint`                           | exit 0              |
| Registry  | `pnpm registry:validate`              | exit 0              |

## Scope

**In scope**:
- `registry/new-york/templates/portfolio-v1/lib/posts.ts`
- `tests/templates/portfolio-v1/posts.test.ts` (create)

**Out of scope**:
- Any `app/writing/*`/`app/books/*` page component — their calls to
  `getWriting()`/`getWritingEntry()`/`getBooks()`/`getBook()` keep the exact
  same signatures and return shapes, so no caller changes are needed. If
  you find yourself needing to change a caller, stop and reconsider — that
  means the new function signatures drifted from what's specified below.
- `registry/new-york/templates/portfolio-v1/content/*.mdx` — the shipped
  fixture content is already well-formed; do not edit it (it's also what
  the new integration test relies on staying as-is).
- `portfolio-v2` — it uses `lib/notes.tsx` (a different, already-correct,
  static in-memory implementation), not `lib/posts.ts`. Not in scope.
- Adding a new npm dependency for schema validation — `zod` is already a
  dependency of this template (used by `lib/schemas.ts`), reuse it.

## Git workflow

- Branch: `advisor/021-portfolio-v1-content-pipeline-hardening`
- Commit per step or per logical unit.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add a zod schema and a pure `parseFrontmatter` function

Add near the top of `lib/posts.ts`, after the existing imports:

```ts
import { z } from "zod"

const ContentFrontmatterSchema = z.object({
  title: z.string().min(1, { message: "title is required" }),
  description: z.string().optional(),
  date: z.union([z.string(), z.date()]),
  published: z.boolean().optional(),
})

export type FrontmatterParseResult =
  | { ok: true; data: ContentFrontmatter }
  | { ok: false; error: string }

/**
 * Pure — takes raw frontmatter data (already parsed by gray-matter) and
 * validates it. Kept separate from file I/O so it can be unit tested
 * without touching the filesystem.
 */
export function parseFrontmatter(raw: unknown): FrontmatterParseResult {
  const result = ContentFrontmatterSchema.safeParse(raw)
  if (!result.success) {
    return { ok: false, error: result.error.issues[0]?.message ?? "Invalid frontmatter." }
  }
  return {
    ok: true,
    data: {
      title: result.data.title,
      description: result.data.description,
      date: normalizeDate(result.data.date),
      published: result.data.published,
    },
  }
}
```

Note: `parseFrontmatter` calls `normalizeDate`, so it must be added *after*
`normalizeDate`'s existing definition in the file (or `normalizeDate` moved
above it) — keep `normalizeDate`'s implementation exactly as-is, it already
handles both `Date` instances and strings correctly; the problem was never
`normalizeDate` itself, it's that nothing validated `date` was present
*before* reaching it.

**Verify**: `pnpm typecheck` → exit 0, no errors (this step only adds new
exports, nothing calls them yet).

### Step 2: Use `parseFrontmatter` in `loadEntries`, with per-file error isolation

Replace the per-file body inside `loadEntries`'s `mdxFiles.map(...)`
callback:

```ts
const entries = await Promise.all(
  mdxFiles.map(async (filename) => {
    try {
      const fullPath = path.join(directory, filename)
      const source = await fs.readFile(fullPath, "utf8")
      const { data, content } = matter(source)

      const parsed = parseFrontmatter(data)
      if (!parsed.ok) {
        console.warn(`[content] skipping ${kind}/${filename}: ${parsed.error}`)
        return null
      }
      const frontmatter = parsed.data

      if (frontmatter.published === false) {
        return null
      }

      const compiled = await compileMDX<ContentFrontmatter>({
        source: content,
        options: {
          parseFrontmatter: false,
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeKatex],
          },
        },
      })
      const Body = () => compiled.content

      const entry: ContentEntry = {
        slug: filename.replace(/\.mdx$/, ""),
        title: frontmatter.title,
        description: frontmatter.description,
        date: frontmatter.date,
        body: Body,
      }
      return entry
    } catch (error) {
      console.warn(`[content] skipping ${kind}/${filename}: ${error instanceof Error ? error.message : String(error)}`)
      return null
    }
  })
)
```

Key changes from the current code: (a) frontmatter now goes through
`parseFrontmatter` instead of an unchecked cast, (b) the whole per-file body
is wrapped in try/catch so a `compileMDX` failure (bad MDX syntax) skips
just that file via `console.warn` instead of rejecting the entire
`Promise.all`, (c) `frontmatter.date` is already normalized by
`parseFrontmatter`, so the explicit `normalizeDate(frontmatter.date)` call
in the entry construction is removed (just use `frontmatter.date` directly).

**Verify**: `pnpm typecheck` → exit 0, no errors.

### Step 3: Add single-entry loaders for `getWritingEntry`/`getBook`

Replace the tail of the file (from `export async function getWriting()`
onward) with:

```ts
async function loadEntry(kind: "writing" | "books", slug: string): Promise<ContentEntry | null> {
  const directory = await resolveContentDir(kind)
  if (!directory) return null

  const filename = `${slug}.mdx`
  const fullPath = path.join(directory, filename)

  let source: string
  try {
    source = await fs.readFile(fullPath, "utf8")
  } catch {
    return null
  }

  const { data, content } = matter(source)
  const parsed = parseFrontmatter(data)
  if (!parsed.ok) {
    console.warn(`[content] ${kind}/${filename}: ${parsed.error}`)
    return null
  }
  const frontmatter = parsed.data
  if (frontmatter.published === false) return null

  try {
    const compiled = await compileMDX<ContentFrontmatter>({
      source: content,
      options: {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [rehypeKatex],
        },
      },
    })
    const Body = () => compiled.content

    return {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      body: Body,
    }
  } catch (error) {
    console.warn(`[content] ${kind}/${filename}: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}

export async function getWriting(): Promise<ContentEntry[]> {
  return loadEntries("writing")
}

export async function getWritingEntry(slug: string): Promise<ContentEntry | null> {
  return loadEntry("writing", slug)
}

export async function getBooks(): Promise<ContentEntry[]> {
  return loadEntries("books")
}

export async function getBook(slug: string): Promise<ContentEntry | null> {
  return loadEntry("books", slug)
}
```

This duplicates the per-file compile logic between `loadEntries` and
`loadEntry` — that's an accepted tradeoff for this plan (extracting a fully
shared helper would need a bigger refactor of both functions' control flow,
e.g. threading an "early exit after first match" option through
`loadEntries`, which is higher-risk for a plan whose primary goal is
correctness + the O(N)→O(1) win, not a from-scratch rewrite). Note this
duplication in your final report as a known, accepted follow-up, not a
defect.

**Verify**: `pnpm typecheck` → exit 0, no errors.

### Step 4: Add tests

Create `tests/templates/portfolio-v1/posts.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import {
  getBook,
  getBooks,
  getWriting,
  getWritingEntry,
  parseFrontmatter,
} from "@/registry/new-york/templates/portfolio-v1/lib/posts"

describe("parseFrontmatter", () => {
  it("accepts valid frontmatter with a string date", () => {
    const result = parseFrontmatter({ title: "Hello", date: "2026-01-15" })
    expect(result).toEqual({
      ok: true,
      data: { title: "Hello", description: undefined, date: "2026-01-15", published: undefined },
    })
  })

  it("accepts valid frontmatter with a Date object (gray-matter's unquoted-YAML-date behavior)", () => {
    const result = parseFrontmatter({ title: "Hello", date: new Date(Date.UTC(2026, 0, 15)) })
    expect(result.ok).toBe(true)
    if (!result.ok) throw new Error("unreachable")
    expect(result.data.date).toBe("2026-01-15")
  })

  it("rejects frontmatter missing a title", () => {
    const result = parseFrontmatter({ date: "2026-01-15" })
    expect(result.ok).toBe(false)
  })

  it("rejects frontmatter missing a date", () => {
    const result = parseFrontmatter({ title: "Hello" })
    expect(result.ok).toBe(false)
  })

  it("rejects frontmatter with an empty title", () => {
    const result = parseFrontmatter({ title: "", date: "2026-01-15" })
    expect(result.ok).toBe(false)
  })
})

describe("content pipeline integration (real shipped fixture content)", () => {
  it("getWriting returns all 4 published writing posts, sorted newest first", async () => {
    const entries = await getWriting()
    expect(entries).toHaveLength(4)
    const dates = entries.map((e) => e.date)
    expect(dates).toEqual([...dates].sort().reverse())
  })

  it("getBooks returns both books", async () => {
    const books = await getBooks()
    expect(books).toHaveLength(2)
  })

  it("getWritingEntry returns the matching post by slug", async () => {
    const entry = await getWritingEntry("rip-pluto")
    expect(entry).not.toBeNull()
    expect(entry?.title).toBeTruthy()
    expect(entry?.date).toBe("2026-05-18")
  })

  it("getWritingEntry returns null for an unknown slug", async () => {
    const entry = await getWritingEntry("does-not-exist")
    expect(entry).toBeNull()
  })

  it("getBook returns the matching book by slug", async () => {
    const book = await getBook("why-anything-happens")
    expect(book).not.toBeNull()
    expect(book?.date).toBe("2025-09-20")
  })
})
```

Model this file's structure after `tests/wordle/daily.test.ts` (mix of pure
function tests and integration-style tests against real repo data, no
mocking framework needed). The integration tests rely on the real fixture
`.mdx` files in `registry/new-york/templates/portfolio-v1/content/` — do
not mock the filesystem; `resolveContentDir` will naturally fall through to
`TEMPLATE_CONTENT_FALLBACK` when tests run from the repo root (confirmed at
planning time: `content/writing`/`content/books` do not exist at the repo
root).

**Verify**: `pnpm test:run` → all pass, including the 10 new tests.

### Step 5: Confirm callers are unaffected

Read `app/writing/page.tsx`, `app/writing/[slug]/page.tsx`,
`app/books/page.tsx`, `app/books/[slug]/page.tsx` and confirm each still
compiles against the unchanged `getWriting()`/`getWritingEntry()`/`getBooks()`/`getBook()`
signatures (all four keep the exact same parameter types and return types
as before this plan). No edits should be needed in this step — it's a
confirmation, not a code change.

**Verify**: `pnpm typecheck` → exit 0 across the whole repo (confirms no
caller broke).

## Test plan

- New tests in `tests/templates/portfolio-v1/posts.test.ts`: 5
  `parseFrontmatter` unit tests (valid string date, valid Date object,
  missing title, missing date, empty title) + 5 integration tests against
  real shipped fixture content (`getWriting` count/sort,
  `getBooks` count, `getWritingEntry` found/not-found, `getBook` found).
- Structural pattern: `tests/wordle/daily.test.ts` for the mix of pure-unit
  and real-data integration style.
- Verification: `pnpm test:run` → all pass, including 10 new tests.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm test:run` exits 0; the 10 new tests exist and pass
- [ ] `pnpm lint` exits 0
- [ ] `pnpm registry:validate` exits 0
- [ ] `grep -n "as ContentFrontmatter" registry/new-york/templates/portfolio-v1/lib/posts.ts` returns **no** matches (the unchecked cast is gone)
- [ ] `grep -n "parseFrontmatter\|ContentFrontmatterSchema" registry/new-york/templates/portfolio-v1/lib/posts.ts` returns matches
- [ ] `grep -n "async function loadEntry(" registry/new-york/templates/portfolio-v1/lib/posts.ts` returns a match
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The code at the cited location doesn't match the excerpt above (drift
  since this plan was written).
- A step's verification fails twice after a reasonable fix attempt.
- The integration tests in Step 4 fail because `content/writing` or
  `content/books` unexpectedly exists at the repo root (would change which
  directory `resolveContentDir` resolves to) — if so, stop and report
  rather than adjusting the tests to a different fixture set.
- You find `compileMDX`'s error behavior on a genuinely malformed `.mdx`
  file doesn't actually throw (e.g. it silently returns something), which
  would mean the try/catch in Steps 2/3 doesn't achieve the intended
  isolation — verify this assumption if you have doubts, and report rather
  than assuming the fix works without checking.

## Maintenance notes

- `loadEntries` and `loadEntry` now duplicate the per-file MDX-compile logic
  (see Step 3's note) — if this file is touched again for an unrelated
  reason, consider whether it's time to unify them; not urgent today.
- If `portfolio-v1` content grows large enough that `getWriting()`/`getBooks()`
  (which still compile every entry for the listing pages) becomes slow,
  the next optimization would be compiling only frontmatter for listings
  (skip `compileMDX` entirely until a post is actually opened) — out of
  scope for this plan, worth flagging if it comes up.
- A reviewer should confirm `console.warn` output during `pnpm build` for
  this template's content isn't unexpectedly noisy in CI (it should be
  silent given all shipped fixture content is valid).
