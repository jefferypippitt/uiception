# Personalizing this portfolio

This site ships with filler content for a fictional fullstack developer
("Jon Doe"). It's a demo persona, not a template you fill in
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
- A narrative bio: one first-person paragraph synthesized from their
  summary, experience, and notable work, in a voice that matches their
  actual field. Do not reuse the demo's "AI infrastructure startups /
  ship in pieces" framing with the name swapped in — the whole voice
  changes.
- Contact email, if present
- Social / portfolio links actually present in the resume (LinkedIn, GitHub,
  personal site, X, Dribbble, etc.)
- Notable projects, work, or focus areas worth listing under Projects and
  writing about under Notes (Step 4)
- Employment history — role, company, dates — for the Experience list
  (Step 4)

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

- `app/page.tsx`:
  - the `<h1>` name ("Jon Doe")
  - the role line directly under it (`Fullstack Developer`) — their real
    title from Step 1
  - the greeting line ("Hey, I'm Jon.") — "Hey, I'm &lt;first name&gt;."
  - the single bio `<p>` below the greeting. One paragraph, two or three
    sentences: role → what they work on and who for → a concrete stance on
    how they work. The original is "I work as a fullstack developer,
    building for AI infrastructure startups and teams shipping real tools
    with real users. I keep my stack simple, I ship in pieces I can trust,
    and I leave software that stays easy to maintain." Keep that length —
    one paragraph, not three. A nurse or an accountant doesn't get the
    "ship in pieces" developer framing; match the stance to their field.
