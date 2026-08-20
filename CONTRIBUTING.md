# Contributing to uiception

Thanks for taking the time to contribute. This document covers how to get set up, the
conventions this repo expects, and how a pull request gets from open to merged.

By participating in this project, you agree to abide by the
[Code of Conduct](./CODE_OF_CONDUCT.md).

## Prerequisites

- Node.js 20+
- pnpm

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Before opening a pull request

Run the same checks CI runs:

```bash
pnpm check   # registry:validate + test:run + typecheck
pnpm build   # prebuild runs registry:build, then next build (same as Vercel)
```

See [WORKFLOW.md](./WORKFLOW.md) for image/video compression steps if your change adds
block assets.

## Pull requests

- `main` is protected: PRs require a passing CI check and **signed commits**. Set up
  commit signing (GPG or SSH) before pushing — see
  [GitHub's guide to signing commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits),
  or unsigned commits will block your PR from merging.
- Keep PRs focused — one block, fix, or feature per PR.
- Fill out the PR template; link any related issue.
- A maintainer will review and may ask for changes before merging.

## Adding or editing a block

Every block follows the shadcn-style layout described in [Block structure](/docs#03-block-structure):

```
registry/new-york/blocks/<block-name>/
  <block-name>.tsx      # Entry point — section wrapper + imports only, no logic
  page.tsx              # Preview page
  components/           # Visual sub-components (swappable with GSAP / Three.js)
  hooks/                # Client animation logic (useEffect, GSAP timelines)
  lib/                  # Data, types, constants, config
  styles/
    <block-name>.css    # Keyframes, layout vars, dark mode via CSS vars
```

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

## Adding or editing a template

Templates are full standalone Next.js apps under `registry/new-york/templates/`,
structurally different from the single-component blocks above — see
[`.cursor/rules/registry-templates.mdc`](./.cursor/rules/registry-templates.mdc)
for the full folder-shape and self-containment rules. If your template
accepts inbound requests (a webhook, an API route), see that file's
"Backend-integrated templates" section for the verification and
test-coverage requirements.

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

## Style conventions

- Use Next.js `<Link href="#">` instead of raw `<a>` tags for links inside blocks.
- Never hardcode white/black or raw opacity colors in a block. Use theme tokens
  (`text-foreground`, `text-muted-foreground`, `border-border`, etc.) so blocks work in
  both light and dark mode.
- Block images stay `unoptimized` in `next/image` (consumers installing via the CLI won't
  have `remotePatterns` configured) — right-size assets to ~1600px / ~250KB instead;
  never commit camera-resolution originals.

## Reporting bugs / requesting features

Use the issue templates — they collect the information needed to reproduce a bug or
evaluate a feature request. For anything security-related, do not open a public issue;
see [SECURITY.md](./SECURITY.md) if present, or contact the maintainer directly.

## License

By contributing, you agree that your contributions will be licensed under the project's
[MIT License](./LICENSE).
