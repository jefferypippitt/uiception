# Plan 003: Honor `prefers-reduced-motion` in `hero-section-v2` and `how-it-works-section-v2`

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 8c219d4..HEAD -- registry/new-york/blocks/hero-section-v2 registry/new-york/blocks/how-it-works-section-v2`
> If either block folder changed since this plan was written, compare the
> "Current state" excerpts below against the live files before proceeding;
> on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug (accessibility + correctness)
- **Planned at**: commit `8c219d4`, 2026-07-09

## Why this matters

`prefers-reduced-motion: reduce` is an OS-level accessibility setting for
users with vestibular disorders or motion sensitivity; browsers expose it via
`window.matchMedia`. Seven-plus other GSAP-animated blocks in this registry
(`hero-section-v4`, `hero-section-v6`, `hero-section-v7`,
`hero-section-v10`, `feature-section-v10`, `brands-section-v5`) already check
this setting and skip or shortcut their entrance animation when it's set —
this is the established, repo-wide pattern. Two blocks never picked it up:
`hero-section-v2` and `how-it-works-section-v2` run their full GSAP timeline
unconditionally on every mount, regardless of the user's OS setting. Since
these are shadcn-CLI-installable blocks, anyone who copies either of these
two versions into their own project ships the same accessibility gap
downstream.

Separately, `hero-section-v2`'s animation hook has a non-null assertion
(`titleRef.current!`) that the other three refs in the same hook don't use —
low risk today (the effect runs post-mount so the ref is populated), but an
inconsistency worth cleaning up while touching this file.

## Current state

### `registry/new-york/blocks/hero-section-v2/hooks/use-hero-animation.ts` (full file, 52 lines)

```ts
import { useEffect, useRef } from "react"
import gsap from "gsap"

export function useHeroAnimation() {
  const titleRef  = useRef<HTMLHeadingElement>(null)
  const descRef   = useRef<HTMLParagraphElement>(null)
  const streamRef = useRef<HTMLDivElement>(null)
  const brandsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

      tl.to(titleRef.current!.querySelectorAll(".word"), {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.07,
      })

      .to(descRef.current, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.9,
        ease: "power3.out",
      }, "-=0.45")

      .to(streamRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotationX: 0,
        transformPerspective: 1000,
        transformOrigin: "50% 0%",
        duration: 1.1,
        ease: "expo.out",
      }, "<0.1")

      .to(brandsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      }, "-=0.5")
    })

    return () => ctx.revert()
  }, [])

  return { titleRef, descRef, streamRef, brandsRef }
}
```

The elements this hook animates start visually hidden via inline/className
styles in `hero-content.tsx` (opacity 0 etc., set outside this hook) — when
`prefers-reduced-motion` is set, they must be snapped to their *end* state
(opacity 1, no transform) instead of animated there, otherwise a reduced-motion
user sees permanently-hidden content.

### `registry/new-york/blocks/how-it-works-section-v2/hooks/use-hiw2-v2-animations.ts` (full file, 92 lines)

```ts
"use client"

import { type RefObject, useLayoutEffect, useRef } from "react"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export type Hiw2V2Refs = {
  title: RefObject<HTMLElement | null>
  cards: RefObject<(HTMLDivElement | null)[]>
}

