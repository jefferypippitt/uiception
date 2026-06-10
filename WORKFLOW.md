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

## When adding block images

Run before `pnpm check` any time you drop new images into `public/images/blocks/`:

```bash
pnpm images:compress    # resize to max 1600px, compress JPEGs + PNGs in-place
```

Skips files already under 200KB. Target is ~250KB per image — never commit camera-res originals.

## When adding block videos

Run before `pnpm check` any time you drop new videos into `public/videos/blocks/`:

```bash
pnpm videos:compress    # scale to max 1280px, 30fps, H.264 capped at 1500kbps, no audio
```

Skips files already under 2MB. Requires `ffmpeg` installed on your machine (`winget install ffmpeg`).
