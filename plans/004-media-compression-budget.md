# Plan 004: Bring oversized block preview images within budget; investigate video budget conflict

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. This plan has two independent parts (images,
> videos) — the video part is deliberately scoped as "investigate and report"
> rather than "fix", because the advisor already confirmed the obvious fix
> (re-running the existing script) will not change anything. Read "Why this
> matters" before starting so you understand why Part 2 ends in a STOP by
> design, not by failure.
>
> **Drift check (run first)**: `git diff --stat 8c219d4..HEAD -- public/images/blocks public/videos/blocks scripts/`
> If any of these changed since this plan was written, re-run the `ls -la`/
> `ffprobe` commands in "Current state" yourself before proceeding.

## Status

- **Priority**: P2
- **Effort**: S (Part 1, images) / S (Part 2, investigation only — no code change expected)
- **Risk**: LOW
- **Depends on**: none
- **Category**: performance
- **Planned at**: commit `8c219d4`, 2026-07-09

## Why this matters

`WORKFLOW.md:20-38` documents a size budget for block preview media: images
should end up around ~250KB (script skips files already under 200KB), videos
should end up under 2MB (script skips files already under that). The budget
exists so that visitors previewing blocks on the site don't download
unnecessarily large assets. Several images currently exceed budget, and the
fix for those is mechanical — just run the existing compression script, which
was evidently never re-run after these specific images were added.

**The video case is different and needs an accurate diagnosis, not a
mechanical rerun.** The advisor verified with `ffprobe` that all 4 oversized
`.mp4` files are already at exactly the resolution (1280x720) and frame rate
(30fps) that `scripts/compress-videos.mjs` treats as "within limits" — the
script's `needsResize`/`needsFpsReduction` checks will both be `false` for
these files, so running `pnpm videos:compress` against them will print `skip
... (already within limits)` and leave the files untouched (confirmed by
reading the script's logic in "Current state" below). The files are ~6.8MB
because they are ~40.7-second clips at a bitrate (~1.34Mbps) that is already
*below* the script's own `-maxrate 1500k` target — the script doesn't
re-encode files that already satisfy its resolution/fps checks, regardless
of total size or duration. Getting these under 2MB would require either
trimming the clip to a shorter loop or lowering the bitrate below what the
script currently targets (roughly 400kbps for a 2MB/40s budget), which is a
visible-quality trade-off a script shouldn't make unilaterally. That's a
product/quality call, not a mechanical fix — hence "investigate and report"
instead of "fix" for Part 2.

Also worth confirming in Part 2: three of the four oversized videos
(`google-chrome-with-video`, `mac-studio-display-with-video`,
`macbook-pro-with-video`) are byte-identical (verified via `md5sum`). Given
these are three different "device mockup" blocks that plausibly show the
same demo screen recording inside different device chrome (browser window vs.
laptop vs. monitor), this may be **intentional asset reuse consistent with
the registry's copy-paste-installable model** (each block folder must be
self-contained, so the same demo video is duplicated into each block's
`public/videos/blocks/<block-id>/` folder on purpose) rather than accidental
duplication. Do not treat the duplication itself as a bug to fix by
deduplicating storage — confirm this in Part 2 and report it, don't "fix" it.

## Current state

### Images over the ~250KB budget (`ls -la` sizes, verified at plan time)

```
546713 public/images/blocks/feature-section-v4/image-2.png
515300 public/images/blocks/feature-section-v4/image-1.png
437206 public/images/blocks/cta-section-v1/image.png
396641 public/images/blocks/feature-section-v4/image-3.png
396129 public/images/blocks/gallery-section-v1/image-10.jpg
320703 public/images/blocks/gallery-section-v2/image-9.jpg
320703 public/images/blocks/gallery-section-v1/image-9.jpg
317582 public/images/blocks/gallery-section-v2/image-2.jpg
317582 public/images/blocks/gallery-section-v1/image-2.jpg
316080 public/images/blocks/gallery-section-v2/image-6.jpg
```
(15 files total exceed 250KB per the original audit; the 10 above are the
largest. Run `find public/images/blocks -name "*.png" -o -name "*.jpg" | xargs ls -la | awk '{print $5, $NF}' | sort -rn` yourself to get the current full list, since Plan 003/others may have landed first and this list is a point-in-time snapshot.)

### `scripts/compress-images.mjs` (full file, 69 lines) — the tool to use for images

