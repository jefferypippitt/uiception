# Plan 018: Gate TestimonialShader's WebGL canvas behind visibility and reduced-motion checks

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 8cdba30..HEAD -- registry/new-york/blocks/testimonials-section-v4/components/testimonial-shader.tsx registry/new-york/blocks/testimonials-section-v4/components/testimonials-carousel.tsx`
> If either file changed since this plan was written, re-read it and compare
> against the "Current state" excerpts below before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `8cdba30`, 2026-08-06

## Why this matters

`testimonials-section-v4` renders a desktop carousel
(`testimonials-carousel.tsx`) via the shared `Carousel`/embla component,
which — standard embla behavior — mounts **all** pages into the DOM at once
rather than only the visible one. With `PAGE_SIZE = 3` and ~7 seeded
testimonials (`lib/testimonials-content.ts`), that's 3 pages × up to 3 cards
= up to 6-7 `TestimonialShader` instances mounted simultaneously, each
rendering a `GrainGradient` (WebGL, via `@paper-design/shaders-react`) — and
only 1-3 of them are ever visible to the user at once. `testimonial-shader.tsx`
has no `IntersectionObserver` gating and only a CSS `display:none` fallback
for `prefers-reduced-motion` (`styles/testimonials-section-v4.css:30-33`),
which stops paint but does not stop the shader library's internal animation
loop underneath. This block renders on the site's highest-traffic surface
(the block preview grid), so every preview keeps multiple off-screen WebGL
contexts alive and animating continuously — wasted GPU/battery, and it edges
the page closer to the browser's per-tab WebGL context ceiling when other
canvas-heavy blocks (`particle-object.tsx`, `displacement.tsx`,
`templates/portfolio-v2/components/canvasui/liquid.tsx`) are also present.

`liquid.tsx` in this same repo already proves the fix pattern:
`IntersectionObserver`-gated, checks `prefers-reduced-motion`, and idles
when off-screen. This plan ports that pattern to `TestimonialShader`, which
currently has neither.

## Current state

- `registry/new-york/blocks/testimonials-section-v4/components/testimonial-shader.tsx` — the file to change (full current content, lines 1-106):

```tsx
"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { GrainGradient } from "@paper-design/shaders-react"

import type { GrainShaderTheme } from "../lib/testimonials-content"

type ShaderViewport = {
  width: number
  height: number
  dpr: number
  ready: boolean
}

const initialViewport: ShaderViewport = {
  width: 0,
  height: 0,
  dpr: 1,
  ready: false,
}

const DESIGN_FALLBACK = { width: 480, height: 720 } as const

function adaptShader(theme: GrainShaderTheme, viewport: ShaderViewport) {
  // ...unchanged, not shown here for brevity — do not modify this function...
}

