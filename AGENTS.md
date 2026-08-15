# Project conventions

Before touching anything under `registry/new-york/blocks/` or
`registry/new-york/templates/`, read these project-specific rules — they
are not optional style preferences, they are enforced by
`pnpm registry:validate` and reviewed in every PR:

- **`.cursor/rules/registry-blocks-source-layout.mdc`** — the required block
  folder structure (`page.tsx`, `components/`, `hooks/`, `lib/`, `styles/`)
  and import conventions between them.
- **`.cursor/rules/registry-blocks-tailwind.mdc`** — Tailwind v4
  utilities-first styling rules; block `.css` files are reserved for
  keyframes, pseudo-elements, complex grids, GSAP/scroll hooks, and mock-UI
  scoped CSS variables only.
- **`.cursor/rules/registry-block-media.mdc`** — how block images/video work:
  blocks resolve media locally-first via `existsSync` against
  the consumer's own `public/` folder, falling back to
  `https://uiception.com/...` when no local file exists — so a fresh install
  works immediately and swapping an asset never requires a code edit. No
  `mediaOrigin` / env. `next/image` always gets `unoptimized`, and every
  expected asset gets a `.gitkeep` placeholder declared in `registry.json`.
- **`.cursor/rules/registry-templates.mdc`** — how installable page
  templates (`registry/new-york/templates/`) differ from blocks: no fixed
  folder shape, self-contained (no cross-imports from the host site or
  other templates), and the four registration points a new template must
  touch.

After adding or editing a block, also see `README.md` ("Block structure") and
`WORKFLOW.md` (pre-push commands: `pnpm check` then `pnpm build`).

---

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
