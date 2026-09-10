# Personalizing this portfolio

This site ships with filler content for a fictional fullstack developer
("Jon Doe"). It's a demo persona, not a template you fill in
field-by-field — your job is to fully re-skin the site as the real person
who owns this project.

This is a single-page site: one screen with a row of social links, a
short about section, and a list of projects, over a WebGPU black hole.
There are no other routes. All of that copy lives in `app/page.tsx` —
same pattern as portfolio-v1.

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
- A narrative bio: a short first-person about section synthesized from
  their summary, experience, and notable work, in a voice that matches
  their actual field. Do not reuse the demo's "AI infrastructure /
  ship in small pieces" framing with the name swapped in — the whole
  voice changes.
- Notable projects, portfolio pieces, or work worth listing under Projects
- A real repo or live URL for each of those projects, if the resume has one
- Social / profile links actually present in the resume (LinkedIn, GitHub,
  personal site, X, Instagram, Dribbble, etc.)

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
each URL back to the label near it in the resume text — a `github.com/...`
URL is GitHub, `linkedin.com/in/...` is LinkedIn, and so on. Do this for
every link-looking label in the resume, not just the obvious ones — it's
what makes Step 3 actually work instead of falling back to asking every
time.

Only fall back to asking the user for the real link if this comes up empty
and the resume text still shows an unresolved label — some PDFs compress
the annotation objects too, which a plain-text search can't see through.

## Step 2 — About section

Rewrite the three about `<p>` paragraphs in `app/page.tsx`, in the new
voice from Step 1:

- **Paragraph 1** — who they are: name, role, and what they work on or who
  for. The original is "I'm Jon, a fullstack developer in Portland. Most
  of my work is with early AI infrastructure teams."
