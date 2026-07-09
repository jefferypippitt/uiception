# uiception

Start from complete sections. Just make it yours.

A shadcn-compatible block registry — browse sections on the site, install any block with the CLI, and customize from there.

![uiception — 3D metallic geometric logo on a dark fluid background](./public/opengraph-image.png)

## Tech stack

| Layer | Tools |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI | [React 19](https://react.dev), [shadcn/ui](https://ui.shadcn.com), [Tailwind CSS v4](https://tailwindcss.com) |
| Motion | [GSAP](https://gsap.com), [Motion](https://motion.dev), Shaders |
| Fonts & icons | [Geist](https://vercel.com/font), IBM_Plex_Serif, Instrument_Serif, Phosphor, Tabler |
| Registry | shadcn CLI (`registry.json` → `/r/*.json`) |
| Language | TypeScript |
| Tests | Vitest |
| Deploy | Vercel |

## Getting started

**Prerequisites:** Node.js 20+, pnpm

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build (runs `registry:build` first) |
| `pnpm start` | Start production server |
| `pnpm check` | `registry:validate` + `test:run` + `typecheck` |
| `pnpm typecheck` | TypeScript type check (no emit) |
| `pnpm test` | Run Vitest in watch mode |
| `pnpm test:run` | Run Vitest once |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier (ts, tsx) |
| `pnpm registry:validate` | Validate `registry.json` |
| `pnpm registry:build` | Build registry → `public/r/*.json` |

## Pre-push workflow

Run in order before pushing to GitHub / deploying to Vercel:

```bash
pnpm check   # registry:validate + test:run + typecheck
pnpm build   # prebuild runs registry:build, then next build
```

## Installing blocks

```bash
npx shadcn@latest add https://uiception.com/r/<block-name>.json
```

## Block structure

Every block follows the shadcn-style layout:

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

Simple static blocks with no animation or sub-components stay as a single entry file — sub-folders are added once real complexity exists.
