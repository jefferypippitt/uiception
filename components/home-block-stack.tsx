"use client"

import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

import { createStackGpu, type StackGpu } from "./home-block-stack-gpu"

export type HomeStackLayer = {
  id: string
  /**
   * Real blocks the card cycles through, starter first; captures live in
   * public/images/home as `<versionId>-{light,dark}.webp`.
   */
  versions: string[]
}

/*
 * One page lies flat in isometric view, its sections laid top → bottom.
 * Every section is a slab: a top face (the block) over two shaded sides. The
 * active one lifts out, leaving a dashed recess on the floor, tethered to it
 * by a dashed bay, with a soft contact shadow below it.
 *
 * Page-local point (x, y) projects to screen as
 *   ((x + y) / √2, (y − x) / (2√2))
 * via `rotateX(60deg) rotateZ(-45deg)` with a top-left transform origin.
 */

const PAGE_W = 200
const SECTION_GAP = 8
/** Local heights, matching the aspect of each block capture. */
const SECTION_H: Record<string, number> = {
  navbar: 20,
  "hero-section": 116,
  features: 78,
  pricing: 100,
  testimonials: 76,
  cta: 60,
  footer: 64,
}
const DEFAULT_H = 72
const LIFT = 30
/** Every card is the same slab, lifted or not: one edge thickness, in screen px. */
const THICK = 10
/**
 * Autoplay runs each card through three phases:
 * 1. lift: the card rises out of its slot and holds.
 * 2. swap: it slides off to the right and fades out; its category's next block
 *    slides in from the left at the same height.
 * 3. land: the new card presses back down into the slot.
 * Then the next card goes. Durations in ms.
 */
const LIFT_MS = 500
const HOLD_MS = 450
const EXIT_MS = 380
const ENTER_MS = 460
const SETTLE_MS = 300
const LAND_MS = 500
const GAP_MS = 250
/** How far a card slides sideways on screen as it swaps, in scene px. */
const SWAP_SLIDE = 72

type Phase = "up" | "exit" | "enter" | "in" | "down"
const CANVAS_MARGIN = 56
/** The GPU field canvas reaches this far past the scene (left, top, right) so its fade never hits an edge. */
const FIELD_PAD = 160

const SCENE_W = 640
/** Default scene height before the fit runs; the real one ends under the page. */
const SCENE_H = 420
/** Upper bound for very large screens; fitScene() decides the real scale. */
const MAX_SCALE = 2.6
/** Clearance between the page's top edge and anything it tucks under. */
const FIT_PAD = 20
/** Closest a card may come to the viewport edge, even mid-swap, in screen px. */
const VIEW_GUTTER = 8
/** Furthest the fit may slide the stack off center, as a share of the frame. */
const MAX_SHIFT = 0.12

const ISO = "rotateX(60deg) rotateZ(-45deg)"
const R2 = Math.SQRT2

const project = (x: number, y: number) => ({
  x: (x + y) / R2,
  y: (y - x) / (2 * R2),
})

/**
 * Plane offset that lands `k` px straight down on screen: (−√2k, √2k) maps to
 * screen (0, k). Slab sides, the floor and the recess all use it.
 */
const down = (k: number): [number, number] => [-R2 * k, R2 * k]
/** The floor under every slab: a slab's thickness straight down. */
const FLOOR = down(THICK)

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(query.matches)
    const onChange = () => setReduced(query.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  return reduced
}

type Skyline = {
  /** Topmost scene-y the cards reach over scene-x range [a, b]; Infinity if none. */
  top: (a: number, b: number) => number
  left: number
  right: number
  /** Lowest scene-y of the page, its rest thickness included. */
  bottom: number
}

/**
 * The page's top outline in scene coords: up from its top-left corner to the
 * top-right corner, then down the right edge. Raised by LIFT, since any card
 * may be lifted, so the fit never depends on which one is out.
 */