- **Paragraph 2** — a concrete stance on how they work (the demo: "I keep
  the stack small and ship in small pieces...").
- **Paragraph 3** — a line or two about life outside work that sets up the
  projects below (the demo's cooking / running / books map to the demo
  projects). If the person's real projects aren't personal side-projects,
  this can be more about focus areas or what they're learning — keep it
  short and keep it human. A nurse or an accountant doesn't get the "ship
  in small pieces" developer framing; match the stance to their field.

Also update `app/layout.tsx` — `metadata.title` (currently "Jon Doe" →
their name) and `metadata.description`.

**Length budget:** the demo about section is three short paragraphs on
purpose. Count the words before you rewrite and stay within about 20%.
Don't add a fourth paragraph. A longer about section isn't more thorough,
it's just a worse read.

The page has no name heading and no job-title line — the about copy is the
only identity prose on the site. Don't add an `<h1>` name; that's a
deliberate design choice for this template.

## Step 3 — Links

Do not shorten or remove the Instagram, X, and GitHub links in
`app/page.tsx` — keep all three labels. This is a fixed set of redirect
slots, not a list you edit down to what the resume happens to mention.
("X" is the platform formerly called Twitter — a resume may still label it
either way.) Same pattern as portfolio-v1.

For each of the three, the `href` rule is the same for every platform,
every time — resolved or not:

- Resume has a real link/handle for the platform (most dev resumes have a
  GitHub) → replace that one `href` with the real URL. Keep
  `target="_blank" rel="noreferrer"` as-is — it already opens in a new tab.
- Resume doesn't mention the platform (Instagram usually won't; a resume
  link labeled "Twitter" is the same platform as X — fill the X slot
  with it, don't treat it as a new one), **or you can't recover a real URL
  for it** → set `href="#"`. Don't leave the original bare-domain
  placeholder (`https://instagram.com`, etc.) — that's a working link to
  the wrong page, which is worse than an obvious placeholder. `href="#"`
  reads unambiguously as "not filled in yet."

A link's visible text alone ("Portfolio", "GitHub") doesn't tell you the
`href` — use the extraction command from Step 1 to recover it before
concluding it's unresolved. Only after that comes up empty do you treat it
like "not on the resume": don't guess a URL, don't leave a URL that looks
real but isn't. Set it to `href="#"`, and ask the user for the actual link
so you can fill it in for real.

**Never add a "Portfolio" link found on the resume.** This site *is* their
portfolio — that resume link points at wherever their portfolio currently
lives, and once they've personalized this template, this is that site.
Skip it entirely; don't add it to the list, no matter what domain it
resolves to.

**Beyond the fixed three, actively check the resume for these and add each
one you find as a new `<Button variant="link" asChild>` in the same nav** — never remove or replace
any of the original three to make room for them, only append:

- **LinkedIn** — check for this every time. It's the single most common
  link on a resume that isn't already one of the three slots. If found, it
  goes right after X and before GitHub, so the order reads
  Instagram, X, LinkedIn, and GitHub.
- Anything else the resume links to (Dribbble, a Mastodon handle, etc.)
  also goes at the end, in the order you found it. This isn't a closed
  list — LinkedIn is just the one to never skip checking for.

Exact placement for LinkedIn, so it's unambiguous — this is the only block
in `app/page.tsx` that changes shape:

```jsx
<nav className="pointer-events-auto flex flex-wrap gap-x-4 gap-y-1">
  <Button
    variant="link"
    asChild
    className="h-auto p-0 text-base font-normal text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
  >
    <a href="#" target="_blank" rel="noreferrer">
      Instagram
    </a>
  </Button>
  <Button
    variant="link"
    asChild
    className="h-auto p-0 text-base font-normal text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
  >
    <a href="#" target="_blank" rel="noreferrer">
      X
    </a>
  </Button>
  <Button
    variant="link"
    asChild
    className="h-auto p-0 text-base font-normal text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
  >
    <a
      href="https://linkedin.com/in/their-real-handle"
      target="_blank"
      rel="noreferrer"
    >
      LinkedIn
    </a>
  </Button>
  <Button
    variant="link"
    asChild
    className="h-auto p-0 text-base font-normal text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
  >
    <a
      href="https://github.com/their-real-handle"
      target="_blank"
      rel="noreferrer"
    >
      GitHub
    </a>
  </Button>
</nav>
```

This example shows a resume with LinkedIn and GitHub but no Instagram or
X, which is the common case — Instagram and X fall back to `#`, LinkedIn
gets inserted, GitHub gets its real handle. If LinkedIn isn't on the
resume, don't add that block at all; just apply the `#`-or-real rule to
the original three.

## Step 4 — Projects

Replace the `projects` array at the top of `app/page.tsx` with the
person's real projects, portfolio pieces, or notable work from the resume.

- Keep the shape: `name`, `href`, `description`. The description is one
  line, roughly the length of the originals — what the project is, not a
  pitch.
- Keep four entries. If the resume genuinely doesn't support four distinct
  projects, say so and ask before shipping fewer.
- `href`: a real repo or live URL if the resume has one (recover it per
  Step 1), otherwise `"#"` — never leave the bare `https://github.com/`
  placeholder, which is a working link to the wrong page. Each entry opens
  in a new tab already.

## Step 5 — Unslop pass

Before you're done, read `UNSLOP.md` and check the about section and every
project description you wrote against it. AI-generated prose has a
recognizable smell — stacked em dashes, rule-of-three lists, "not just X
but Y," fortune-cookie closing lines, decorative jargon — and short
portfolio copy is exactly where it shows. Rewrite what trips those
patterns before finishing.

## Do not touch

- `components/black-hole.tsx`, everything under `components/black-hole/`,
  and the `<BlackHole />` usage in `app/layout.tsx`. The background is a
  near-verbatim port of vgpu's Optimized Black Hole example; it isn't
  derived from the resume. It ships on by default; the owner removes it
  themselves if they don't want it.
- `next.config.ts` — it registers the WGSL loader for Turbopack and
  webpack. The black hole won't render without it.
- `lib/wgsl-env.d.ts`. The template needs no env vars, so there is no
  `.env.example`.
- Theme, CSS, and layout structure — the copy and social `href`s in
  `app/page.tsx` and `app/layout.tsx` metadata are the only things that
  change.

## When you're done

The resume was never copied into the repo, so there's nothing to clean up
there. If you made a scratch copy in a temp directory for the Step 1
extraction, confirm it's deleted. If the user has a `resume.pdf` sitting in
the project root anyway (a manual drop, or a previous run), point it out
and offer to remove it — `.gitignore` now keeps it from being committed
either way.