export function useHiw2V2Animations(refs: Hiw2V2Refs) {
  const refsRef = useRef(refs)
  useLayoutEffect(() => {
    refsRef.current = refs
  })

  useLayoutEffect(() => {
    let ctx: gsap.Context | null = null
    const r = () => refsRef.current

    const cardEls = (r().cards.current ?? []).filter(Boolean) as HTMLElement[]
    if (!cardEls.length) return

    ctx = gsap.context(() => {
      const titleEl = r().title.current

      if (titleEl) {
        gsap.set(titleEl, { y: 28, opacity: 0 })
        gsap.to(titleEl, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleEl,
            start: "top 88%",
            once: true,
          },
        })
      }

      cardEls.forEach((card) => {
        gsap.set(card, { y: 20, opacity: 0 })
        gsap.to(card, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 84%",
            once: true,
          },
        })
      })

      cardEls.forEach((card, i) => {
        const features = Array.from(
          card.querySelectorAll<HTMLElement>("[data-hiw2-feature]")
        )
        if (!features.length) return

        gsap.set(features, { x: -12, opacity: 0 })
        gsap.to(features, {
          x: 0,
          opacity: 1,
          stagger: 0.075,
          duration: 0.44,
          ease: "power2.out",
          delay: 0.2 + i * 0.08,
          scrollTrigger: {
            trigger: card,
            start: "top 84%",
            once: true,
          },
        })
      })

      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    })

    return () => {
      ctx?.revert()
    }
  }, [])
}
```

### The exemplar pattern to follow: `registry/new-york/blocks/hero-section-v4/components/hero-v4-root.tsx:16-28`

```tsx
useLayoutEffect(() => {
  const root = copyRootRef.current
  if (!root) return

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(
      root.querySelectorAll("[data-hero-v4-reveal], [data-hero-v4-word]"),
      {
        clearProps: "all",
      }
    )
    return
  }

  const ctx = gsap.context(() => {
    // ...timeline...
  }, root)

  return () => ctx.revert()
}, [])
```

The pattern is: check `window.matchMedia("(prefers-reduced-motion: reduce)").matches`
**inside** the effect (not as a hook — registry blocks must stay
self-contained per the shadcn-CLI copy-paste model; do not import
`hooks/use-prefers-reduced-motion.ts` from the repo root into a registry
block — confirmed via `grep -rl "use-prefers-reduced-motion" registry/`
returning no matches today, i.e. no registry block depends on that shared
hook, and this plan should not be the first to introduce that dependency).
When the media query matches, use `gsap.set(...)` to snap directly to the
animation's end state instead of running `gsap.to`/timeline animations.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `pnpm typecheck` | exit 0, no errors |
| Full check | `pnpm check` | exit 0 |
| Dev server (manual verification) | `pnpm dev` | starts on localhost:3000 |

## Scope

**In scope**:
- `registry/new-york/blocks/hero-section-v2/hooks/use-hero-animation.ts`
- `registry/new-york/blocks/how-it-works-section-v2/hooks/use-hiw2-v2-animations.ts`

**Out of scope**:
- Any other registry block. Do not "fix" the pattern repo-wide in this plan — the other GSAP blocks already handle this correctly; touching them risks introducing a regression in code that isn't broken.
- `hero-content.tsx` or `step-card.tsx`/`steps-grid.tsx` (the components consuming these hooks) — the fix belongs entirely inside the two hook files; the elements' initial (pre-animation) styling should already be compatible with a `gsap.set(..., { clearProps: "all" })`-style end-state snap.
- Do not add `hooks/use-prefers-reduced-motion.ts` as a dependency of these registry blocks (see "Current state" note above on why — it would break the copy-paste-installable model unless separately wired into `registryDependencies`, which is out of scope here).

## Git workflow

- Branch: `advisor/003-fix-reduced-motion-gap`
- Single commit, conventional-commit style, e.g.:
  `fix(registry): honor prefers-reduced-motion in hero-section-v2 and how-it-works-section-v2`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Fix `use-hero-animation.ts`

Rewrite the hook to check the media query before building the timeline, and
fix the non-null assertion on `titleRef.current` while you're in the file
(guard it the same way the other three refs are already implicitly guarded —
GSAP's `.to()` silently no-ops on `null`/undefined targets, so simply drop
the `!` and let GSAP handle it exactly like `descRef.current`/`streamRef.current`/`brandsRef.current` are already handled):

```ts
import { useEffect, useRef } from "react"
import gsap from "gsap"