```js
import sharp from "sharp";
import { readdir, readFile, stat, writeFile } from "fs/promises";
import { join, extname } from "path";

const BLOCK_IMAGES_DIR = "public/images/blocks";
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1600;
const SKIP_BELOW_KB = 200; // don't reprocess already-small files

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = join(dir, entry.name);
      return entry.isDirectory() ? getFiles(full) : full;
    }),
  );
  return files.flat();
}

async function compress(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) return;

  const before = (await stat(filePath)).size;
  if (before < SKIP_BELOW_KB * 1024) return;

  const input = await readFile(filePath);
  const image = sharp(input).resize(MAX_WIDTH, MAX_HEIGHT, {
    fit: "inside",
    withoutEnlargement: true,
  });

  let output;
  if (ext === ".png") {
    output = await image
      .png({ compressionLevel: 9, effort: 10 })
      .toBuffer();
  } else {
    output = await image.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  }

  if (output.length >= before) return; // skip if not smaller

  await writeFile(filePath, output);
  // ...logging...
}

// ...scans BLOCK_IMAGES_DIR and calls compress() on every file...
```

This script has no resolution-check bypass like the video script does — it
always attempts recompression on anything over 200KB and only skips writing
if the *output* isn't smaller. This is the mechanical, safe-to-rerun case.

### `scripts/compress-videos.mjs` — the resolution/fps check that makes Part 2 a no-op (lines 42-49)

```js
const { width, fps } = await probe(filePath);
const needsResize = width > MAX_WIDTH;       // MAX_WIDTH = 1280
const needsFpsReduction = fps > 30;

if (!needsResize && !needsFpsReduction) {
  console.log(`  skip  ${filePath}  (${width}px, ${fps}fps — already within limits)`);
  return;
}
```

`ffprobe` output for all 4 oversized videos confirms `width: 1280`,
`r_frame_rate: "30/1"` — both checks are `false`, so this early-return fires
and no re-encode happens, regardless of the file's total size or the
`-maxrate 1500k` target the script would otherwise apply.

### Video files and MD5 hashes (verified at plan time)

```
6826942  public/videos/blocks/google-chrome-windows-with-video/video.mp4   (md5 526588a0081a4be0d961074e96189b3f)
6828275  public/videos/blocks/google-chrome-with-video/video.mp4           (md5 fb286ba72a12287571e180332d34b190)
6828275  public/videos/blocks/mac-studio-display-with-video/video.mp4      (md5 fb286ba72a12287571e180332d34b190)
6828275  public/videos/blocks/macbook-pro-with-video/video.mp4             (md5 fb286ba72a12287571e180332d34b190)
```
The `google-chrome-with-video`, `mac-studio-display-with-video`, and
`macbook-pro-with-video` files are byte-identical. `google-chrome-windows-with-video`
is a different (but same-length, same-bitrate) recording.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Run image compression | `pnpm images:compress` | logs `before → after` per file processed; exit 0 |
| Attempt video compression | `pnpm videos:compress` | for the 4 files above, logs `skip ... (already within limits)`; exit 0 (this is the expected, correct outcome — not a failure) |
| Full check | `pnpm check` | exit 0 |

`ffmpeg`/`ffprobe` must be installed for `videos:compress` to run at all
(per `WORKFLOW.md:38`, `winget install ffmpeg` on Windows) — if unavailable in
your environment, skip running the command and note that in your report; do
not skip the investigation itself (the `ffprobe` findings above are already
supplied in this plan and don't require you to re-derive them if the tool is
unavailable).

## Scope

**In scope (Part 1 — images)**:
- Any file under `public/images/blocks/` that `pnpm images:compress` modifies.