- `app/layout.tsx` — `metadata.title` (the name) and `metadata.description`
- `app/notes/page.tsx` — the name and role in the top-left home link, the
  `<h1>` ("Notes" — usually fine, see "Section labels"), and the one-line
  intro under it ("Short writing on fullstack development, shipping, and
  systems.")
- `app/notes/[slug]/page.tsx` — the name and role in the same top-left link
- `components/avatar.tsx` — the `JD` fallback initials (their initials).
  The photo path and resolution logic stay, see "Do not touch".
- `components/copy-email.tsx` — the `EMAIL` constant (currently a real
  address) → their contact email from the resume. If the resume has no
  email, keep the component but ask the user which address to use.

**Length budget:** the demo bio is one short paragraph on purpose. Count
its words before you rewrite and stay within about 20%. One paragraph, not
two or three. The one-line intro under the Notes heading stays one line.

### Section labels

"Notes", "Projects", and "Experience" fit most people as-is. If one reads
wrong for the field, relabel it — this doesn't touch routing, `/notes`
stays `/notes`, only the visible text changes: the `<h2>` in `app/page.tsx`
and, for Notes, also the `<h1>` and intro in `app/notes/page.tsx`. Keep
each label to a single word.

## Step 3 — Links

The bio paragraph in `app/page.tsx` ends with a fixed set of social slots —
**X, LinkedIn, GitHub** — followed by a copy-email button. Keep all three
labels and the sentence shape. This is a redirect slot set, not a list you
edit down to what the resume happens to mention. ("X" is the platform
formerly called Twitter — a resume may still label it either way.)

For each of the three, the rule is the same every time:

- Resume has a real link/handle for it → replace that one `href` with the
  real URL. Keep `target="_blank" rel="noreferrer"` as-is.
- Resume doesn't mention it, **or you can't recover a real URL for it**
  (see the PDF caveat in Step 1) → set `href="#"`. Don't leave the
  original bare-domain placeholder (`https://x.com/`, `https://github.com/`,
  `https://www.linkedin.com/`) — that's a working link to the wrong page,
  which is worse than an obvious placeholder. `href="#"` reads
  unambiguously as "not filled in yet."

A link's visible text alone ("Portfolio", "GitHub") doesn't tell you the
`href` — use the extraction command from Step 1 to recover it before
concluding it's unresolved. Only after that comes up empty do you treat it
like "not on the resume": don't guess a URL, don't leave a URL that looks
real but isn't. Set it to `href="#"` and ask the user for the actual link.

**Never add a "Portfolio" link found on the resume.** This site *is* their
portfolio — that resume link points at wherever their portfolio currently
lives, and once they've personalized this template, this is that site.
Skip it entirely, no matter what domain it resolves to.

Beyond the fixed three, if the resume links somewhere else worth keeping
(Dribbble, a Mastodon handle, a personal site that isn't their portfolio),
add it as one more `<Button variant="link" asChild>` slot in the same
sentence, in the order you found it. Never remove one of the three to make
room.

The **Experience** section links — both the per-role list items and the
"LinkedIn" link under the list in `app/page.tsx` — all point at
`https://www.linkedin.com/`. Point them at the person's real LinkedIn if
the resume has it, or `#` if not. Same rule.

## Step 4 — Notes, projects, and experience

### Notes — `lib/notes.tsx`

Four demo notes about building AI agents. Replace them with entries that
fit the person's real field from Step 1.

- Keep the same shape per entry: `slug`, `title`, `date` (`YYYY-MM-DD`),
  `description`, and a `body` that returns JSX — **plain `<p>` paragraphs
  only**, the way the demo entries are built. No images, no headings, no
  tables: this template renders a note body as a simple prose column and
  has no styling for anything else.
- Keep four entries. If the resume genuinely doesn't support four distinct
  topics, say so and ask before shipping fewer.
- Length budget per note: count the words in the entry you're replacing
  (two or three short paragraphs) and stay within about 20%.
- Keep `description` to one sentence, like the originals.
- Titles and topics should read as genuinely written by this person about
  their real work — use specifics from the resume, not a generic reskin.

### Projects — the `projects` array in `app/page.tsx`

Four demo side-projects. Replace with the person's real projects, portfolio
pieces, or notable work from the resume.

- Keep the shape: `number` (`"01"`–`"04"`), `name`, `href`, `description`
  (one line, roughly the length of the originals).
- Keep four. Same "ask before shipping fewer" rule.
- `href`: a real repo or live URL if the resume has one, otherwise `"#"` —
  not the bare `https://github.com/` placeholder.

### Experience — the `experience` array in `app/page.tsx`

A demo career ladder with invented companies. Replace with the person's
real roles from the resume.

- Keep the shape: `role`, `company`, `dates` (match the `"2024 to Present"`
  format).
- Use their actual roles, most recent first. Three to five entries is the
  right range — use what the resume actually has rather than padding to a
  fixed count.

## Step 5 — Unslop pass

Before you're done, read `UNSLOP.md` and check everything you drafted in
Steps 2 and 4 against it. AI-generated bios and blog posts have a
recognizable smell — stacked em dashes, fortune-cookie closing lines,
"not just X but Y," decorative jargon — and this is exactly the content
most likely to have it. Rewrite what trips those patterns before finishing.

## Do not touch

- `components/liquid-shell.tsx`, `components/canvasui/liquid.tsx`, and the
  `NEXT_PUBLIC_HTML_IN_CANVAS_OT_TOKEN` / Origin Trial wiring in
  `app/layout.tsx` and `.env.example` — the Liquid background is separate
  manual setup, not derived from the resume. Leave it on by default; the
  owner removes it themselves if they don't want it.
- `components/avatar.tsx` beyond the fallback initials — the
  photo-resolution logic and the `public/avatar.png` path stay. The owner
  drops their own `public/avatar.png` after install.
- `components/theme-provider.tsx`, `components/theme-toggle.tsx`, and the
  logic in `components/copy-email.tsx` (only the `EMAIL` value changes,
  never the component).
- Theme, CSS, and routing — `/notes` stays `/notes` as a URL; only the
  visible labels change, per "Section labels", never the folder names or
  routes themselves.

## When you're done

The resume was never copied into the repo, so there's nothing to clean up
there. If you made a scratch copy in a temp directory for the Step 1
extraction, confirm it's deleted. If the user has a `resume.pdf` sitting in
the project root anyway (a manual drop, or a previous run), point it out
and offer to remove it — `.gitignore` now keeps it from being committed
either way.
