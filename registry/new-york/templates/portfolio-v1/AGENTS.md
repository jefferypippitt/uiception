# Personalizing this portfolio

This site ships with filler content for a fictional physicist and science
communicator ("Jon Doe"). It's a demo persona, not a template you fill in
field-by-field — your job is to fully re-skin the site as the real person
who owns this project.

**Trigger:** the user attaches their resume (a PDF) directly to you and
asks you to personalize the site — e.g. by mentioning `@AGENTS.md`. When
that happens, follow the steps below.

The resume is personal data and has no reason to live in this repo. Work
from the attachment. Do **not** copy it into the project directory at any
point — not to read it, not to run the extraction in Step 1, not
"just temporarily while I work." As a safety net in case someone saves it
here by hand, add a line to `.gitignore` before you start (skip if it's
already listed):

```
grep -qxF 'resume.pdf' .gitignore || echo 'resume.pdf' >> .gitignore
```

## Step 1 — Read the resume

Read the attached resume. Pull out:

- Full name
- Real profession / field / title (e.g. "Full-Stack Developer", "Product
  Designer", "Marine Biologist") — this drives the tone of everything below
- A narrative bio: 1–2 paragraphs synthesized from their summary, experience,
  and notable work — written in first person, in a voice that matches their
  actual field. Do not reuse the physicist framing ("planetary science",
  "the solar system") with the name swapped in — the whole voice changes.
- Contact email, if present
- Social / portfolio links actually present in the resume (LinkedIn, GitHub,
  personal site, X, Dribbble, etc.)
- Notable projects, publications, or focus areas worth referencing in
  writing/book content (Step 4)

### Recovering the real URL behind a link

Reading the PDF only gives you visible text — "GitHub" as a clickable
label doesn't tell you what it links to. Before treating any link as
unresolved, try recovering the actual target from the raw bytes of the
file.

This needs a real filesystem path, and the resume is an attachment, not a
file in the repo. Copy it to a scratch location **outside the project** —
your OS temp directory — run the search there, and delete it when done:

```
# adjust the source to wherever the attachment actually is on disk
cp <attached-resume-path> "${TMPDIR:-/tmp}/resume.pdf"
grep -a -o "/URI[^)]*)" "${TMPDIR:-/tmp}/resume.pdf"
rm "${TMPDIR:-/tmp}/resume.pdf"
```

On Windows use the temp dir (`"$TEMP/resume.pdf"` in Git Bash,
`$env:TEMP` in PowerShell). Never copy it under the project directory,
even for a moment. If you can't get a filesystem path to the attachment at
all, ask the user for the path to the file on their machine and grep it in
place — still don't bring it into the repo.

Most resumes (exported from Google Docs, Word, or a resume builder) store
their hyperlink targets as plain-text `/URI (...)` entries even when the
rest of the PDF is compressed, so this works more often than not. Match
each URL back to the label near it in the resume text — a `mailto:` is the
email, a `github.com/...` URL is GitHub, `linkedin.com/in/...` is LinkedIn,
and so on. Do this for every link-looking label in the resume, not just
the obvious ones — it's what makes Step 3 actually work instead of falling
back to asking every time.

Only fall back to asking the user for the real link if this comes up empty
and the resume text still shows an unresolved label — some PDFs compress
the annotation objects too, which a plain-text search can't see through.

## Step 2 — Identity & tone

Rewrite, in the new voice from Step 1:

- `app/page.tsx` — the `<h1>` name, and the two bio `<p>` paragraphs. They
  are not interchangeable — each one is doing a specific job, and copying
  the pattern matters as much as matching the length:
  - **Paragraph 1 — Identity: who they are.** Role, domain, and a
    defining stance or tension in how they work — the original is "I'm a
    physicist. I work on planetary science and the structure of the solar
    system, and I spend as much time explaining the universe as measuring
    it." (role → domain → a duality that says something about *how* they
    approach the work, not just what it is).
  - **Paragraph 2 — Purpose: what their public output is about, and for
    whom.** Not a list of named projects — the original is "Most of my
    public work is about why planets are the way they are... I write
    books and notes for people who have looked up and wanted a clearer
    picture of what we are seeing." It's the *theme* of what they
    write/build in public, plus who it serves, and it bridges into the
    Writing/Books sections below it on the page. Named projects belong in
    those
    sections (Step 4) and in the "what I've been writing lately" list,
    which already exists — don't front-load them into the bio too.
    Most resumes have no publishing history at all — a nurse, an
    accountant, a retail manager almost never have a "public output" to
    theme around, and that's the common case, not an exception. When
    there's nothing to draw on, frame this paragraph around what they'd
    plausibly write about *given their actual field and role* — the kind
    of thing worth noting from work they've actually done — not invented
    accomplishments. It's honest framing of intent, not a summary of a
    body of work that doesn't exist yet.
