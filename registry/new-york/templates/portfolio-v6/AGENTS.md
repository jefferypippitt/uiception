# Personalizing this portfolio

This site ships with filler content for a fictional fullstack developer
("Jon Doe"). It's a demo persona, not a template you fill in
field-by-field — your job is to fully re-skin the site as the real person
who owns this project.

This is a narrow, centered-column CV: About on `/` and Writing under
`/writing`. Almost all copy lives in `lib/portfolio.ts` and
`lib/writing.tsx`.

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
- Current role line for the header ("Title at Company" if they have one)
- A narrative bio: one first-person paragraph synthesized from their
  summary, experience, and notable work, in a voice that matches their
  actual field. Do not reuse the demo's "AI infrastructure startups /
  ship in pieces" framing with the name swapped in — the whole voice
  changes.
- Contact email, if present
- Social / portfolio links actually present in the resume (LinkedIn, GitHub,
  personal site, X, Dribbble, etc.)
- Employment history — role, company, dates, location, description
- Side projects / notable work
- Awards (if any)
- Certifications (if any)
- Education
- Topics worth writing about under Writing (Step 5)

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

Rewrite in `lib/portfolio.ts` and `app/layout.tsx`, in the new voice from
Step 1:

- `portfolio.name` — their full name (also drives the profile header)
- `portfolio.title` — one line under the name, usually "Role at Company"
  or just their title if no current employer. Match their real field.
- `portfolio.about` — one muted paragraph on the About page. Count the
  words in the demo about string and stay within about 20%. One paragraph,
  not three. A nurse or an accountant doesn't get the "ship in pieces"
  developer framing; match the stance to their field.
- `portfolio.email` and the Email row in `portfolio.contact`
- `app/layout.tsx` — `metadata.title` (the name) and `metadata.description`

## Step 3 — Links / Contact

`portfolio.contact` is a fixed set of redirect slots — Email, X,
LinkedIn, GitHub. Keep all four labels and the row shape.

For each row:

- Resume has a real link/handle for it → replace `href` and `value` with
  the real URL / handle. Keep `target="_blank" rel="noreferrer"` on
  non-mailto links (already handled in `app/page.tsx`).
- Resume doesn't mention it, **or you can't recover a real URL for it** →
  set `href="#"` and leave a short placeholder `value`. Don't leave the
  original bare-domain placeholder (`https://x.com/`, etc.) — that's a
  working link to the wrong page.

**Never add a "Portfolio" link found on the resume.** This site *is* their
portfolio.

Beyond the fixed four, if the resume links somewhere else worth keeping
(Dribbble, Mastodon, a personal site that isn't their portfolio), append
another contact row. Never remove one of the four to make room.

## Step 4 — CV sections in `lib/portfolio.ts`

Replace each array with the person's real data. Keep the TypeScript shapes.

### `experience`

Most recent first. Use their actual roles. Three to six entries is the
right range — use what the resume has rather than padding. Dates keep the
`2015 — 2018` / `2024 — Present` format (em dash in the data is fine).

### `projects` (Side Projects)

Keep four when the resume supports it. Ask before shipping fewer.
`href`: real repo or live URL, otherwise `"#"`.

### `awards`

Replace the demo Cortexa / Portland Tech / Synapse / NeuralArc filler with
awards actually on the resume. If the resume has none, set `awards: []`
and remove the Awards `<ResumeSection>` from `app/page.tsx` — do not keep the
demo awards.

### `certificates`

Same rule as awards: replace with real credentials, or empty the array and
drop the Certifications section from `app/page.tsx` if the resume has none.
Do not keep the demo AWS / Scrum / Meta filler when it isn't theirs.

### `education`

Replace with their real schools / degrees. Keep `dates` in the same format.

## Step 5 — Writing — `lib/writing.tsx`

Four demo posts about building AI agents. Replace them with entries that
fit the person's real field from Step 1.

- Keep the same shape per entry: `slug`, `title`, `date` (`YYYY-MM-DD`),
  `description`, and a `body` that returns JSX — **plain `<p>` paragraphs
  only**. No images, no headings, no tables.
- Keep four entries. If the resume genuinely doesn't support four distinct
  topics, say so and ask before shipping fewer.
- Length budget per post: count the words in the entry you're replacing
  and stay within about 20%.
- Keep `description` to one sentence.

## Step 6 — Unslop pass

Before you're done, read `UNSLOP.md` and check everything you drafted in
Steps 2–5 against it. Rewrite what trips those patterns before finishing.

## Do not touch

- `components/site-nav.tsx` routing (`/` and `/writing` stay)
- `components/theme-provider.tsx`, `components/theme-switcher.tsx`
- `components/avatar.tsx` beyond nothing — the photo-resolution logic and
  the `public/avatar.png` path stay. The owner drops their own
  `public/avatar.png` after install.
- `lib/media.ts` and the block-media CDN fallback
- Theme, CSS, and layout structure — the centered column and date-left
  rows are deliberate. Copy and data change; the shell does not.

## When you're done

The resume was never copied into the repo, so there's nothing to clean up
there. If you made a scratch copy in a temp directory for the Step 1
extraction, confirm it's deleted. If the user has a `resume.pdf` sitting in
the project root anyway (a manual drop, or a previous run), point it out
and offer to remove it — `.gitignore` now keeps it from being committed
either way.