export function TestimonialShader({ theme }: { theme: GrainShaderTheme }) {
  const ref = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState<ShaderViewport>(initialViewport)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width < 1 || height < 1) return
      setViewport({
        width,
        height,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        ready: true,
      })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const renderProps = viewport.ready ? adaptShader(theme, viewport) : null

  return (
    <div
      ref={ref}
      className="ts4-shader-frame"
      style={{ backgroundColor: theme.accent }}
      aria-hidden
    >
      {renderProps ? (
        <GrainGradient
          className="ts4-shader-canvas"
          colors={[...renderProps.colors]}
          colorBack={theme.accent}
          fit="cover"
          height={renderProps.height}
          intensity={renderProps.intensity}
          noise={renderProps.noise}
          {...(renderProps.scale !== undefined
            ? { scale: renderProps.scale }
            : {})}
          shape={renderProps.shape}
          softness={renderProps.softness}
          speed={renderProps.speed}
          width={renderProps.width}
        />
      ) : null}
    </div>
  )
}
```

- `styles/testimonials-section-v4.css:30-33` — existing CSS-only
  reduced-motion handling (keep this, it's still useful as a paint-level
  fallback, but it doesn't stop the shader's JS-level animation loop):

```css
@media (prefers-reduced-motion: reduce) {
  /* hides/disables ts4-shader-canvas via display:none or similar */
}
```

- **Repo convention for this exact pattern** —
  `registry/new-york/templates/portfolio-v2/components/canvasui/liquid.tsx`
  is the proven exemplar in this repo: `IntersectionObserver`-gated, checks
  `window.matchMedia("(prefers-reduced-motion: reduce)")`, and calls
  `destroy()` when off-screen. Read that file's `IntersectionObserver` setup
  for the pattern shape (do not copy code verbatim — `liquid.tsx` manages a
  raw WebGL context directly; `TestimonialShader` only needs to
  conditionally mount/unmount the `<GrainGradient>` React component, which
  is simpler).

## Commands you will need

| Purpose   | Command                              | Expected on success |
|-----------|---------------------------------------|---------------------|
| Typecheck | `pnpm typecheck`                      | exit 0, no errors   |
| Tests     | `pnpm test:run`                       | all pass            |
| Lint      | `pnpm lint`                           | exit 0              |
| Registry  | `pnpm registry:validate`              | exit 0              |

## Scope

**In scope**:
- `registry/new-york/blocks/testimonials-section-v4/components/testimonial-shader.tsx`

**Out of scope**:
- `registry/new-york/blocks/testimonials-section-v4/components/testimonials-carousel.tsx`
  — do NOT change embla's all-pages-mounted behavior; that's standard embla
  carousel behavior used elsewhere in the repo and changing it is a much
  larger, riskier change than this plan's scope. Gating the shader itself is
  sufficient and lower-risk.
- `adaptShader()` — the sizing/scale math function inside
  `testimonial-shader.tsx`. Leave it exactly as-is; only change when/whether
  `<GrainGradient>` mounts.
- `styles/testimonials-section-v4.css` — the existing CSS reduced-motion
  rule can stay as a defense-in-depth fallback; do not remove it.
- Any other block's shader/canvas usage (`particle-object.tsx`,
  `displacement.tsx`, `liquid.tsx` itself) — those were already checked this
  audit round and are correctly gated; do not modify them.

## Git workflow

- Branch: `advisor/018-testimonial-shader-visibility-gating`
- Single commit, message style: imperative, lowercase, matching repo
  convention.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add an `IntersectionObserver` and a `prefers-reduced-motion` check

Modify `TestimonialShader` to only mount `<GrainGradient>` when the card is
on-screen and the user hasn't requested reduced motion:

```tsx
"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { GrainGradient } from "@paper-design/shaders-react"

import type { GrainShaderTheme } from "../lib/testimonials-content"

// ...ShaderViewport, initialViewport, DESIGN_FALLBACK, adaptShader unchanged...

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mql.matches)
    const onChange = () => setReduced(mql.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return reduced
}