function makeSkyline(originX: number, originY: number, pageH: number): Skyline {
  const tl = { x: originX, y: originY }
  const tr = { x: originX + project(PAGE_W, 0).x, y: originY + project(PAGE_W, 0).y }
  const br = { x: originX + project(PAGE_W, pageH).x, y: originY + project(PAGE_W, pageH).y }
  const at = (x: number) =>
    x <= tr.x
      ? tl.y + ((x - tl.x) / (tr.x - tl.x)) * (tr.y - tl.y)
      : tr.y + ((x - tr.x) / (br.x - tr.x)) * (br.y - tr.y)
  return {
    left: tl.x,
    right: br.x,
    bottom: originY + project(0, pageH).y + THICK,
    top(a, b) {
      const lo = Math.max(a, tl.x)
      const hi = Math.min(b, br.x)
      if (lo > hi) return Infinity
      const y = lo <= tr.x && tr.x <= hi ? tr.y : Math.min(at(lo), at(hi))
      return y - LIFT
    },
  }
}

type SceneFit = {
  scale: number
  /** Frame width the fit was solved for. */
  width: number
  /** Scene left/top relative to the frame; a negative top tucks it under the hero. */
  left: number
  top: number
  /** Frame height, so the document ends right where the stack does. */
  height: number
}

type Box = { left: number; right: number; bottom: number }

/** Line boxes of text, plus links, buttons and icons inside `root`, in document coords. */
function collectObstacles(root: Element, scrollY: number): Box[] {
  const boxes: Box[] = []
  const push = (r: DOMRect) => {
    if (r.width > 0 && r.height > 0)
      boxes.push({ left: r.left, right: r.right, bottom: r.bottom + scrollY })
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue
    range.selectNodeContents(node)
    for (const r of range.getClientRects()) push(r)
  }
  root.querySelectorAll("a, button, img, svg").forEach((el) => push(el.getBoundingClientRect()))
  return boxes
}

/**
 * The fit system. Everything is measured; there are no breakpoints:
 * - Obstacles: the header (full width) and every text line, link and button
 *   of the hero, which is the element right before the stack's wrapper.
 * - Floor: the viewport bottom minus the footer.
 * - Walls: the frame's width bounds the page's horizontal span.
 * For a candidate scale, the scene rises until the page's top outline meets
 * the lowest obstacle above it; the scale fits if the page still clears the
 * floor. A binary search finds the largest one, and
 * leftover height is split above and below.
 */
