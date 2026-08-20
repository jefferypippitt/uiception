# Plan 025: Fix wrong-container video and oversized images in `portfolio-v3`

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat b7c12b8..HEAD -- registry/new-york/templates/portfolio-v3/lib/jon-doe.ts tests/templates/portfolio-v3/media.test.ts public/videos/templates/portfolio-v3/moments public/images/templates/portfolio-v3/moments`
> If any of these changed since this plan was written, compare the "Current
> state" excerpts below against the live files before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug / perf
- **Planned at**: commit `b7c12b8`, 2026-08-19

## Why this matters

`portfolio-v3`'s host-served demo media (the CDN-fallback assets every fresh
`npx shadcn add portfolio-v3` install sees until the consumer drops in their
own files) has two real problems, both outside this repo's asset-compression
tooling because that tooling only ever scans `public/{images,videos}/blocks/`,
never `public/{images,videos}/templates/`:

1. **`public/videos/templates/portfolio-v3/moments/ces-2025-nvidia.mkv`
   (31.6 MB) and `compile-26.mkv` (8.6 MB) are committed as `.mkv`
   (Matroska) files**, but they're referenced from `<video>` elements
   (`lifeline-lightbox.tsx`, `lifeline-inline-clip.tsx`) — and most browsers
   have poor-to-no native Matroska support in `<video>`, unlike MP4. The
   underlying streams are already H.264 video + AAC audio — a codec pair MP4
   natively supports — so this is a **container mislabeling bug**, not a
   quality/bitrate problem: the fix is a lossless remux, not a re-encode.
   Notably, the registry's own `.gitkeep` placeholders for these exact files
   already say `ces-2025-nvidia.mp4.gitkeep` / `compile-26.mp4.gitkeep` —
   the host-side assets just never matched what the registry payload always
   expected.
2. **`vercel-ship-2024.png` (680 KB) and `vercel-ship-2025.png` (397 KB) are
   photographs stored as uncompressed PNG**, well outside this repo's own
   ~250 KB image budget (`plans/004-media-compression-budget.md`,
   `WORKFLOW.md`). Converting photographic content to compressed JPEG (this
   repo's existing convention for photos, see `scripts/compress-images.mjs`)
   cuts these dramatically with no visible quality loss.

## Current state

- `registry/new-york/templates/portfolio-v3/lib/jon-doe.ts` — the demo
  timeline data. Four lines reference the affected assets by filename
  (as of `b7c12b8`):
  ```
  249:        image: "vercel-ship-2024.png",
  265:        video: "ces-2025-nvidia.mkv",
  269:        image: "vercel-ship-2025.png",
  290:        video: "compile-26.mkv",
  ```
  These strings flow straight into `resolveTemplateImage()`/
  `resolveTemplateVideo()` (`lib/media.ts`) to build the final `<img>`/
  `<video>` `src` — there is no extension-probing for this call path (that's
  only used for local-vs-CDN *resolution*, not literal filename lookup), so
  changing these four strings is both necessary and sufficient to point the
  template at the new filenames.

- The actual media files live in this repo's **host** `public/` tree (the
  local-first fallback source these templates' preview pages serve from —
  see `.cursor/rules/registry-block-media.mdc`), not under
  `registry/new-york/templates/portfolio-v3/public/` (which correctly holds
  only `.gitkeep` placeholders, per the registry contract — do not add real
  media there):
  - `public/videos/templates/portfolio-v3/moments/ces-2025-nvidia.mkv` (31.6 MB, H.264 video + AAC audio streams, confirmed via `ffprobe`)
  - `public/videos/templates/portfolio-v3/moments/compile-26.mkv` (8.6 MB, same codec pair)
  - `public/images/templates/portfolio-v3/moments/vercel-ship-2024.png` (680 KB, 1895×945)
  - `public/images/templates/portfolio-v3/moments/vercel-ship-2025.png` (397 KB, 1327×740)

- `tests/templates/portfolio-v3/media.test.ts` has hardcoded assertions
  tied to the current filenames that **must be updated in lockstep** or the
  suite will fail after Step 3:
  - Lines 41–44 (asset-existence check against the real repo tree):
    ```
    41:      "public/images/templates/portfolio-v3/moments/vercel-ship-2024.png",
    42:      "public/images/templates/portfolio-v3/moments/vercel-ship-2025.png",
    43:      "public/videos/templates/portfolio-v3/moments/ces-2025-nvidia.mkv",
    44:      "public/videos/templates/portfolio-v3/moments/compile-26.mkv",
    ```
  - Line 349 (real `getJonDoeLifeline()` output, CDN-fallback path — no
    local override in this test's tempdir, so the URL directly reflects the
    literal extension in `jon-doe.ts`):
    ```
    349:            src: "https://example.com/images/templates/portfolio-v3/moments/vercel-ship-2024.png",
    ```
  - Line 362 (same shape, for the video):
    ```
    362:            src: "https://example.com/videos/templates/portfolio-v3/moments/ces-2025-nvidia.mkv",
    ```
  - **Do not touch** any other `.png`/`.mkv` string in this file — most of
    them (e.g. lines 72–97, 202–254, 375–425, 517–595) are self-contained
    fixture tests that write their own temp files with their own filenames
    to test the resolver's generic extension-matching logic; they are
    intentionally decoupled from the real `jon-doe.ts` data and must not be
    changed.

- `scripts/compress-images.mjs` — the existing convention for compressing
  photographic PNG/JPEG content (quality 82, `mozjpeg: true`, resize to fit
  inside 1600×1600 without enlarging). This plan reuses those exact
  settings for the two images via a one-off script rather than widening
  `compress-images.mjs`'s scope — see "Out of scope" below for why.

## Commands you will need

| Purpose            | Command                                                                                   | Expected on success |
|---------------------|--------------------------------------------------------------------------------------------|----------------------|
| Install             | `pnpm install`                                                                              | exit 0               |
| ffmpeg availability | `ffmpeg -version` and `ffprobe -version`                                                    | both print a version; if either errors, see STOP conditions |
| Remux video 1       | see Step 1                                                                                  | new `.mp4` exists, same duration, video+audio streams intact |
| Remux video 2       | see Step 1                                                                                  | same as above |
| Compress images     | see Step 2 (one-off node script)                                                            | two new `.jpg` files, each smaller than their `.png` source |
| Typecheck           | `pnpm typecheck`                                                                             | exit 0, no errors    |
| Tests               | `pnpm vitest run tests/templates/portfolio-v3/media.test.ts`                                | all pass             |
| Full gate           | `pnpm check`                                                                                 | exit 0               |

## Suggested executor toolkit

- No special skill needed. `ffmpeg`/`ffprobe` must be on `PATH` — this repo
  already depends on it for `pnpm videos:compress` (see `WORKFLOW.md`), so
  it should be present in the same environment this worktree runs in. If
  not, this is a STOP condition (see below), not something to work around
  by re-encoding differently.

## Scope

**In scope** (the only files you should modify/create/delete):
- `registry/new-york/templates/portfolio-v3/lib/jon-doe.ts` (4 string edits)
- `tests/templates/portfolio-v3/media.test.ts` (3 string edits, at lines 41–44, 349, 362 only)
- `public/videos/templates/portfolio-v3/moments/ces-2025-nvidia.mp4` (create, via remux)
- `public/videos/templates/portfolio-v3/moments/compile-26.mp4` (create, via remux)
- `public/videos/templates/portfolio-v3/moments/ces-2025-nvidia.mkv` (delete, after remux verified)
- `public/videos/templates/portfolio-v3/moments/compile-26.mkv` (delete, after remux verified)
- `public/images/templates/portfolio-v3/moments/vercel-ship-2024.jpg` (create, via compression)
- `public/images/templates/portfolio-v3/moments/vercel-ship-2025.jpg` (create, via compression)
- `public/images/templates/portfolio-v3/moments/vercel-ship-2024.png` (delete, after compression verified)
- `public/images/templates/portfolio-v3/moments/vercel-ship-2025.png` (delete, after compression verified)

**Out of scope** (do NOT touch, even though they look related):
- `scripts/compress-images.mjs` / `scripts/compress-videos.mjs` — do not
  widen their directory scope to include `public/*/templates/` in this
  plan. `compress-videos.mjs` strips audio (`-an`) by design for the
  autoplay/muted background-clip blocks it was built for; blindly widening
  its scope would silently strip audio from `portfolio-v3`'s lightbox
  video, which plays with sound (`lifeline-lightbox.tsx:52`,
  `video.muted = false`). That's a product tradeoff for a human to make
  deliberately, not a side effect of this bug fix — this plan only touches
  the two specific assets named above.
- `registry/new-york/templates/portfolio-v3/public/` — the registry-payload
  `.gitkeep` placeholders. They already say `.mp4.gitkeep` / `.jpg.gitkeep`
  and need no change.
- Any other `portfolio-v3` asset not named above (e.g. `avatar.png`,
  `destinations/*.jpg` — already correctly sized/formatted per this round's
  audit).
- Any other test file besides the three specific line ranges named in
  "Current state" within `tests/templates/portfolio-v3/media.test.ts`.

## Git workflow

- Branch: `advisor/025-portfolio-v3-media-format-and-size`
- Suggested commits (or one combined commit — either is fine): one for the
  video remux + data/test updates, one for the image recompression +
  data/test updates. Message style matches this repo's convention (e.g.
  `fix(portfolio-v3): remux demo videos to mp4, recompress oversized photos`).
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 0: Confirm ffmpeg/ffprobe are available

**Verify**: `ffmpeg -version` → prints a version banner (exit 0).
`ffprobe -version` → same. If either command is not found, STOP — see STOP
conditions.

### Step 1: Remux both videos from `.mkv` to `.mp4` (lossless container change)

Run, from the repo root:

```
ffmpeg -y -i "public/videos/templates/portfolio-v3/moments/ces-2025-nvidia.mkv" -c copy -movflags +faststart "public/videos/templates/portfolio-v3/moments/ces-2025-nvidia.mp4"
ffmpeg -y -i "public/videos/templates/portfolio-v3/moments/compile-26.mkv" -c copy -movflags +faststart "public/videos/templates/portfolio-v3/moments/compile-26.mp4"
```

`-c copy` copies the existing H.264/AAC streams bit-for-bit into an MP4
container — no re-encode, no quality/audio loss, near-instant. Do not add
any scaling, bitrate, or `-an` (audio-strip) flags — those belong to
`compress-videos.mjs`'s different use case (see "Out of scope" above), not
this fix.

**Verify** (run for both new files):
```
ffprobe -v quiet -print_format json -show_streams "public/videos/templates/portfolio-v3/moments/ces-2025-nvidia.mp4"
```
→ JSON output contains one stream with `"codec_type": "video"` and
`"codec_name": "h264"`, and one stream with `"codec_type": "audio"` and
`"codec_name": "aac"`. Repeat for `compile-26.mp4`. Also confirm the new
`.mp4` file's duration matches the original `.mkv` (within rounding) via
`ffprobe -v quiet -show_entries format=duration` on both the old and new
file for each pair.

Only after both remuxes are verified, delete the two `.mkv` source files:
```
rm "public/videos/templates/portfolio-v3/moments/ces-2025-nvidia.mkv"
rm "public/videos/templates/portfolio-v3/moments/compile-26.mkv"
```

### Step 2: Recompress both images from `.png` to `.jpg`

Write and run a one-off Node script (delete it when done — it is not part
of the repo) that mirrors `scripts/compress-images.mjs`'s exact settings
(quality 82, `mozjpeg: true`, resize to fit inside 1600×1600 without
enlarging):

```js
import sharp from "sharp"
import { readFile, writeFile } from "fs/promises"

const files = [
  "public/images/templates/portfolio-v3/moments/vercel-ship-2024",
  "public/images/templates/portfolio-v3/moments/vercel-ship-2025",
]

for (const base of files) {
  const input = await readFile(base + ".png")
  const output = await sharp(input)
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()
  await writeFile(base + ".jpg", output)
  console.log(base, input.length, "->", output.length)
}
```

Run it with `node --experimental-modules <script>.mjs` (or save as `.mjs`
and run directly — this repo is `"type": "module"` per `package.json`, so
plain `.js` also works from the repo root). Confirm the logged output shows
each `.jpg` file smaller than its `.png` source.

**Verify**: both new `.jpg` files exist and are strictly smaller than their
`.png` source (`ls -la` before/after, or check the script's own logged
sizes). Then delete the two `.png` source files:
```
rm "public/images/templates/portfolio-v3/moments/vercel-ship-2024.png"
rm "public/images/templates/portfolio-v3/moments/vercel-ship-2025.png"
```
Delete the one-off compression script — it must not be committed.

### Step 3: Update `lib/jon-doe.ts` to reference the new filenames

In `registry/new-york/templates/portfolio-v3/lib/jon-doe.ts`, change:
- Line 249: `image: "vercel-ship-2024.png",` → `image: "vercel-ship-2024.jpg",`
- Line 265: `video: "ces-2025-nvidia.mkv",` → `video: "ces-2025-nvidia.mp4",`
- Line 269: `image: "vercel-ship-2025.png",` → `image: "vercel-ship-2025.jpg",`
- Line 290: `video: "compile-26.mkv",` → `video: "compile-26.mp4",`

**Verify**: `grep -n "\.png\"\|\.mkv\"" registry/new-york/templates/portfolio-v3/lib/jon-doe.ts` → no matches.

### Step 4: Update the three test assertions in lockstep

In `tests/templates/portfolio-v3/media.test.ts`:
- Lines 41–44: change the four asset paths to their new extensions (`vercel-ship-2024.jpg`, `vercel-ship-2025.jpg`, `ces-2025-nvidia.mp4`, `compile-26.mp4`).
- Line 349: `vercel-ship-2024.png` → `vercel-ship-2024.jpg`
- Line 362: `ces-2025-nvidia.mkv` → `ces-2025-nvidia.mp4`

Do not change any other line in this file (see "Current state" above for
why the other `.png`/`.mkv` occurrences are unrelated fixture tests).

**Verify**: `pnpm vitest run tests/templates/portfolio-v3/media.test.ts` → all tests pass.

### Step 5: Full verification gate

**Verify**: `pnpm typecheck` → exit 0. `pnpm check` → exit 0 (registry:validate + lint + test:run + typecheck all pass).

## Test plan

No new test file is needed — `tests/templates/portfolio-v3/media.test.ts`
already exercises this exact data path (`getJonDoeLifeline()` → resolved
`image.src`/`video.src`); Step 4 updates its existing assertions to match
the new filenames rather than adding new cases. Verification:
`pnpm vitest run tests/templates/portfolio-v3/media.test.ts` → all pass.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `public/videos/templates/portfolio-v3/moments/ces-2025-nvidia.mp4` and `compile-26.mp4` exist; the corresponding `.mkv` files do not
- [ ] `public/images/templates/portfolio-v3/moments/vercel-ship-2024.jpg` and `vercel-ship-2025.jpg` exist; the corresponding `.png` files do not
- [ ] `grep -rn "\.mkv\|\.png" registry/new-york/templates/portfolio-v3/lib/jon-doe.ts` returns no matches
- [ ] `pnpm vitest run tests/templates/portfolio-v3/media.test.ts` exits 0
- [ ] `pnpm check` exits 0
- [ ] No one-off compression script left in the working tree (`git status` shows no untracked `.mjs`/`.js` scratch file)
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row for 025 updated

## STOP conditions

Stop and report back (do not improvise) if:

- `ffmpeg`/`ffprobe` are not available on `PATH` in your environment — do
  not attempt to install them yourself; report this and stop.
- The remuxed `.mp4`'s duration or stream codecs don't match the original
  `.mkv` (would indicate a corrupt or partial remux) — do not delete the
  `.mkv` source in that case.
- `sharp` is not resolvable (e.g. `pnpm install` didn't complete, or the
  worktree's `node_modules` is missing it) — it's already a `dependency` in
  `package.json`, so this would indicate an environment problem, not a code
  problem; report and stop rather than switching image libraries.
- Any test in `media.test.ts` beyond the three lines named in Step 4 starts
  failing — that means a fixture test you were told not to touch actually
  does depend on the real files in some way this plan didn't anticipate;
  stop and describe which test and why, rather than editing more fixture
  assertions to make it pass.

## Maintenance notes

- If `portfolio-v3` (or any future template) gains more media-heavy demo
  content, the underlying gap this plan works around — the compression
  scripts only ever scanning `public/*/blocks/`, never `public/*/templates/`
  — will keep recurring. That's a deliberate scope decision for a human to
  revisit (see "Out of scope" above for why this plan doesn't fix it
  generally), not an oversight this plan should silently expand to cover.
- The `.gitkeep` placeholder files under
  `registry/new-york/templates/portfolio-v3/public/videos/moments/` and
  `.../images/moments/` already declared `.mp4`/`.jpg` as the expected
  extensions before this plan — a future contributor adding template media
  should treat a placeholder's stated extension as the contract to match,
  not just a suggestion.
