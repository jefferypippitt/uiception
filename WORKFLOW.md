# Pre-Push Workflow

Run these in order before pushing to GitHub / deploying to Vercel.

```bash
pnpm check              # registry:validate + test:run + typecheck
pnpm build              # prebuild runs registry:build, then next build (same as Vercel)
```

Or step by step:

```bash
pnpm registry:validate
pnpm registry:build     # only needed if you skip `pnpm build`
pnpm test:run
pnpm typecheck
pnpm build
```

If all five pass, a user running:

```bash
npx shadcn@latest add "https://uiception.com/r/<block>.json"
```


---

## Registry layout

- All block items live in root [`registry.json`](registry.json) (`items[]` with repo-root `path` values).
- Shared SVG `target` values use `@ui/svgs/...` (shadcn 4.7+ target aliases). Block-owned files target `app/<block-name>/...`.
- `include` splits are not used here: shadcn validate requires chunk-local paths without `..`, which conflicts with shared `components/ui/svgs` and `public/` assets bundled into blocks.

---

## What the tests catch

All registry-related tests live in [`tests/registry/`](tests/registry/) (including `ensure-uiception-block-media`).

| Risk | Test |
|---|---|
| File listed in registry doesn't exist on disk | `registry-blocks` |
| Duplicate install targets | `registry-blocks` |
| Bundled media: wrong path, missing registry entry, missing on disk, bad built manifest, missing ensure helper | `registry-block-media` |
| `ensureUiceptionBlockMedia` download behavior | `ensure-uiception-block-media` (under `tests/registry/`) |
| Broken `@/` or relative imports | `registry-imports` |
| shadcn component not declared in `registryDependencies` | `registry-shadcn-deps` |
| SVG not declared in `files` | `registry-svg-deps` |
| npm package missing from `dependencies` | `registry-npm-deps` |
| Block importing from another block (not self-contained) | `registry-cross-block` |
| CSS import not declared in `files` | `registry-file-deps` |
| Wrong `target` path for block files | `registry-target-paths` |


## Adding a new block checklist

- [ ] Block uses **flat** layout: `registry/new-york/blocks/<block-name>/` with all `.tsx`, `.ts`, and `.css` at the block root (no `components/`, `hooks/`, `lib/`, or `styles/` subfolders)
- [ ] Add the block item to [`registry.json`](registry.json) `items[]`
- [ ] Imports use `./` siblings; cross-block imports use `../<other-block>/` and list the other block in `registryDependencies`
- [ ] `registry.json` `path` and `target` are flat (e.g. `app/<block-name>/config.ts`, not `app/<block-name>/lib/config.ts`)
- [ ] Shared SVGs: `path` = `components/ui/svgs/...`, `target` = `@ui/svgs/...`
- [ ] Raster images go in `public/images/blocks/<block-name>/`; video in `public/videos/blocks/<block-name>/` (see `registry-block-media.mdc`)
- [ ] Block code uses `/images/blocks/...` and `/videos/blocks/...` only (no CDN URLs)
- [ ] Block `files` includes every referenced image/video as `registry:file` with matching `path` and `target`
- [ ] `registryDependencies` includes `https://uiception.com/r/ensure-uiception-block-media.json`; server export or `page.tsx` calls `ensureUiceptionBlockMedia("<block-id>")`
- [ ] All shadcn components declared in `registryDependencies`
- [ ] All SVGs declared in `files`
- [ ] All third-party npm packages declared in `dependencies`
- [ ] CSS imports declared in `files`
- [ ] Run `pnpm registry:validate` then `pnpm registry:build` after registry changes
