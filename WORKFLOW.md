# Pre-Push Workflow

Run these in order before pushing to GitHub / deploying to Vercel.

```bash
pnpm registry:build   # rebuild /r/*.json from registry.json
pnpm test:run         # catch all registry config issues
pnpm typecheck        # catch TypeScript errors
pnpm build            # final sanity check before Vercel
```

If all four pass, a user running:

```bash
npx shadcn@latest add "@uiception/<block>"
```

will get all the right files, dependencies, and assets installed correctly.

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
- [ ] Imports use `./` siblings; cross-block imports use `../<other-block>/` and list the other block in `registryDependencies`
- [ ] `registry.json` `path` and `target` are flat (e.g. `app/<block-name>/config.ts`, not `app/<block-name>/lib/config.ts`)
- [ ] Raster images go in `public/images/blocks/<block-name>/`; video in `public/videos/blocks/<block-name>/` (see `registry-block-media.mdc`)
- [ ] Block code uses `/images/blocks/...` and `/videos/blocks/...` only (no CDN URLs)
- [ ] Block `files` includes every referenced image/video as `registry:file` with matching `path` and `target`
- [ ] All files declared in `registry.json` under the block's `files` array
- [ ] All shadcn components declared in `registryDependencies`
- [ ] All SVGs declared in `files`
- [ ] All third-party npm packages declared in `dependencies`
- [ ] CSS imports declared in `files`
- [ ] Run `pnpm registry:build` after updating `registry.json`
