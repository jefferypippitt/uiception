import type { Effect, Gpu, Surface } from "vgpu"

/*
 * GPU layer for the homepage page stack. One device renders, per frame:
 *
 * - the dotted canvas under the page. Every pixel is un-projected into the
 *   page's flat coordinates, so the grid, ripples and slot glow lie on the
 *   isometric plane.
 * - a foil canvas inside every section card. Cards stay matte; only a block
 *   that has just swapped in gets one shine: a band sweeps across it and its
 *   engraved grooves (nested frames, UI inside UI) catch diffraction colour,
 *   a pearlescent wash and sparkle. The CSS transform on the card projects the
 *   canvas, so the foil sits on the card in perspective.
 *
 * Diffraction follows the grating model from GPU Gems ch. 8 (Jos Stam), as
 * used in vgpu's holographic-card example.
 */

const FIELD_SHADER = /* wgsl */ `
struct Params {
  color: vec4f,
  rippleA: vec4f,
  rippleB: vec4f,
  rippleC: vec4f,
  /** Visible rect in canvas px (minX, minY, maxX, maxY); the field fades out before it. */
  bounds: vec4f,
  size: vec2f,
  origin: vec2f,
  page: vec2f,
  pointer: vec2f,
  slotMin: vec2f,
  slotMax: vec2f,
  time: f32,
  pointerAmt: f32,
  slotAmt: f32,
  intensity: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

const SPACING: f32 = 14.0;
const RIPPLE_LIFE: f32 = 2.4;
const RIPPLE_SPEED: f32 = 240.0;
const INV_SQRT2: f32 = 0.70710678;

// Gaussian ring expanding from ripple.xy, started at ripple.z, scaled by ripple.w.
fn ripple(q: vec2f, r: vec4f) -> f32 {
  let age = params.time - r.z;
  if (age < 0.0 || age > RIPPLE_LIFE || r.w <= 0.0) { return 0.0; }
  let d = distance(q, r.xy);
  let ring = (d - age * RIPPLE_SPEED) / 30.0;
  let fade = pow(1.0 - age / RIPPLE_LIFE, 2.0);
  return exp(-ring * ring) * fade * r.w;
}

fn awayFrom(q: vec2f, c: vec2f) -> vec2f {
  let v = q - c;
  let l = length(v);
  return select(vec2f(0.0), v / l, l > 0.001);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  // Screen → page-local: inverse of ((x + y) / √2, (y − x) / (2√2)).
  let s = uv * params.size - params.origin;
  let q = vec2f(s.x - 2.0 * s.y, s.x + 2.0 * s.y) * INV_SQRT2;

  let wa = ripple(q, params.rippleA);
  let wb = ripple(q, params.rippleB);
  let wc = ripple(q, params.rippleC);
  let wave = wa + wb + wc;

  // Ripples push the grid outward as they pass.
  let warped = q
    - awayFrom(q, params.rippleA.xy) * wa * 9.0
    - awayFrom(q, params.rippleB.xy) * wb * 9.0
    - awayFrom(q, params.rippleC.xy) * wc * 9.0;

  let g = (fract(warped / SPACING) - 0.5) * SPACING;
  let dist = length(g);

  let pd = distance(q, params.pointer);
  let near = exp(-(pd * pd) / (80.0 * 80.0)) * params.pointerAmt;

  let edge = max(params.slotMin - q, q - params.slotMax);
  let sdf = length(max(edge, vec2f(0.0))) + min(max(edge.x, edge.y), 0.0);
  let glow = exp(-max(sdf, 0.0) / 26.0) * params.slotAmt;

  let radius = 0.9 + wave * 2.2 + near * 1.3 + glow * 0.7;
  let aa = max(fwidth(dist), 0.5);
  let dot = 1.0 - smoothstep(radius - aa, radius + aa, dist);

  let lit = dot * (params.intensity + wave * 0.6 + near * 0.5 + glow * 0.45);
  let haze = glow * 0.12 + wave * 0.08;

  // Fade the field out in an ellipse around the page.
  let center = params.page * 0.5;
  let reach = length((q - center) / (center + vec2f(120.0)));
  // ...and before whatever clips the canvas (its own bounds, the frame), so no hard edge shows.
  let sp = uv * params.size;
  let inside = min(min(sp.x - params.bounds.x, params.bounds.z - sp.x), min(sp.y - params.bounds.y, params.bounds.w - sp.y));
  let mask = (1.0 - smoothstep(0.45, 1.0, reach)) * smoothstep(0.0, 56.0, inside);

  let a = clamp((lit + haze) * mask, 0.0, 1.0);
  return vec4f(params.color.rgb * a, a);
}
`