function fitScene(section: HTMLElement, frame: HTMLElement, sky: Skyline): SceneFit | null {
  const scrollY = window.scrollY
  const frameRect = frame.getBoundingClientRect()
  const frameTop = frameRect.top + scrollY
  const width = frameRect.width
  if (width <= 0) return null

  const obstacles: Box[] = []
  const header = document.querySelector("header")
  if (header) {
    const r = header.getBoundingClientRect()
    obstacles.push({ left: -Infinity, right: Infinity, bottom: r.bottom + scrollY })
  }
  const hero = section.parentElement?.previousElementSibling
  if (hero) obstacles.push(...collectObstacles(hero, scrollY))

  const footer = document.querySelector("footer")
  const footerH = footer?.getBoundingClientRect().height ?? 0
  const floor = window.innerHeight - footerH - 8

  const span = sky.right - sky.left

  /** Highest the scene can sit with its left edge at `sceneLeft` (frame px). */
  const rise = (scale: number, sceneLeft: number) => {
    const left = frameRect.left + sceneLeft
    let y = -Infinity
    for (const o of obstacles) {
      const top =
        o.left === -Infinity
          ? sky.top(sky.left, Infinity)
          : sky.top((o.left - FIT_PAD - left) / scale, (o.right + FIT_PAD - left) / scale)
      if (top !== Infinity) y = Math.max(y, o.bottom + FIT_PAD - top * scale)
    }
    return y === -Infinity ? frameTop : y
  }
  /**
   * Center the page, then slide sideways so the page's peak lands
   * beside the hero copy instead of under it; prefer the most centered of the
   * highest spots.
   */
  const place = (scale: number) => {
    const contentW = span * scale
    const centered = (width - contentW) / 2 - sky.left * scale
    // Walls, as limits on the scene's left edge (frame px): the page stays in
    // the frame, and a card mid-swap (SWAP_SLIDE further out) stays on screen.
    const slide = SWAP_SLIDE * scale
    const minLeft = Math.max(12, VIEW_GUTTER - frameRect.left + slide) - sky.left * scale
    const maxLeft =
      Math.min(width - 12, window.innerWidth - VIEW_GUTTER - frameRect.left - slide) - sky.right * scale
    if (minLeft > maxLeft) return { y: frameTop, left: centered, bottom: Infinity }
    const clamp = (x: number) => Math.min(maxLeft, Math.max(minLeft, x))
    const lo = clamp(centered - width * MAX_SHIFT)
    const hi = clamp(centered + width * MAX_SHIFT)
    const home = clamp(centered)
    let best = { y: rise(scale, home), left: home }
    const steps = 24
    for (let i = 0; i <= steps; i++) {
      const left = lo + ((hi - lo) * i) / steps
      const y = rise(scale, left)
      if (
        y < best.y - 2 ||
        (Math.abs(y - best.y) <= 2 && Math.abs(left - home) < Math.abs(best.left - home))
      )
        best = { y, left }
    }
    return { ...best, bottom: best.y + sky.bottom * scale + 8 }
  }

  let scale = Math.min(MAX_SCALE, (width - 24) / span)
  if (place(scale).bottom > floor) {
    let lo = 0.3
    let hi = scale
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2
      if (place(mid).bottom <= floor) lo = mid
      else hi = mid
    }
    scale = lo
  }
  const { y, left, bottom } = place(scale)
  const slack = Math.max(0, floor - bottom) / 2
  return {
    scale,
    width,
    left,
    top: y + slack - frameTop,
    height: Math.max(0, bottom + slack - frameTop),
  }
}

const shotSrc = (versionId: string, theme: "light" | "dark") =>
  `/images/home/${versionId}-${theme}.webp`

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))
const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

/** Lifted card offset in the rotated plane: screen-up by LIFT, plus a screen-x slide. */
function cardOffset(phase: Phase): [number, number] {
  if (phase === "down") return [0, 0]
  // Screen (d, 0) is plane (d/√2, d/√2); screen-up L is plane (√2·L, −√2·L).
  const slide = phase === "exit" ? SWAP_SLIDE : phase === "enter" ? -SWAP_SLIDE : 0
  const d = slide / R2
  return [LIFT * R2 + d, -LIFT * R2 + d]
}

function cardTranslate(phase: Phase) {
  const [x, y] = cardOffset(phase)
  return `${x}px ${y}px`
}

/**
 * One corner radius for every card, its dashed slot and the bay outline (the
 * card foil shader uses the same 6). Borders are 1px, so SVG strokes, drawn
 * on their centre line half a pixel in, use CARD_RADIUS - 0.5.
 */
const CARD_RADIUS = 6
/** Where the rounded corner meets the diagonal: tethers start and end there. */
const CORNER_INSET = CARD_RADIUS * (1 - Math.SQRT1_2)
/** A tether at full lift, floor to lifted top face, in plane px: 2·(LIFT + THICK). */
const TETHER_LENGTH = 2 * (LIFT + THICK)

/**
 * The bay: while a card is up, its recess on the floor, four upright corner
 * tethers and a dashed outline at the lifted height form one wireframe box. The box holds
 * still through a swap; the old card slides out of it and the new one slides
 * into it. On lift and land the box grows and collapses on the card's own
 * timing (`d` and `translate` share its duration and easing), so the tethers
 * ride the corners up and squash back down.
 */