**In scope (Part 2 — investigation only, no file changes expected)**:
- Confirming the `ffprobe` findings above still hold.
- Confirming whether the 3 identical videos are used by blocks that plausibly share demo content intentionally (read `registry/new-york/blocks/google-chrome-with-video/`, `mac-studio-display-with-video/`, `macbook-pro-with-video/` entry files to see what each renders — a device-chrome mockup around a screen recording — and confirm they're visually distinct wrappers around the same footage).

**Out of scope**:
- Do NOT modify `scripts/compress-videos.mjs`'s thresholds, `-crf`, or `-maxrate` values to force these 4 files under 2MB. Lowering bitrate enough to hit that budget for a 40-second clip is a visible quality trade-off that needs a human/design decision, not something to decide inside this plan.
- Do NOT trim/re-cut any video's duration.
- Do NOT deduplicate the 3 identical videos into a single shared file location — each registry block folder must remain independently self-contained and installable via `npx shadcn add`; a shared asset path would break that model. If the duplication should be addressed, it would be by producing 3 shorter/lighter *distinct* encodes, not by sharing one file — and that's the same "needs a human call" territory as the bitrate question above.

## Git workflow

- Branch: `advisor/004-media-compression-budget`
- Commit Part 1 (image changes) separately from your Part 2 report, e.g.:
  `perf(registry): recompress oversized block preview images`
- Part 2 produces no commit (it's a report) — write your findings into the
  status update in `plans/README.md` (see "Done criteria") instead of a code
  change.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Run image compression

```bash
pnpm images:compress
```

**Verify**: the console log shows `before → after (pct%)` lines for the files
listed in "Current state" (and possibly others found by the script's own
scan). Re-run the size check:

```bash
find public/images/blocks -name "*.png" -o -name "*.jpg" | xargs ls -la | awk '{print $5, $NF}' | sort -rn | head -15
```

Confirm the previously-listed files are now smaller. Note: the script only
writes if the recompressed output is smaller (`if (output.length >= before) return;`),
so a file might still end up somewhat above 250KB if it was already
well-optimized at its current dimensions — that's an acceptable outcome, not
a failure. Do not manually re-encode anything the script declines to shrink
further.

### Step 2: Confirm nothing else broke

```bash
pnpm check
```

**Verify**: exit 0. `registry:validate` checks that every file the registry
declares still exists on disk — recompressing in place (same filename, same
path) should not affect this.

### Step 3: Attempt video compression and confirm the expected no-op

```bash
pnpm videos:compress
```

**Verify**: for `google-chrome-with-video/video.mp4`,
`mac-studio-display-with-video/video.mp4`, `macbook-pro-with-video/video.mp4`,
and `google-chrome-windows-with-video/video.mp4`, the log line reads
`skip ... (already within limits)`. This confirms the "Why this matters"
diagnosis and is the expected result — **do not treat this as a bug in the
script to fix**, and do not proceed to manually re-encode these files
yourself (see "Scope" and "STOP conditions").

### Step 4: Confirm the intentional-reuse hypothesis for the 3 identical videos

Read the entry file for each of the three blocks sharing the identical video
(`registry/new-york/blocks/google-chrome-with-video/components/*.tsx`,
`registry/new-york/blocks/mac-studio-display-with-video/components/*.tsx`,
`registry/new-york/blocks/macbook-pro-with-video/components/*.tsx`) and
confirm each renders a visually distinct device-chrome wrapper (browser
window frame, laptop frame, monitor frame respectively) around a `<video>`
element pointing at the shared footage. Report this confirmation (or
disconfirmation, if the wrappers turn out not to be visually distinct) in
your final report.

## Test plan

No new automated tests. Verification is the manual size/log checks in Steps
1 and 3, plus `pnpm check` in Step 2.

## Done criteria

- [ ] `pnpm images:compress` has been run and the files listed in "Current
      state" are smaller than before (confirmed via `ls -la`)
- [ ] `pnpm check` exits 0 after the image changes
- [ ] `pnpm videos:compress` has been run and confirmed to skip all 4 videos
      with "already within limits" (confirming, not contradicting, the
      diagnosis in this plan)
- [ ] The 3-identical-video hypothesis (intentional reuse across distinct
      device-mockup wrappers) has been confirmed or disconfirmed by reading
      the 3 entry files
- [ ] No code/script changes made for Part 2 — only a written report
- [ ] `plans/README.md` status row updated with: image compression done;
      video budget conflict confirmed and reported to the human maintainer as
      a decision needed (trim duration vs. lower bitrate vs. accept a larger
      budget for long-form demo clips), not resolved by this plan

## STOP conditions

- If `pnpm videos:compress` behaves differently than predicted here (i.e. it
  actually re-encodes one of the 4 files) — stop and report the discrepancy;
  it would mean either `ffprobe`'s readings changed since this plan was
  written, or the script was edited. Do not proceed to "fix" whatever
  happens next without understanding why the prediction was wrong.
- If `ffmpeg`/`ffprobe` are not installed in your environment, do not install
  them yourself as a side effect of this plan unless explicitly told to —
  report that Part 2's verification (Step 3) couldn't be run and rely on the
  `ffprobe` data already supplied in "Current state" for your report.
- Under no circumstances lower `-crf`/`-maxrate` in
  `scripts/compress-videos.mjs` or manually run `ffmpeg` against these 4
  files to force them under 2MB — that's explicitly out of scope (see
  "Scope").

## Maintenance notes

- The image budget slip-through (15 files landed over budget) suggests
  `pnpm images:compress` isn't being run consistently before commits. Plan
  002 (CI) does not check media size as part of `pnpm check` — a future
  follow-up could add a `check:media-size` script that fails CI if a new
  file lands over budget, preventing this from recurring. That's out of
  scope for this plan but worth flagging to the maintainer alongside the
  video budget decision.
- Whoever decides the video budget question (trim vs. lower bitrate vs.
  raise the documented budget for long-form clips) should update
  `WORKFLOW.md:28,38` to reflect whatever the new policy is, since the
  current "~2MB" language doesn't distinguish short loops from 40-second
  demo clips.