const CARD_SHADER = /* wgsl */ `
struct Card {
  size: vec2f,
  light: vec2f,
  reveal: f32,
  dark: f32,
  seed: f32,
  /** 0–1 burst while a block swaps: the whole card catches pearl and diffraction. */
  shine: f32,
}
@group(0) @binding(0) var<uniform> card: Card;

fn roundedBox(p: vec2f, halfSize: vec2f, radius: f32) -> f32 {
  let q = abs(p) - halfSize + radius;
  return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0) - radius;
}

fn stroke(distance: f32, width: f32, aa: f32) -> f32 {
  return 1.0 - smoothstep(width, width + aa, abs(distance));
}

// Visible wavelengths (µm) to smooth display RGB responses.
fn wavelengthColor(wavelength: f32) -> vec3f {
  let response = (vec3f(wavelength) - vec3f(0.610, 0.545, 0.460)) / vec3f(0.045, 0.038, 0.032);
  let visible = smoothstep(0.380, 0.410, wavelength) * (1.0 - smoothstep(0.700, 0.780, wavelength));
  return exp(-0.5 * response * response) * visible;
}

// Reflection grating: m · λ = d · (L + V)·across, summed over three orders.
fn diffraction(across: vec2f, lightAndView: vec2f, spacing: f32) -> vec3f {
  let pathDifference = spacing * abs(dot(lightAndView, across));
  let along = dot(lightAndView, vec2f(-across.y, across.x));
  let envelope = exp(-along * along / 0.36);
  var reflected = vec3f(0.0);
  for (var order = 1; order <= 3; order++) {
    let m = f32(order);
    reflected += wavelengthColor(pathDifference / m) / (m * m);
  }
  return reflected * envelope;
}

fn pearlColor(phase: f32) -> vec3f {
  return vec3f(0.55, 0.52, 0.64) + vec3f(0.43, 0.40, 0.34)
    * cos(6.2831853 * (phase + vec3f(0.05, 0.38, 0.63)));
}

fn grain(point: vec2f) -> f32 {
  let p = vec2u(abs(point));
  var n = (p.x * 1597334677u) ^ (p.y * 3812015801u);
  n = (n ^ (n >> 16u)) * 2246822519u;
  return f32(n & 1023u) / 1023.0 - 0.5;
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let size = card.size;
  let p = uv * size;
  let c = p - size * 0.5;
  let w = size.x;
  let n = c / w;

  // Grooves: nested frames stepping in from the card edge, gently warped.
  let inset = -roundedBox(c, size * 0.5, 6.0);
  let warp = sin(n.y * 9.0 + sin(n.x * 5.0 + card.seed)) * 2.2
    + sin(n.x * 7.0 - n.y * 4.0 + card.seed * 1.7) * 1.6;
  let groove = inset + warp;
  let phase = groove * 6.2831853 / 3.2;
  let lines = stroke(sin(phase), 0.2, min(fwidth(phase), 1.0));
  // The canvas is drawn in card space, so screen derivatives are card derivatives.
  let slope = vec2f(dpdx(groove), dpdy(groove));
  let across = slope / max(length(slope), 1e-6);

  // A soft band of light, pinched by a spotlight around the light position.
  let delta = (p - card.light) / w;
  let sweep = dot(delta, vec2f(0.81, 0.58)) + sin(n.y * 4.0 + n.x * 3.0) * 0.06;
  // A swap narrows the band into a crisp stripe that sweeps across.
  let band = exp(-pow(sweep / (0.32 - 0.16 * card.shine), 2.0));
  let glint = exp(-pow(sweep / 0.08, 2.0));
  let spotD = delta * vec2f(1.0, 1.3);
  // The swap shine widens the spotlight a little so the stripe spans the card.
  let spot = exp(-dot(spotD, spotD) * 2.2 / (1.0 + card.shine * 1.2));
  let reveal = card.reveal;
  let light = band * spot * reveal;

  let lightAndView = (card.light - p) / w * 1.4 + vec2f(0.25, -0.18);
  let diff = diffraction(across, lightAndView, 1.65);
  let pearl = pearlColor(dot(lightAndView, vec2f(0.48, -0.32)) + n.y * 0.32 + phase * 0.004);
  let noise = grain(p * 1.7 + vec2f(card.seed * 31.0));

  var col = vec3f(0.0);
  let shine = card.shine;
  let engrave = reveal * (0.05 + 0.3 * spot + light * 1.2);
  col += lines * (vec3f(0.10) + pearl * 0.6 + diff * 0.2) * engrave;
  col += pearl * light * (0.2 + shine * 0.2);
  col += (pearl * 0.5 + vec3f(0.5)) * glint * spot * reveal * (0.1 + shine * 0.35);
  col += pearl * pow(max(noise + 0.5, 0.0), 24.0) * glint * spot * reveal * (0.5 + shine * 1.5);
  // Fine diffraction across the whole groove field rides the band during a swap.
  col += diff * lines * band * spot * shine * reveal * 0.9;

  // Rim catches the light along the card edge.
  let rim = stroke(roundedBox(c, size * 0.5 - 0.75, 6.0), 0.5, 1.0);
  col += rim * (pearl * 0.6 + vec3f(0.3)) * spot * reveal * 0.5;

  // Premultiplied out. Dark cards take the foil as light; light cards as ink.
  let peak = max(col.r, max(col.g, col.b));
  let a = clamp(peak * mix(1.8, 1.0, card.dark), 0.0, 1.0);
  let rgb = min(col * mix(0.7, 1.0, card.dark), vec3f(a));
  return vec4f(rgb, a);
}
`