function Bay({ width, height, phase }: { width: number; height: number; phase: Phase }) {
  // Upright through every lifted phase; only lift and land move it.
  const [tx, ty] = cardOffset(phase === "down" ? "down" : "up")
  const i = CORNER_INSET
  const corners = [
    [i, i],
    [width - i, i],
    [width - i, height - i],
    [i, height - i],
  ]
  // From the recess corners on the floor up to the card's top-face corners.
  const [fx, fy] = FLOOR
  const d = corners.map(([x, y]) => `M ${x + fx} ${y + fy} L ${x + tx} ${y + ty}`).join(" ")
  const transition =
    phase === "up"
      ? `${LIFT_MS}ms ease-out`
      : phase === "down"
        ? `${LAND_MS}ms cubic-bezier(0.5, 0, 0.75, 0)`
        : null
  return (
    <svg
      aria-hidden
      width={width}
      height={height}
      className="pointer-events-none absolute inset-0 overflow-visible text-foreground/40"
    >
      {/*
        pathLength pins the dash count to the tethers, not their length: as the
        card lands the dashes squash together like a spring into the corners,
        and on lift they unfold. Nothing fades; the flat bay ends up under the card.
      */}
      <path
        d={d}
        pathLength={4 * TETHER_LENGTH}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray="3 3"
        style={{ d: `path("${d}")`, transition: transition ? `d ${transition}` : "none" } as React.CSSProperties}
      />
      {/* The bay's top: where the card sits when lifted, seen while it is away. */}
      <rect
        x={0.5}
        y={0.5}
        width={width - 1}
        height={height - 1}
        rx={CARD_RADIUS - 0.5}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray="3 3"
        style={{
          translate: `${tx}px ${ty}px`,
          transition: transition ? `translate ${transition}` : "none",
        }}
      />
    </svg>
  )
}

/**
 * A slab's two visible sides, under its top face. In this view the left side
 * (facing down-left) and the front side (down-right) show; the outline is the
 * top face's rounded rect swept a thickness down. Light comes from the upper
 * left: a gradient across x + y keeps the left side lit and the front in
 * shade, blending around the front corner's curve.
 */
function SlabSides({ width, height, style }: { width: number; height: number; style: React.CSSProperties }) {
  // Gradient ids must be valid in url(#…); useId output can contain colons.
  const id = `slab${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
  const r = CARD_RADIUS
  const c = Math.SQRT1_2
  const [vx, vy] = FLOOR
  // Silhouette runs from the top-left corner's 45° point to the bottom-right's.
  const a = [r - r * c, r - r * c]
  const b = [width - r + r * c, height - r + r * c]
  const top = `M ${a[0]} ${a[1]} A ${r} ${r} 0 0 0 0 ${r} L 0 ${height - r} A ${r} ${r} 0 0 0 ${r} ${height} L ${width - r} ${height} A ${r} ${r} 0 0 0 ${b[0]} ${b[1]}`
  const base = `M ${a[0] + vx} ${a[1] + vy} A ${r} ${r} 0 0 0 ${vx} ${r + vy} L ${vx} ${height - r + vy} A ${r} ${r} 0 0 0 ${r + vx} ${height + vy} L ${width - r + vx} ${height + vy} A ${r} ${r} 0 0 0 ${b[0] + vx} ${b[1] + vy}`
  const body = `${top} L ${b[0] + vx} ${b[1] + vy} A ${r} ${r} 0 0 1 ${width - r + vx} ${height + vy} L ${r + vx} ${height + vy} A ${r} ${r} 0 0 1 ${vx} ${height - r + vy} L ${vx} ${r + vy} A ${r} ${r} 0 0 1 ${a[0] + vx} ${a[1] + vy} Z`
  // Gradient parameter t = ((x + y) − (height − r)) / 2r: 0 on the left side, 1 on the front.
  const g0 = (height - r) / 2
  const g1 = (height + r) / 2
  return (
    <svg aria-hidden width={width} height={height} className="pointer-events-none absolute inset-0 overflow-visible" style={style}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={g0} y1={g0} x2={g1} y2={g1}>
          <stop
            offset="0"
            className="[stop-color:color-mix(in_oklab,var(--foreground)_7%,var(--background))] dark:[stop-color:color-mix(in_oklab,var(--foreground)_17%,var(--background))]"
          />
          <stop
            offset="1"
            className="[stop-color:color-mix(in_oklab,var(--foreground)_17%,var(--background))] dark:[stop-color:color-mix(in_oklab,var(--foreground)_7%,var(--background))]"
          />
        </linearGradient>
      </defs>
      <path d={body} fill={`url(#${id})`} />
      {/* The bottom edge where the slab meets the floor. */}
      <path d={base} fill="none" stroke="currentColor" strokeWidth={1} className="text-foreground/30" />
    </svg>
  )
}

