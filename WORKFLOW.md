# Pre-Push Workflow

Run these in order before pushing to GitHub / deploying to Vercel.

```bash
pnpm check              # registry:validate + lint + test:run + typecheck
pnpm build              # prebuild runs registry:build, then next build (same as Vercel)
pnpm audit --prod --audit-level high   # CI runs this as its own step — check does NOT
```

Or step by step:

```bash
pnpm registry:validate
pnpm registry:build     # only needed if you skip `pnpm build`
pnpm lint
pnpm test:run
pnpm typecheck
pnpm build
pnpm audit --prod --audit-level high
```

`pnpm audit` is not part of `pnpm check` (it needs the network and the npm
advisory API is flaky from CI — that's why `ci.yml` isolates it with a retry
loop). Run it yourself before pushing. It can still pass locally and fail in
CI minutes later: new advisories are published continuously against packages
already in the lockfile, so a bump like `next` may be forced on you with no
local code change. When that happens, patch the flagged package (raise its
version or a `pnpm.overrides` entry) rather than adding it to
`auditConfig.ignoreGhsas` — the ignore list is for advisories with no fix
available.

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