export function TestimonialShader({ theme }: { theme: GrainShaderTheme }) {
  const ref = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState<ShaderViewport>(initialViewport)
  const [isVisible, setIsVisible] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width < 1 || height < 1) return
      setViewport({
        width,
        height,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        ready: true,
      })
    }

    update()
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(el)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "200px" }
    )
    intersectionObserver.observe(el)

    return () => {
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [])

  const shouldRender = viewport.ready && isVisible && !reducedMotion
  const renderProps = shouldRender ? adaptShader(theme, viewport) : null

  return (
    <div
      ref={ref}
      className="ts4-shader-frame"
      style={{ backgroundColor: theme.accent }}
      aria-hidden
    >
      {renderProps ? (
        <GrainGradient
          className="ts4-shader-canvas"
          colors={[...renderProps.colors]}
          colorBack={theme.accent}
          fit="cover"
          height={renderProps.height}
          intensity={renderProps.intensity}
          noise={renderProps.noise}
          {...(renderProps.scale !== undefined
            ? { scale: renderProps.scale }
            : {})}
          shape={renderProps.shape}
          softness={renderProps.softness}
          speed={renderProps.speed}
          width={renderProps.width}
        />
      ) : null}
    </div>
  )
}
```

Notes on this design:
- `rootMargin: "200px"` pre-mounts the shader slightly before it scrolls
  into view, avoiding a visible pop-in. Keep this value unless you have a
  concrete reason to change it.
- The background `style={{ backgroundColor: theme.accent }}` on the wrapper
  `<div>` is unchanged and unconditional, so off-screen/reduced-motion cards
  still show their solid accent color instead of a blank box — no visual
  regression, just no animation.
- `viewport.ready` is still required in `shouldRender` — don't drop it, it
  prevents a 0×0 initial render.

**Verify**: `pnpm typecheck` → exit 0, no errors.

### Step 2: Manual/visual verification

Automated DOM-level verification of `IntersectionObserver` behavior isn't
practical in this repo's test setup (`vitest.config.ts` runs in
`environment: "node"`, no DOM/jsdom, no `IntersectionObserver` polyfill) —
adding one is out of scope for this plan. Verify instead by one of:

- **If a browser-automation tool is available**: navigate to the
  `testimonials-section-v4` block preview (find its preview URL via
  `pnpm dev` and the site's `/blocks/testimonials` category page, or the
  block's own `page.tsx` route), open DevTools, and confirm
  `document.querySelectorAll("canvas").length` drops when you scroll a
  testimonial card out of view and rises again when it scrolls back in.
- **If no browser-automation tool is available**: start `pnpm dev`,
  manually open the block preview in a real browser, scroll the carousel,
  and visually confirm cards still render their gradient background
  correctly (no blank/broken cards) both on first load and after
  scrolling. Document which method you used in your final report.

**Verify**: no regressions — every testimonial card still shows a shader
background when scrolled into view; off-screen cards show only their solid
`theme.accent` background color (expected, not a bug).

## Test plan

No new automated test file for this plan — the fix is DOM-visibility logic
that this repo's Node-environment Vitest setup cannot exercise, and adding
jsdom + an `IntersectionObserver` polyfill purely for one block is
disproportionate to this plan's S-effort scope (flag it as a candidate for
a future dedicated "add jsdom for DOM-behavior tests" plan if this pattern
recurs). Verification is the manual/visual check in Step 2 plus the
existing `pnpm typecheck`/`pnpm lint`/`pnpm registry:validate` gates, which
catch type errors and registry-declaration drift.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm test:run` exits 0 (no regressions in existing suite)
- [ ] `pnpm lint` exits 0
- [ ] `pnpm registry:validate` exits 0
- [ ] `grep -n "IntersectionObserver" registry/new-york/blocks/testimonials-section-v4/components/testimonial-shader.tsx` returns a match
- [ ] `grep -n "prefers-reduced-motion" registry/new-york/blocks/testimonials-section-v4/components/testimonial-shader.tsx` returns a match
- [ ] Manual/visual verification from Step 2 completed and documented
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The code at the cited location doesn't match the excerpt above (drift
  since this plan was written).
- `pnpm typecheck` or `pnpm lint` fails twice after a reasonable fix attempt.
- You find that removing the shader entirely for off-screen cards causes a
  visible layout shift (e.g. the wrapper `<div>` collapses) — if so, stop
  and report; the fix should be to keep the wrapper's dimensions stable
  (which the existing `style={{ backgroundColor: theme.accent }}` on the
  outer div should already guarantee, since only the inner `<GrainGradient>`
  is conditional), not to redesign the layout.

## Maintenance notes

- If a future block adds another `@paper-design/shaders-react` or raw WebGL
  canvas, follow this same `IntersectionObserver` + `prefers-reduced-motion`
  gating pattern (or the `liquid.tsx` pattern for raw WebGL) from the start
  rather than retrofitting it later.
- A reviewer should scrutinize the `rootMargin` value if performance still
  looks off after this change — a larger margin pre-mounts more shaders
  during fast scrolling, a smaller one risks visible pop-in.
- `PERF-01` (a related, larger, already-tracked finding: `block-preview-by-version.tsx`
  statically imports all ~84+ blocks, defeating tree-shaking) is a separate,
  bigger-scope issue not addressed by this plan — see `plans/README.md`'s
  Round 3 notes.