/**
 * Contact shadow on the floor, straight under the card (light from above). It
 * follows only the card's sideways slide, fades when the card is away, and is
 * soft while the card is up, sharpening as it lands until the card covers it.
 */
function slideOffset(phase: Phase) {
  const slide = phase === "exit" ? SWAP_SLIDE : phase === "enter" ? -SWAP_SLIDE : 0
  const d = slide / R2
  return `${d}px ${d}px`
}
const SHADOW_BLUR_UP = 7

const PHASE_TRANSITION: Record<Phase, string> = {
  up: `translate ${LIFT_MS}ms ease-out, opacity ${LIFT_MS}ms ease-out`,
  exit: `translate ${EXIT_MS}ms cubic-bezier(0.55, 0, 1, 0.45), opacity ${EXIT_MS}ms ease-in`,
  enter: "none",
  in: `translate ${ENTER_MS}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${ENTER_MS}ms ease-out`,
  down: `translate ${LAND_MS}ms cubic-bezier(0.5, 0, 0.75, 0), opacity ${LAND_MS}ms ease-out`,
}

/** `layers` is ordered top of the page → bottom (navbar first). */
export function HomeBlockStack({ layers }: { layers: HomeStackLayer[] }) {
  const [active, setActive] = React.useState(1)
  const [paused, setPaused] = React.useState(false)
  const [fit, setFit] = React.useState<SceneFit | null>(null)
  const scale = fit?.scale ?? 1
  const fitted = fit !== null
  const scaleRef = React.useRef(scale)
  React.useEffect(() => {
    scaleRef.current = scale
  }, [scale])
  const sectionRef = React.useRef<HTMLElement | null>(null)
  const [fieldReady, setFieldReady] = React.useState(false)
  /** Which version each card shows; every card starts on its starter (index 0). */
  const [shown, setShown] = React.useState<number[]>(() => layers.map(() => 0))
  const [phase, setPhase] = React.useState<Phase>("up")
  const shownRef = React.useRef(shown)
  React.useEffect(() => {
    shownRef.current = shown
  }, [shown])
  /** The card lifted on load keeps its starter until the stack has moved on once. */
  const advanced = React.useRef(false)
  const frameRef = React.useRef<HTMLDivElement | null>(null)
  const sceneRef = React.useRef<HTMLDivElement | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const cardCanvasRefs = React.useRef<(HTMLCanvasElement | null)[]>([])
  const fieldRef = React.useRef<StackGpu | null>(null)
  const reducedMotion = usePrefersReducedMotion()
  const autoplay = !paused && !reducedMotion && layers.length > 1

  // Autoplay: lift → swap → land, then on to the next card. Hover pauses with the
  // card simply lifted; leaving resumes from there.
  React.useEffect(() => {
    if (!autoplay) {
      setPhase("up")
      return
    }
    let cancelled = false
    const step = async (ms: number) => {
      await wait(ms)
      if (cancelled) throw new Error("cancelled")
    }
    const run = async () => {
      setPhase("up")
      await step(LIFT_MS + HOLD_MS)

      const versions = layers[active]?.versions ?? []
      if (advanced.current && versions.length > 1) {
        const next = (shownRef.current[active] + 1) % versions.length
        // Decode first so the incoming card never arrives blank.
        const theme = document.documentElement.classList.contains("dark") ? "dark" : "light"
        const img = new window.Image()
        img.src = shotSrc(versions[next], theme)
        await img.decode().catch(() => {})
        if (cancelled) return

        setPhase("exit")
        await step(EXIT_MS)
        setShown((list) => list.map((v, i) => (i === active ? next : v)))
        setPhase("enter")
        await nextFrame()
        await nextFrame()
        if (cancelled) return
        setPhase("in")
        await step(ENTER_MS + SETTLE_MS)
      }

      setPhase("down")
      await step(LAND_MS + GAP_MS)
      advanced.current = true
      setActive((i) => (i + 1) % layers.length)
    }
    run().catch(() => {})
    return () => {
      cancelled = true
    }
  }, [active, autoplay, layers])

  const sections = React.useMemo(() => {
    const heights = layers.map((layer) => SECTION_H[layer.id] ?? DEFAULT_H)
    return layers.map((layer, index) => ({
      ...layer,
      height: heights[index],
      top: heights.slice(0, index).reduce((sum, h) => sum + h + SECTION_GAP, 0),
    }))
  }, [layers])

  const lastSection = sections[sections.length - 1]
  const pageH = lastSection ? lastSection.top + lastSection.height : 0
  const pageSpan = project(PAGE_W, pageH).x
  // Screen position of the page's top-left corner inside the scene.
  const originX = (SCENE_W - pageSpan) / 2
  const originY = 24 + LIFT + PAGE_W / (2 * R2)
  const sceneH = originY + project(0, pageH).y + 16

  // Fit the scene to the viewport: as large as possible with no page scroll,
  // tucked under the hero wherever the diagonal leaves room. See fitScene().
  React.useLayoutEffect(() => {
    const section = sectionRef.current
    const frame = frameRef.current
    if (!section || !frame) return
    const skyline = makeSkyline(originX, originY, pageH)
    let raf = 0
    const run = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const next = fitScene(section, frame, skyline)
        if (next) setFit(next)
      })
    }
    run()
    const observer = new ResizeObserver(run)
    observer.observe(frame)
    window.addEventListener("resize", run)
    document.fonts?.ready.then(run)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener("resize", run)
    }
  }, [originX, originY, pageH])

  // GPU dot field and card foil; the CSS dots stay as the fallback until it runs.
  React.useEffect(() => {
    const canvas = canvasRef.current
    const cardCanvases = cardCanvasRefs.current.slice(0, sections.length)
    if (!canvas || !fitted || cardCanvases.some((c) => !c)) return
    // Canvases lay out at scene size, then CSS scales them; render enough pixels for that.
    const sceneScale = Math.max(1, scaleRef.current)
    const field = createStackGpu({
      fieldCanvas: canvas,
      cardCanvases: cardCanvases as HTMLCanvasElement[],
      geometry: {
        size: [SCENE_W, sceneH],
        origin: [originX, originY],
        pageW: PAGE_W,
        pageH,
        lift: LIFT,
        fieldPad: FIELD_PAD,
        thick: THICK,
        sections: sections.map(({ top, height }) => ({ top, height })),
      },
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      dpr: Math.min(3, Math.max(1, window.devicePixelRatio || 1) * sceneScale),
    })
    fieldRef.current = field
    field.ready.then(() => setFieldReady(true)).catch(() => field.dispose())
    return () => {
      field.dispose()
      fieldRef.current = null
      setFieldReady(false)
    }
  }, [fitted, originX, originY, pageH, sceneH, sections])

  React.useEffect(() => {
    fieldRef.current?.setReducedMotion(reducedMotion)
  }, [reducedMotion])

  React.useEffect(() => {
    const field = fieldRef.current
    if (!fieldReady || !field) return
    // The dot field and foil keep time with the card's phases.
    if (phase === "down") return field.land()
    field.setActive(active)
    if (phase === "in") field.swapIn()
  }, [fieldReady, active, phase])

  // Tell the field which part of its canvas is visible (the viewport clips the
  // sides, the canvas ends under the page) so it fades out before any edge.
  React.useEffect(() => {
    const field = fieldRef.current
    if (!fieldReady || !field || !fit) return
    const toCanvas = (frameX: number) => (frameX - fit.left) / fit.scale + FIELD_PAD
    const frameLeft = frameRef.current?.getBoundingClientRect().left ?? 0
    const canvasW = SCENE_W + FIELD_PAD * 2
    const canvasH = sceneH + FIELD_PAD
    const frameBottom = (fit.height - fit.top) / fit.scale + FIELD_PAD
    field.setClip([
      Math.max(0, toCanvas(-frameLeft)),
      0,
      Math.min(canvasW, toCanvas(window.innerWidth - frameLeft)),
      Math.min(canvasH, frameBottom),
    ])
  }, [fieldReady, fit, sceneH])

  const trackPointer = (e: React.PointerEvent) => {
    const scene = sceneRef.current
    if (!scene || !fieldRef.current) return
    const rect = scene.getBoundingClientRect()
    const sx = (e.clientX - rect.left) / scale - originX
    const sy = (e.clientY - rect.top) / scale - originY
    // Screen → page-local, the inverse of project().
    fieldRef.current.setPointer([(sx - 2 * sy) / R2, (sx + 2 * sy) / R2])
  }

  if (sections.length === 0) return null
  const canvasOffset = project(-CANVAS_MARGIN, -CANVAS_MARGIN)

  const select = (index: number) => {
    advanced.current = true
    setPaused(true)
    setActive(index)
  }

  return (
    <section
      ref={sectionRef}
      aria-label="What a page is made of"
      // Sits beneath the hero so it can tuck under it. Cards may pass the
      // frame mid-swap; the site layout clips sideways at the viewport.
      className="relative -z-10 w-full"
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={frameRef}
        className={cn(
          "relative w-full transition-opacity duration-500",
          fitted ? "opacity-100" : "opacity-0"
        )}
        style={{ height: fit?.height ?? SCENE_H }}
      >
        <div
          ref={sceneRef}
          onPointerMove={trackPointer}
          onPointerLeave={() => fieldRef.current?.setPointer(null)}
          className="absolute origin-top-left"
          style={{
            width: SCENE_W,
            height: sceneH,
            left: fit?.left ?? 0,
            top: fit?.top ?? 0,
            transform: `scale(${scale})`,
          }}
        >
          <canvas
            ref={canvasRef}
            aria-hidden
            className={cn(
              "absolute transition-opacity duration-700",
              fieldReady ? "opacity-100" : "opacity-0"
            )}
            style={{
              left: -FIELD_PAD,
              top: -FIELD_PAD,
              width: SCENE_W + FIELD_PAD * 2,
              height: sceneH + FIELD_PAD,
            }}
          />

          {/* CSS dotted canvas: shown until (or unless) the GPU field runs. */}
          <div
            aria-hidden
            className={cn(
              "absolute origin-top-left text-foreground/25 transition-opacity duration-700",
              fieldReady && "opacity-0"
            )}
            style={{
              left: originX + canvasOffset.x,
              top: originY + canvasOffset.y,
              width: PAGE_W + CANVAS_MARGIN * 2,
              height: pageH + CANVAS_MARGIN * 2,
              transform: ISO,
              backgroundImage: "radial-gradient(currentColor 1px, transparent 1.2px)",
              backgroundSize: "14px 14px",
              maskImage: "radial-gradient(closest-side, black 55%, transparent)",
            }}
          />

          {/*
            The floor: each section's recess and contact shadow, a slab's
            thickness down. Under every card, so the slab in front hides the
            part of a recess behind it.
          */}
          <div
            aria-hidden
            className="pointer-events-none absolute flex origin-top-left flex-col"
            style={{ left: originX, top: originY, width: PAGE_W, gap: SECTION_GAP, transform: ISO }}
          >
            {sections.map((section, index) => {
              const cardPhase: Phase = index === active ? phase : "down"
              const lifted = cardPhase !== "down"
              return (
                <div
                  key={section.id}
                  className="relative"
                  style={{ height: section.height, translate: `${FLOOR[0]}px ${FLOOR[1]}px` }}
                >
                  <div
                    className="absolute inset-0 bg-foreground/10 dark:bg-background/80"
                    style={{
                      borderRadius: CARD_RADIUS,
                      translate: slideOffset(cardPhase),
                      opacity: cardPhase === "exit" || cardPhase === "enter" ? 0 : 1,
                      filter: `blur(${lifted ? SHADOW_BLUR_UP : 0}px)`,
                      transition: `${PHASE_TRANSITION[cardPhase]}, filter ${lifted ? LIFT_MS : LAND_MS}ms ease-out`,
                    }}
                  />
                  <div
                    className={cn(
                      "absolute inset-0 border border-dashed border-foreground/40 transition-opacity duration-300",
                      lifted ? "opacity-100" : "opacity-0"
                    )}
                    style={{ borderRadius: CARD_RADIUS }}
                  />
                </div>
              )
            })}
          </div>

          {/* The page: one column of sections. */}
          <div
            className="absolute flex origin-top-left flex-col"
            style={{
              left: originX,
              top: originY,
              width: PAGE_W,
              gap: SECTION_GAP,
              transform: ISO,
            }}
          >
            {sections.map((section, index) => {
              const isActive = index === active
              const cardPhase: Phase = isActive ? phase : "down"

              return (
                <div
                  key={section.id}
                  aria-hidden
                  className={cn("relative", isActive && "z-10")}
                  style={{ height: section.height }}
                  onMouseEnter={() => select(index)}
                >
                  {/* Under the card, so it hides the parts of the bay it covers. */}
                  <Bay width={PAGE_W} height={section.height} phase={cardPhase} />
                  <SlabSides
                    width={PAGE_W}
                    height={section.height}
                    style={{
                      translate: cardTranslate(cardPhase),
                      opacity: cardPhase === "exit" || cardPhase === "enter" ? 0 : 1,
                      transition: PHASE_TRANSITION[cardPhase],
                    }}
                  />
                  <div
                    data-active={isActive}
                    className={cn(
                      "group/card absolute inset-0 overflow-hidden border bg-background motion-reduce:transition-none!",
                      isActive ? "border-foreground/45" : "border-foreground/15"
                    )}
                    style={{
                      borderRadius: CARD_RADIUS,
                      translate: cardTranslate(cardPhase),
                      opacity: cardPhase === "exit" || cardPhase === "enter" ? 0 : 1,
                      transition: `${PHASE_TRANSITION[cardPhase]}, border-color 300ms`,
                    }}
                  >
                    {/* The real block, captured in both themes. */}
                    <div
                      className={cn(
                        "absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none",
                        isActive ? "opacity-100" : "opacity-45"
                      )}
                    >
                      <Image
                        src={shotSrc(section.versions[shown[index] ?? 0], "light")}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover object-top dark:hidden"
                      />
                      <Image
                        src={shotSrc(section.versions[shown[index] ?? 0], "dark")}
                        alt=""
                        fill
                        unoptimized
                        className="hidden object-cover object-top dark:block"
                      />
                    </div>
                    {/* Foil: matte, except one shine when a new block swaps in. */}
                    <canvas
                      ref={(el) => {
                        cardCanvasRefs.current[index] = el
                      }}
                      className={cn(
                        "pointer-events-none absolute inset-0 size-full transition-opacity duration-700",
                        fieldReady ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </div>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}
