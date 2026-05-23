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
