# Plan 005: Lazy-load block preview iframes on category pages

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 8c219d4..HEAD -- components/block-preview-toolbar.tsx`
> If this file changed since this plan was written, compare the excerpt
> below against the live file before proceeding; on a mismatch, treat it as
> a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: performance
- **Planned at**: commit `8c219d4`, 2026-07-09

## Why this matters

`app/(site)/blocks/[category]/page.tsx:66-79` renders a `<BlockPreviewToolbar>`
for every version in a category, unconditionally — no pagination, no
virtualization. Each toolbar mounts an `<iframe>` (`components/block-preview-toolbar.tsx:493-502`)
whose `src` is set immediately on render, with no `loading` attribute. For
categories with 10 versions (`hero-section`, `feature-section`,
`navbar-section` — confirmed via `lib/blocks.ts`), visiting e.g.
`/blocks/hero-section` mounts 10 same-origin iframes at once on initial
page load. Each iframe boots its own full Next.js page — its own React tree,
GSAP timelines/`ScrollTrigger`s, any images/videos on that block — even
though only the first 1-2 are likely visible in the viewport. This is a
straightforward main-thread and network-request win: browsers natively defer
loading an iframe's `src` until it's near the viewport when
`loading="lazy"` is set, with no other code change required.

## Current state

### `components/block-preview-toolbar.tsx:488-502` (the iframe, full surrounding block)

```tsx
{!iframeLoaded && (
  <div className="absolute inset-0 flex items-center justify-center rounded-lg border border-border/80 bg-muted/20">
    <Spinner className="size-5 text-muted-foreground" />
  </div>
)}
<iframe
  key={iframeKey}
  src={previewPath}
  title={displayTitle}
  ref={iframeRef}
  className={cn(
    "block h-full w-full rounded-lg border border-border/80 bg-background shadow-sm",
    !iframeLoaded && "invisible"
  )}
/>
```

- `previewPath` is computed at `block-preview-toolbar.tsx:308`: `` `/view/${versionId}` `` — this renders the block full-page under `app/(preview)/view/[versionId]/page.tsx`.
- `iframeKey`/`loadedKey` (state declared at `block-preview-toolbar.tsx:293-296`) drive a manual "hard refresh" affordance elsewhere in the toolbar (a refresh button bumps `iframeKey`, which changes the `key` prop and remounts the iframe) — this plan does not touch that mechanism, only adds the `loading` attribute.
- A `React.useEffect` at `block-preview-toolbar.tsx:328-354` attaches a `load` event listener to `iframeRef.current` to flip `loadedKey` once the iframe finishes loading (with a `readyState` check for the case where the load completes before the listener attaches). This logic is unaffected by deferring when the browser fetches `src` — the `load` event still fires normally once the browser does load it, whether that's immediately or after scrolling into view.
- Caller: `app/(site)/blocks/[category]/page.tsx:67-78` maps every `categoryData.versions` entry to one `<BlockPreviewToolbar>`, no windowing/pagination.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `pnpm typecheck` | exit 0 |
| Full check | `pnpm check` | exit 0 |
| Dev server (manual verification) | `pnpm dev` | starts on localhost:3000 |

## Scope

**In scope**:
- `components/block-preview-toolbar.tsx` — add `loading="lazy"` to the `<iframe>` element.

**Out of scope**:
- Do not implement an `IntersectionObserver`-based approach that withholds setting `src` entirely until near-viewport (a stronger optimization, avoiding even the initial network request being queued) — that's a larger change to the load-tracking `useEffect` (Step described in "Current state") and risks interacting badly with the existing hard-refresh (`iframeKey`) mechanism. `loading="lazy"` alone is the safe, native-browser-behavior fix this plan scopes to. If the maintainer wants the stronger version later, that's a follow-up (see "Maintenance notes").
- Do not change pagination/virtualization on the category page (`app/(site)/blocks/[category]/page.tsx`) — out of scope, bigger change, not needed once lazy-loading is in place.
- Do not touch the `app/(preview)/view/[versionId]/page.tsx` route itself.

## Git workflow

- Branch: `advisor/005-lazy-load-preview-iframes`
- Single commit, conventional-commit style, e.g.:
  `perf(block-preview): lazy-load preview iframes on category pages`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add `loading="lazy"` to the iframe

In `components/block-preview-toolbar.tsx`, change:

```tsx
<iframe
  key={iframeKey}
  src={previewPath}
  title={displayTitle}
  ref={iframeRef}
  className={cn(
    "block h-full w-full rounded-lg border border-border/80 bg-background shadow-sm",
    !iframeLoaded && "invisible"
  )}
/>
```

to:

```tsx
<iframe
  key={iframeKey}
  src={previewPath}
  title={displayTitle}
  ref={iframeRef}
  loading="lazy"
  className={cn(
    "block h-full w-full rounded-lg border border-border/80 bg-background shadow-sm",
    !iframeLoaded && "invisible"
  )}
/>
```

**Verify**: `pnpm typecheck` → exit 0 (`loading` is a standard JSX intrinsic
`iframe` attribute; no type changes needed).

### Step 2: Full check

```bash
pnpm check
```

**Verify**: exit 0.

### Step 3: Manual verification

```bash
pnpm dev
```

Open `/blocks/hero-section` (a 10-version category) in a Chromium-based
browser with DevTools open on the Network tab, filtered to `Doc`/frame
requests. Reload the page. Confirm that only the iframes near the top of the
viewport issue a network request immediately; scroll down and confirm
additional iframe requests fire as each one nears the viewport, rather than
all 10 firing at once on load. Confirm the existing loading spinner
(`!iframeLoaded` branch) still displays correctly for each iframe before it
loads, and the hard-refresh control (if present in the toolbar UI) still
works on at least one preview.

## Test plan

No new automated tests — this repo has no component-render test
infrastructure (confirmed during the audit), and `loading="lazy"` is a
declarative browser attribute with no meaningful unit-testable behavior in
this codebase's Vitest (`environment: "node"`) setup. Verification is the
manual Network-tab check in Step 3.

## Done criteria

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm check` exits 0
- [ ] Manual Network-tab check on `/blocks/hero-section` confirms iframes
      below the fold don't fetch until scrolled near
- [ ] Loading spinner and hard-refresh control still work correctly
- [ ] Only `components/block-preview-toolbar.tsx` modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- If the manual check shows no difference in iframe loading behavior (all
  iframes still fetch immediately regardless of viewport position) — this
  would mean either the browser used for verification doesn't support
  `loading="lazy"` on iframes (all modern Chromium/Firefox/Safari do; if
  testing in an unusual environment, note it) or something in the
  surrounding layout (e.g. a very tall single scroll container with no real
  offscreen content) is defeating the lazy-load heuristic. Report the
  specific browser/observation rather than adding a `data-*`-driven
  IntersectionObserver workaround, which is explicitly out of scope.

## Maintenance notes

- If a future audit finds `loading="lazy"` insufficient (e.g. because the
  category page's overall layout keeps most iframes "close enough" to the
  viewport for the browser's lazy-load heuristic to fetch them anyway), the
  stronger fix is an `IntersectionObserver`-gated `src` assignment — deferring
  setting `src` at all until the container is within some threshold of the
  viewport. That would need to coordinate with the existing `iframeKey`/
  `loadedKey`/hard-refresh mechanism in this same file and is scoped out of
  this plan intentionally.
