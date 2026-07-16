# Plan 015: Bring oversized gallery block images within the compression budget

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 059f954..HEAD -- public/images/blocks/gallery-section-v1 public/images/blocks/gallery-section-v3 scripts/compress-images.mjs`
> If any of these changed since this plan was written, re-run the `ls -la`
> commands in "Current state" yourself before proceeding — the file list or
> sizes below may be stale.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: performance
- **Planned at**: commit `059f954`, 2026-07-15

## Why this matters

`WORKFLOW.md` documents a compression budget for block preview images
(~250KB target, script at `scripts/compress-images.mjs` skips anything
already under 200KB) established by a prior round specifically so visitors
previewing blocks don't download oversized assets. Commit `d54ef0e`
("gallery section block added", 2026-07-14) added a brand-new block,
`gallery-section-v3`, whose `image-2.jpg` ships at 306KB — over budget from
day one — and the same commit also carried forward four pre-existing
`gallery-section-v1` images that were already over budget without bringing
them into compliance. The fix is entirely mechanical: the compression script
already exists and handles exactly this case; it just wasn't run against
these files before they were committed.

## Current state

Verified file sizes (via `ls -la`), all `.jpg`, all over the 200KB
skip-threshold in `scripts/compress-images.mjs`:

| File | Size |
|---|---|
| `public/images/blocks/gallery-section-v3/image-2.jpg` | 306,132 bytes |
| `public/images/blocks/gallery-section-v1/image-10.jpg` | 395,980 bytes |
| `public/images/blocks/gallery-section-v1/image-2.jpg` | 316,753 bytes |
| `public/images/blocks/gallery-section-v1/image-6.jpg` | 315,981 bytes |
| `public/images/blocks/gallery-section-v1/image-9.jpg` | 319,790 bytes |

`gallery-section-v2` mirrors some of `gallery-section-v1`'s images — check
during Step 1 whether any of its files are also over budget; if so, they'll
be caught and compressed automatically by the same script run (the script
scans the entire `public/images/blocks/` tree, not a fixed file list).

`scripts/compress-images.mjs` (relevant logic, unchanged by this plan):

```js
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1600;
const SKIP_BELOW_KB = 200; // don't reprocess already-small files
...
if (before < SKIP_BELOW_KB * 1024) return;
...
if (ext === ".png") {
  output = await image.png({ compressionLevel: 9, effort: 10 }).toBuffer();
} else {
  output = await image.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
}
if (output.length >= before) return; // skip if not smaller
await writeFile(filePath, output);
```

The script resizes to max 1600×1600 (with `fit: "inside"`, so it won't
upscale or distort), re-encodes JPEGs at quality 82 with mozjpeg, and only
writes the result if it's actually smaller than the original. It scans
`public/images/blocks/` recursively — no per-file arguments needed.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Compress | `pnpm images:compress` | prints one line per file it compresses, ending `Done. N file(s) compressed.` |
| Registry validate | `pnpm registry:validate` | exit 0 |
| Full check | `pnpm check` | exit 0 |

## Scope

**In scope**:
- Running `pnpm images:compress` (which may touch any file under `public/images/blocks/**` that's currently over the 200KB threshold — not just the 5 listed above; that's expected and correct, not scope creep).

**Out of scope**:
- `scripts/compress-images.mjs` itself — do not edit the script's thresholds or quality settings; this plan uses the existing budget as-is.
- Any video files (`public/videos/blocks/**`) — separate script, separate prior investigation (see `plans/004-media-compression-budget.md` Part 2), not part of this plan.
- Any block source code (`registry/new-york/blocks/gallery-section-v*/**`) — this plan only touches committed image binaries.
- Adding a CI/pre-commit gate to enforce the budget automatically going forward — a real idea (raised during the audit that found this), but a separate, larger-scope change; not part of this plan.

## Git workflow

- Branch: `advisor/015-recompress-oversized-gallery-images`
- Single commit, conventional-commit style matching repo history, e.g.:
  `perf(gallery): recompress oversized preview images`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Run the compression script

```bash
pnpm images:compress
```

**Verify**: output includes a line for each of the 5 files listed in
"Current state" (and possibly others found over-budget elsewhere in the
tree — that's fine), each showing a before → after size with the "after"
size smaller than "before". Confirm the 5 target files specifically appear
in the output.

### Step 2: Confirm sizes are now within budget

```bash
ls -la public/images/blocks/gallery-section-v3/image-2.jpg public/images/blocks/gallery-section-v1/image-10.jpg public/images/blocks/gallery-section-v1/image-2.jpg public/images/blocks/gallery-section-v1/image-6.jpg public/images/blocks/gallery-section-v1/image-9.jpg
```

**Verify**: all 5 files are now under ~260KB (the script's quality-82
re-encode won't hit exactly 250KB every time — anything meaningfully closer
to the ~250KB target than the original 300-400KB range is a pass; the
script does not guarantee an exact ceiling, only "smaller than input, capped
at 1600px").

### Step 3: Visual spot-check

Open 2-3 of the recompressed files directly (e.g. in a browser or image
viewer) and confirm no visible quality degradation, banding, or corruption —
mozjpeg quality 82 at this resolution should be visually lossless for photo
content, but confirm rather than assume.

### Step 4: Registry validate and full check

```bash
pnpm registry:validate
pnpm check
```

**Verify**: both exit 0. Recompressing images in place doesn't change
filenames or registry manifest entries, so no registry/test changes are
expected as a side effect.

## Test plan

No new automated tests — this is a binary-asset change with an existing
mechanical verification path (the script's own before/after size reporting,
plus the manual visual spot-check in Step 3). `pnpm test:run` (part of
`pnpm check`) must still pass as a regression guard for anything that
happens to assert on these files' existence/paths (none currently do, per
`tests/registry/*.test.ts`, but confirm via Step 4).

## Done criteria

- [ ] All 5 files listed in "Current state" are smaller than their original size and closer to the ~250KB budget
- [ ] Visual spot-check in Step 3 shows no perceptible quality loss
- [ ] `pnpm registry:validate` exits 0
- [ ] `pnpm check` exits 0
- [ ] Only files under `public/images/blocks/**` were modified (`git status`) — no source/config files touched
- [ ] `plans/README.md` status row updated

## STOP conditions

- Any of the 5 target files no longer exists or has a materially different size than listed in "Current state" (drifted since this plan was written) — re-verify with `ls -la` before proceeding; if the file is already under budget, skip it and note that in your completion report rather than treating it as a failure.
- The compression script reports an error (e.g. corrupt image, unreadable file) for any target file — do not attempt to hand-fix the image; report the exact error.
- The visual spot-check in Step 3 shows visible quality degradation — do not ship a visibly-degraded image; report it rather than lowering the quality further or working around it.

## Maintenance notes

- This is the second time (per prior audit context) an oversized image has
  landed in `public/images/blocks/` after the compression budget was
  established — the script isn't part of any automated gate, only a manual
  step in `WORKFLOW.md` ("run before `pnpm check` any time you drop new
  images into `public/images/blocks/`"). Whoever picks up the "add a
  CI/pre-commit size gate" idea noted in "Out of scope" above should link
  back to this plan and to `plans/004-media-compression-budget.md` as the
  two prior instances motivating it.
