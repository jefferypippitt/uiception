# Pre-Push Workflow

Run these in order before pushing to GitHub / deploying to Vercel.

```bash
pnpm registry:validate  # shadcn registry validate (source registry + include)
pnpm registry:build     # rebuild /r/*.json from registry.json (+ post-registry-build for media)
pnpm test:run           # catch all registry config issues
pnpm typecheck          # catch TypeScript errors
pnpm build              # final sanity check before Vercel
```

If all five pass, a user running:

```bash
npx shadcn@latest add "https://uiception.com/r/<block>.json"
node path/to/uiception/scripts/sync-block-media.mjs <block>
node path/to/uiception/scripts/sync-block-media.mjs --all   # every folder under app/
```

will get code, dependencies, and **images/videos** installed correctly.

> **Media:** The shadcn CLI writes `registry:file` text as UTF-8, which corrupts PNG/MP4 bytes. Built manifests omit binary `content` and set `meta.installUrl` instead. Consumers must run `sync-block-media.mjs` once after `shadcn add` (assets are served from `https://uiception.com/images/blocks/...` and `/videos/blocks/...`).

---

## Registry layout

- All block items live in root [`registry.json`](registry.json) (`items[]` with repo-root `path` values).
- Shared SVG `target` values use `@ui/svgs/...` (shadcn 4.7+ target aliases). Block-owned files target `app/<block-name>/...`.
- `include` splits are not used here: shadcn validate requires chunk-local paths without `..`, which conflicts with shared `components/ui/svgs` and `public/` assets bundled into blocks.

---

## What the tests catch

| Risk | Test |
|---|---|
| File listed in registry doesn't exist on disk | `registry-blocks` |
| Duplicate install targets | `registry-blocks` |
| Image or video in wrong folder / missing from registry | `registry-block-media` |
| Broken `@/` or relative imports | `registry-imports` |
| shadcn component not declared in `registryDependencies` | `registry-shadcn-deps` |
| SVG not declared in `files` | `registry-svg-deps` |
| npm package missing from `dependencies` | `registry-npm-deps` |
| Block importing from another block (not self-contained) | `registry-cross-block` |
| CSS import not declared in `files` | `registry-file-deps` |
| Wrong `target` path for block files | `registry-target-paths` |

## What still needs manual verification

- **Visual/layout** — check the block looks correct in `pnpm dev` before pushing
- **Runtime errors** — the tests are static analysis, they won't catch render crashes
- **`NEXT_PUBLIC_UICEPTION_IMAGES`** — must only be set in Vercel env vars, never in local `.env`

## Adding a new block checklist

- [ ] Block uses **flat** layout: `registry/new-york/blocks/<block-name>/` with all `.tsx`, `.ts`, and `.css` at the block root (no `components/`, `hooks/`, `lib/`, or `styles/` subfolders)
- [ ] Add the block item to [`registry.json`](registry.json) `items[]`
- [ ] Imports use `./` siblings; cross-block imports use `../<other-block>/` and list the other block in `registryDependencies`
- [ ] `registry.json` `path` and `target` are flat (e.g. `app/<block-name>/config.ts`, not `app/<block-name>/lib/config.ts`)
- [ ] Shared SVGs: `path` = `components/ui/svgs/...`, `target` = `@ui/svgs/...`
- [ ] Raster images go in `public/images/blocks/<block-name>/`; video in `public/videos/blocks/<block-name>/` (see `registry-block-media.mdc`)
- [ ] Block code uses `/images/blocks/...` and `/videos/blocks/...` only (no CDN URLs)
- [ ] Block `files` includes every referenced image/video as `registry:file` with matching `path` and `target`
- [ ] All shadcn components declared in `registryDependencies`
- [ ] All SVGs declared in `files`
- [ ] All third-party npm packages declared in `dependencies`
- [ ] CSS imports declared in `files`
- [ ] Run `pnpm registry:validate` then `pnpm registry:build` after registry changes