- `app/layout.tsx` — `metadata.title` and `metadata.description`
- `app/contact/page.tsx` — the intro paragraph (currently mentions "books
  and notes" — reframe to match what this person actually does)
- `app/writing/page.tsx` and `app/books/page.tsx` — the one-line intro
  under each `<h1>` (currently physicist-flavored, e.g. "Popular-science
  books from the same public work")
- `app/page.tsx` — the "Find your way around" list: the two muted
  descriptions ("short notes and essays", "longer, book-length work") next
  to the Writing and Books links. See "Section labels" below — the label
  words themselves may need to change too, not just these descriptions.

**Length budget:** before you rewrite the two bio paragraphs, count the
words in the two you're replacing. Match that count within about 20%, and
keep it two paragraphs, not three or four. The demo bio is short on
purpose — two or three sentences each. A longer bio isn't more thorough,
it's just a worse read. Same rule for the one-line intros: one line stays
one line. Same for the two "Find your way around" descriptions: they're
four words each — stay in that range, don't turn them into full sentences.

### Section labels (Writing / Books)

"Books" barely fits anyone who isn't an author, and it's the common case,
not an edge case — most people personalizing this (a full-stack developer
is the expected default) have no literal books. Don't just reinterpret the
content under the label (Step 4) and leave the word "Books" sitting there
if it reads wrong. Relabel it. This doesn't touch routing — `/books` stays
`/books` as a URL; only the *visible* text changes, in every place it
appears:

1. `app/page.tsx` — the nav link text ("Writing" / "Books" in the "Find
   your way around" list) and its muted description
2. `app/writing/page.tsx` / `app/books/page.tsx` — the `<h1>` and the
   one-line intro under it

Pick a label that actually fits — "Projects", "Work", "Case Studies" for
Books; "Writing" itself is a reasonable fit for almost anyone and usually
doesn't need to change. Do this automatically as part of the personalization,
the same way you rewrite the bio — you don't need to ask first unless the
right replacement word genuinely isn't obvious. Keep every label to a
single word or short phrase, matching the length of what it replaces —
this is a nav item, not a sentence.

## Step 3 — Links

Do not shorten or remove the "Elsewhere, I'm on Instagram, X, and
GitHub" section in `app/page.tsx` — keep all three labels and the sentence
structure exactly as they are. This section is a fixed set of redirect
slots, not a list you edit down to what the resume happens to mention.
("X" is the platform formerly called Twitter — a resume may still label it
either way.)

For each of the three, the `href` rule is the same for every platform,
every time — resolved or not:

- Resume has a real link/handle for the platform (most dev resumes have a
  GitHub) → replace that one `href` with the real URL. Keep
  `target="_blank" rel="noreferrer"` as-is — it already opens in a new tab.
- Resume doesn't mention the platform (Instagram usually won't; a resume
  link labeled "Twitter" is the same platform as X — fill the X slot
  with it, don't treat it as a new one), **or you can't recover a real URL
  for it** (see the PDF caveat below) → set `href="#"`. Don't leave the
  original bare-domain placeholder (`https://instagram.com`, etc.) —
  that's a working link to the wrong page, which is worse than an obvious
  placeholder. `href="#"` reads unambiguously as "not filled in yet," for
  a developer and non-developer alike.

A link's visible text alone ("Portfolio", "GitHub") doesn't tell you the
`href` — use the extraction command from Step 1 to recover it before
concluding it's unresolved. Only after that comes up empty do you treat it
like "not on the resume": don't guess a URL, don't leave a URL that looks
real but isn't. Set it to `href="#"`, and ask the user for the actual link
so you can fill it in for real.

**Never add a "Portfolio" link found on the resume.** This site *is* their
portfolio — that resume link points at wherever their portfolio currently
lives, and once they've personalized this template, this is that site.
Linking out to it would point the person's own site at itself (or at an
old one they're replacing). Skip it entirely; don't add it to the list, no
matter what domain it resolves to.

**Beyond the fixed three, actively check the resume for these and add each
one you find as a new item in the same list** — never remove or replace
any of the original three to make room for them, only append:

- **LinkedIn** — check for this every time. It's the single most common
  link on a resume that isn't already one of the three slots. If found, it
  goes right after X and before GitHub, so the order reads
  Instagram, X, LinkedIn, and GitHub.
- Anything else the resume links to (Dribbble, a Mastodon handle, etc.)
  also goes at the end, in the order you found it. This isn't a closed
  list — LinkedIn is just the one to never skip checking for.

Exact placement for LinkedIn, so it's unambiguous — this is the only line
in `app/page.tsx` that changes shape:

```jsx
<p>
  Elsewhere, I&apos;m on{" "}
  <Link href="#" target="_blank" rel="noreferrer">
    Instagram
  </Link>
  ,{" "}
  <Link href="#" target="_blank" rel="noreferrer">
    X
  </Link>
  ,{" "}
  <Link href="https://linkedin.com/in/their-real-handle" target="_blank" rel="noreferrer">
    LinkedIn
  </Link>
  , and{" "}
  <Link href="https://github.com/their-real-handle" target="_blank" rel="noreferrer">
    GitHub
  </Link>
  .
</p>
```

This example shows a resume with LinkedIn and GitHub but no Instagram or
X, which is the common case — Instagram and X fall back to
`#`, LinkedIn gets appended, GitHub gets its real handle. If LinkedIn
isn't on the resume, don't add that block at all; just apply the `#`-or-real
rule to the original three.

## Step 4 — Writing & Books content

`content/writing/*.mdx` and `content/books/*.mdx` are demo posts about
planetary science. Replace them with new entries that fit the person's real
title/field from Step 1 — e.g. a full-stack developer gets short technical
notes under `content/writing/` and longer project write-ups or guides under
`content/books/` (reinterpret "Books" as their long-form work — case
studies, whitepapers, guides — if they don't literally have books). If
that reinterpretation feels like a stretch once you've drafted it, relabel
the section per "Section labels" in Step 2 instead of forcing the content
to justify a word that doesn't fit — do this automatically, don't wait to
be asked.

- Keep the same frontmatter schema: `title`, `description`, `date`
  (`YYYY-MM-DD`), `published` (optional)
- **Keep the same number of entries** currently in each folder — count the
  files in `content/writing/` and `content/books/` before you delete
  anything, and replace with that many, not fewer. If the resume genuinely
  doesn't support that many distinct topics, say so and ask before
  under-filling a section.
- **Length budget, per entry:** before replacing a file, count its words
  (frontmatter excluded). Target the new entry within about 20% of that —
  neither a two-line stub nor a doubled-length essay. Do this per file, not
  as a folder average, since the demo entries aren't all the same length
  to begin with.
- Match the existing structure of the current demo entries — prose
  paragraphs, a `<figure>` image with `<figcaption>` (see below), a pull
  quote via `>`, a table or two if relevant to the field
- Images: every `content/writing/*.mdx` entry gets a `<figure>` unless the
  topic is genuinely non-visual — see "Sourcing images" below for how to
  find a real URL (a required step, not a nice-to-have) and how exact the
  match has to be. Video is never an option in this template.
- Titles and topics should read as genuinely written by this person about
  their real field, not a generic reskin — use the specifics from their
  resume (technologies, industries, notable work) as material

### Sourcing images

Images are expected. Personalization should not produce a set of text-only
posts when the demo had a photo on nearly every one. Every
`content/writing/*.mdx` entry gets one `<figure>` unless the topic is
genuinely non-visual (a pure-abstract argument, a math-heavy note).
Books / long-form entries: one where it fits, optional otherwise. "I
couldn't find one" is a per-figure outcome after a real search — never the
reason the whole set ships bare.

Images only — this template has no video component or pattern anywhere in
it, so never add a `<video>` tag or embed.

Images are plain hotlinked URLs in the MDX itself — no upload, no local
file, no attachment. Use exactly the pattern the demo content already
uses:

```
<figure>
  <img
    className="grayscale dark:brightness-50"
    src="https://images.unsplash.com/photo-<id>?q=80&w=1200&h=675&fit=crop"
    alt="..."
    width={1200}
    height={675}
  />
  <figcaption>...</figcaption>
</figure>
```

**Finding the URL is a required step, not optional.** Unsplash photo IDs
are not guessable, and a plausible-looking one is almost always a dead
link. Never write a `src` from memory. For each figure:

1. Web-search or fetch for a real Unsplash photo matching the topic — the
   `firecrawl` skill, or `WebSearch` / `WebFetch`, all work.
2. Take the actual photo ID from the real page URL
   (`unsplash.com/photos/<slug>-<id>`) and build the `src` with the query
   string shown above.
3. Only if that specific search turns up nothing that is an *exact* match
   (see below) do you skip that one `<figure>` — and say so in your
   summary: which entries you left imageless and why.

If you have no web access at all in this environment, stop and tell the
user before finishing: either they supply the image URLs, or the
personalization pass runs somewhere with web access. Do not ship the
content silently image-free.

**The match has to be exact, not thematic.** `rip-pluto.mdx` is the bar:
the post is specifically about Pluto, and the image is an actual photo of
Pluto, not a generic nebula or star field. A post about a specific
product, place, or piece of hardware needs a photo of that thing (or
something concretely evocative of it), not a generic "coding" or "office"
stock photo standing in for the topic.

What *kind* of photo fits depends on the field, but the answer is rarely
"none":

- **Developer / technical field** — skip the laptop-on-a-desk cliché. When
  the work has no photographable subject of its own, a clean editorial
  shot of the real-world domain it serves (a warehouse floor, a hospital
  ward, a trading desk, transit signage) carries the post. Never pass off
  a screenshot, chart, or diagram as a photo.
- **Writer / creative field** — closest to the current demo. An exact,
  specific photo on essentially every entry.
- **Other / general personal site** — one exact-match image per entry;
  favor a precise photo of the real subject over an evocative-but-vague
  one.

## Step 5 — Unslop pass

Before you're done, read `UNSLOP.md` and check everything you drafted in
Steps 2 and 4 against it. AI-generated bios and blog posts have a
recognizable smell — stacked em dashes, fortune-cookie pull quotes,
"not just X but Y," decorative jargon — and this is exactly the content
most likely to have it. Rewrite what trips those patterns before finishing.

## Do not touch

- `BASIN_ENDPOINT` / `.env.local` — separate manual setup, not derived from
  the resume (see `.env.example`)
- `components/contact-form.tsx`, `components/saturn-decoration.tsx`, **and
  the `<SaturnDecoration />` usage in `app/page.tsx`.** Leave the
  decoration on the page exactly as it is, whatever the person's field. It
  ships on by default; the owner removes it themselves if they don't want
  it. Don't drop it, don't gate it on whether the field is
  space-adjacent, don't move it.
- Theme, CSS, and routing (URLs stay `/writing`, `/books`, `/contact` —
  only the visible labels change, per "Section labels" in Step 2, never
  the folder names or routes themselves)

## When you're done

The resume was never copied into the repo, so there's nothing to clean up
there. If you made a scratch copy in a temp directory for the Step 1
extraction, confirm it's deleted. If the user has a `resume.pdf` sitting in
the project root anyway (a manual drop, or a previous run), point it out
and offer to remove it — `.gitignore` now keeps it from being committed
either way.