type Vec2 = readonly [number, number]

export type StackSection = { top: number; height: number }

export type StackGeometry = {
  /** Scene size in CSS px. */
  size: Vec2
  /** Screen position of the page's top-left corner. */
  origin: Vec2
  pageW: number
  pageH: number
  /** How far the active card rises, in screen px. */
  lift: number
  /** Field canvas extends this far (scene px) past the scene on the left, top and right. */
  fieldPad: number
  /** Slab thickness in screen px: empty slots sit this far down, on the floor. */
  thick: number
  sections: StackSection[]
}

type Ripple = [number, number, number, number]

type CardState = {
  surface: Surface
  fx: Effect
  light: [number, number]
  reveal: number
}

/** Resolves any CSS color (oklch included) to sRGB 0–1 via a 1px 2D canvas. */
function cssColorToRgb(color: string): [number, number, number] {
  const ctx = document.createElement("canvas").getContext("2d")
  if (!ctx) return [0.5, 0.5, 0.5]
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return [r / 255, g / 255, b / 255]
}

const approach = (from: number, to: number, rate: number, dt: number) =>
  to + (from - to) * Math.exp(-rate * dt)

/** The one shine a swapped-in block gets: a band crossing it left to right, with the slide. */
const SHINE_S = 0.85

export function createStackGpu(options: {
  fieldCanvas: HTMLCanvasElement
  cardCanvases: HTMLCanvasElement[]
  geometry: StackGeometry
  reducedMotion: boolean
  /** Pixel density for every canvas, including any CSS scale-up of the scene. */
  dpr: number
}) {
  const { geometry } = options
  let disposed = false
  let gpu: Gpu | undefined
  let api: typeof import("vgpu") | undefined
  let fieldSurface: Surface | undefined
  let fieldFx: Effect | undefined
  let cards: CardState[] = []
  let raf = 0
  let visible = true
  let observer: IntersectionObserver | undefined

  const start = performance.now()
  const now = () => (performance.now() - start) / 1000
  let last = 0

  let reducedMotion = options.reducedMotion
  let active = -1
  let slotAmt = 0
  let pointer: Vec2 | null = null
  let fieldPointer: Vec2 = [-9999, -9999]
  let pointerAmt = 0
  // Ripple slots; the newest replaces the oldest. One ripple per swap.
  const ripples: [Ripple, Ripple, Ripple] = [
    [0, 0, -99, 0],
    [0, 0, -99, 0],
    [0, 0, -99, 0],
  ]
  let nextRipple = 0
  const fieldSize: Vec2 = [geometry.size[0] + geometry.fieldPad * 2, geometry.size[1] + geometry.fieldPad]
  const fieldOrigin: Vec2 = [geometry.origin[0] + geometry.fieldPad, geometry.origin[1] + geometry.fieldPad]
  let clip: [number, number, number, number] = [0, 0, fieldSize[0], fieldSize[1]]
  /** The swap shine: which card, and when it started. */
  let shineCard = -1
  let shineAt = -99
  let color: [number, number, number] = [0.5, 0.5, 0.5]
  let intensity = 0.22
  let dark = 1

  const readTheme = () => {
    const styles = getComputedStyle(document.documentElement)
    color = cssColorToRgb(styles.getPropertyValue("--foreground").trim() || "#888")
    dark = document.documentElement.classList.contains("dark") ? 1 : 0
    intensity = dark ? 0.2 : 0.26
  }
  const themeObserver = new MutationObserver(readTheme)

  // Slots are on the floor, a slab's thickness straight down: plane (−√2·t, √2·t).
  const floor = geometry.thick * Math.SQRT2
  const slotOf = (index: number) => {
    const s = geometry.sections[index]
    return {
      min: [-floor, s.top + floor] as Vec2,
      max: [geometry.pageW - floor, s.top + s.height + floor] as Vec2,
    }
  }

  const slotCenter = (index: number): Vec2 => {
    const s = slotOf(index)
    return [(s.min[0] + s.max[0]) / 2, (s.min[1] + s.max[1]) / 2]
  }
  const addRipple = (index: number) => {
    if (reducedMotion || index < 0) return
    const [x, y] = slotCenter(index)
    ripples[nextRipple] = [x, y, now(), 1]
    nextRipple = (nextRipple + 1) % ripples.length
  }
  /** Shine progress 0–1 for `index`, or -1 when it is not shining. */
  const shineAge = (index: number, t: number) => {
    if (index !== shineCard || reducedMotion) return -1
    const age = (t - shineAt) / SHINE_S
    return age < 0 || age > 1 ? -1 : age
  }

  const tick = () => {
    if (disposed) return
    raf = requestAnimationFrame(tick)
    if (!visible || document.hidden || !api || !gpu || !fieldFx || !fieldSurface) return

    const t = now()
    const dt = Math.min(t - last, 0.1)
    last = t
    slotAmt = approach(slotAmt, active >= 0 ? 1 : 0, reducedMotion ? 60 : 5, dt)
    pointerAmt = approach(pointerAmt, pointer && !reducedMotion ? 1 : 0, 6, dt)
    const slot = active >= 0 ? slotOf(active) : { min: [0, 0] as Vec2, max: [0, 0] as Vec2 }

    fieldFx.set({
      params: {
        color: [...color, 1],
        rippleA: ripples[0],
        rippleB: ripples[1],
        rippleC: ripples[2],
        bounds: clip,
        size: fieldSize,
        origin: fieldOrigin,
        page: [geometry.pageW, geometry.pageH],
        pointer: fieldPointer,
        slotMin: slot.min,
        slotMax: slot.max,
        time: t,
        pointerAmt,
        slotAmt,
        intensity,
      },
    })

    cards.forEach((card, index) => {
      const { height } = geometry.sections[index]
      const w = geometry.pageW
      // Only a block that has just swapped in shines; every other card stays matte.
      const age = shineAge(index, t)
      const shine = age < 0 ? 0 : Math.sin(Math.PI * age)
      if (age >= 0) {
        const e = age * age * (3 - 2 * age)
        card.light[0] = w * (-0.35 + 1.7 * e)
        card.light[1] = height * (0.25 + 0.5 * e)
      }
      card.reveal = shine * 0.7

      card.fx.set({
        card: {
          size: [w, height],
          light: card.light,
          reveal: card.reveal,
          dark,
          seed: index * 1.618,
          shine,
        },
      })
    })

    const fx = fieldFx
    const surface = fieldSurface
    api.frame(gpu, (f) => {
      f.pass(surface, fx)
      for (const card of cards) f.pass(card.surface, card.fx)
    })
  }

  const ready = (async () => {
    if (typeof navigator === "undefined" || !("gpu" in navigator)) {
      throw new Error("WebGPU unavailable")
    }
    const vgpu = await import("vgpu")
    if (disposed) return
    const nextGpu = await vgpu.init()
    if (disposed) {
      nextGpu.dispose()
      return
    }
    gpu = nextGpu
    api = vgpu
    readTheme()
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    })

    fieldSurface = vgpu.surface(gpu, options.fieldCanvas, { dpr: options.dpr })
    fieldSurface.clearColor = [0, 0, 0, 0]
    fieldFx = vgpu.effect(gpu, FIELD_SHADER, {
      set: {
        params: {
          color: [...color, 1],
          rippleA: ripples[0],
          rippleB: ripples[1],
          rippleC: ripples[2],
          bounds: clip,
          size: fieldSize,
          origin: fieldOrigin,
          page: [geometry.pageW, geometry.pageH],
          pointer: fieldPointer,
          slotMin: [0, 0],
          slotMax: [0, 0],
          time: 0,
          pointerAmt: 0,
          slotAmt: 0,
          intensity,
        },
      },
    })

    cards = options.cardCanvases.map((canvas, index) => {
      const { height } = geometry.sections[index]
      const surface = vgpu.surface(gpu!, canvas, { dpr: options.dpr })
      surface.clearColor = [0, 0, 0, 0]
      const light: [number, number] = [geometry.pageW * 0.5, height * 0.5]
      const fx = vgpu.effect(gpu!, CARD_SHADER, {
        set: {
          card: { size: [geometry.pageW, height], light, reveal: 0, dark, seed: index * 1.618, shine: 0 },
        },
      })
      return { surface, fx, light, reveal: 0 }
    })

    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver((entries) => {
        visible = entries.some((e) => e.isIntersecting)
      })
      observer.observe(options.fieldCanvas)
    }
    last = now()
    raf = requestAnimationFrame(tick)
  })()

  return {
    ready,
    setReducedMotion(next: boolean) {
      reducedMotion = next
    },
    /** A section lifts out of its slot (the field glows around the slot). */
    setActive(index: number) {
      active = index
    },
    /** The next block arrives on the lifted card: one ripple, one shine. */
    swapIn() {
      if (active < 0) return
      addRipple(active)
      shineCard = active
      shineAt = now()
    },
    /** The card presses back into its slot. */
    land() {
      active = -1
    },
    /** Visible part of the field canvas, in its CSS px (minX, minY, maxX, maxY). */
    setClip(rect: [number, number, number, number]) {
      clip = rect
    },
    /** Pointer in page-local coordinates, or null when it leaves the scene. */
    setPointer(local: Vec2 | null) {
      pointer = local
      if (local) fieldPointer = local
    },
    dispose() {
      if (disposed) return
      disposed = true
      cancelAnimationFrame(raf)
      observer?.disconnect()
      themeObserver.disconnect()
      gpu?.dispose()
    },
  }
}

export type StackGpu = ReturnType<typeof createStackGpu>