export function useHeroAnimation() {
  const titleRef  = useRef<HTMLHeadingElement>(null)
  const descRef   = useRef<HTMLParagraphElement>(null)
  const streamRef = useRef<HTMLDivElement>(null)
  const brandsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const targets = [
      titleRef.current?.querySelectorAll(".word"),
      descRef.current,
      streamRef.current,
      brandsRef.current,
    ].filter(Boolean)

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(targets, { clearProps: "all" })
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

      tl.to(titleRef.current?.querySelectorAll(".word") ?? [], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.07,
      })

      .to(descRef.current, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.9,
        ease: "power3.out",
      }, "-=0.45")

      .to(streamRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotationX: 0,
        transformPerspective: 1000,
        transformOrigin: "50% 0%",
        duration: 1.1,
        ease: "expo.out",
      }, "<0.1")

      .to(brandsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      }, "-=0.5")
    })

    return () => ctx.revert()
  }, [])

  return { titleRef, descRef, streamRef, brandsRef }
}
```

Note: `targets` is only used for the reduced-motion branch's `gsap.set`;
`.filter(Boolean)` drops any `null`/`undefined` entries so `gsap.set` doesn't
choke on them. Confirm this compiles — GSAP's typings accept
`gsap.TweenTarget` which includes arrays of elements/NodeLists.

**Verify**: `pnpm typecheck` → exit 0.

### Step 2: Fix `use-hiw2-v2-animations.ts`

Add the same guard at the top of the second `useLayoutEffect`, before the
`gsap.context` call, snapping title + cards + features to their end state
when reduced motion is preferred:

```ts
useLayoutEffect(() => {
  let ctx: gsap.Context | null = null
  const r = () => refsRef.current

  const cardEls = (r().cards.current ?? []).filter(Boolean) as HTMLElement[]
  if (!cardEls.length) return

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const titleEl = r().title.current
    const allFeatures = cardEls.flatMap((card) =>
      Array.from(card.querySelectorAll<HTMLElement>("[data-hiw2-feature]"))
    )
    gsap.set([titleEl, ...cardEls, ...allFeatures].filter(Boolean), {
      clearProps: "all",
    })
    return
  }

  ctx = gsap.context(() => {
    // ...existing timeline unchanged...
  })

  return () => {
    ctx?.revert()
  }
}, [])
```

Keep the existing `gsap.context(...)` body (the title/cards/features
animation timeline) completely unchanged inside the non-reduced-motion
branch — only the early-return guard and its `gsap.set` clearProps snap are
new.

**Verify**: `pnpm typecheck` → exit 0.

### Step 3: Full check

```bash
pnpm check
```

**Verify**: exit 0. This runs `registry:validate` (confirms `registry.json`
still matches the block folders — you haven't changed file structure, only
file contents, so this should be unaffected), `test:run`, and `typecheck`.

### Step 4: Manual verification

```bash
pnpm dev
```

In a Chromium-based browser, open DevTools → Rendering tab → "Emulate CSS
media feature prefers-reduced-motion" → set to "reduce". Visit
`/view/hero-section-v2` and `/view/how-it-works-section-v2` (paths under
`app/(preview)/view/[versionId]`, confirm the exact versionId strings via
`lib/blocks.ts` if these don't resolve directly). Confirm content appears
fully visible immediately with no animation, instead of animating in or
appearing invisible. Then remove the emulation and reload — confirm the
original animations still play normally with the setting off.

## Test plan

This repo has no component-render test infrastructure (confirmed during the
audit — `tests/registry/*.test.ts` only validates registry metadata, not
rendering behavior; see Plan 013 candidate "no render-level testing" noted
in the audit, not part of this plan). No new automated test is added here;
verification is the manual DevTools check in Step 4. Do not attempt to add a
jsdom render test for this as part of this plan — that's a larger,
separately-scoped effort (it was flagged in the audit as its own item and
intentionally not selected for a plan).

## Done criteria

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm check` exits 0
- [ ] Manual DevTools check confirms both blocks skip animation and show full content when `prefers-reduced-motion: reduce` is emulated
- [ ] Manual DevTools check confirms both blocks animate normally when the emulation is removed
- [ ] `titleRef.current!` non-null assertion no longer appears in `use-hero-animation.ts` (`grep -n "!\." registry/new-york/blocks/hero-section-v2/hooks/use-hero-animation.ts` returns no matches, or only matches unrelated to `titleRef`)
- [ ] No files outside the two in-scope hook files modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- If `hero-content.tsx` or `step-card.tsx`/`steps-grid.tsx` render elements
  with initial styles that aren't compatible with a `clearProps: "all"` snap
  (e.g. they rely on GSAP-set inline styles rather than className toggles for
  their hidden state, and clearing all props would reveal unstyled/broken
  layout) — stop and report instead of modifying those component files to
  compensate; that would expand this plan's scope.
- If GSAP's TypeScript types reject the `targets` array construction in Step
  1 — do not add `as any`; report the type error and the GSAP version in use
  (`gsap` version pinned in `package.json`).
- If `pnpm check`'s `registry:validate` step fails after these changes — this
  would indicate the edit unexpectedly changed the file's declared exports or
  broke something `shadcn registry validate` checks; report the exact error
  rather than guessing a fix.

## Maintenance notes

- Any future GSAP-animated registry block should follow this same
  reduced-motion pattern from the start — `hero-section-v4`'s
  `hero-v4-root.tsx:16-28` is the reference implementation and is not
  affected by this plan.
- If the repo ever moves to a shared, dependency-declared reduced-motion hook
  for registry blocks (rather than each block inlining the `matchMedia`
  check), that would be a separate, larger change affecting every GSAP block,
  not just these two — out of scope here.
