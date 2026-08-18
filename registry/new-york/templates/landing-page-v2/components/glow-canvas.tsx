"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"

/**
 * Full-bleed WebGL2 color-field background: soft radial color blobs along a
 * tilted axis, domain-warped by value-noise derivatives, with a light mouse
 * pull and film grain. Palettes auto-cycle on a timer.
 */

export type GlowPalette = {
  name: string
  /** Four RGB triples in 0–1. Optional 5th mixes into the center. */
  colors: [number, number, number][]
}

export type GlowParams = {
  scale: number
  spacing: number
  spread: number
  rotation: number
  displacement: number
  noiseScale: number
  grain: number
  speed: number
  offsetX: number
  offsetY: number
}

export const DEFAULT_GLOW_PARAMS: GlowParams = {
  scale: 0.75,
  spacing: 0.52,
  spread: 1.5,
  rotation: -0.38,
  displacement: 1.2,
  noiseScale: 0.45,
  grain: 0.01,
  speed: 8e-4,
  offsetX: 0,
  offsetY: 0.15,
}

/** Named palettes for the auto-cycling color field. */
export const GLOW_PALETTES: GlowPalette[] = [
  {
    name: "Ember",
    colors: [
      [1, 236 / 255, 210 / 255],
      [1, 60 / 255, 0],
      [13 / 255, 2 / 255, 0],
      [55 / 255, 12 / 255, 0],
    ],
  },
  {
    name: "Ocean",
    colors: [
      [22 / 255, 37 / 255, 75 / 255],
      [35 / 255, 65 / 255, 138 / 255],
      [170 / 255, 223 / 255, 217 / 255],
      [223 / 255, 78 / 255, 16 / 255],
    ],
  },
  {
    name: "Lime",
    colors: [
      [211 / 255, 218 / 255, 52 / 255],
      [203 / 255, 178 / 255, 173 / 255],
      [1 / 255, 29 / 255, 141 / 255],
      [1 / 255, 3 / 255, 18 / 255],
    ],
  },
  {
    name: "Frost",
    colors: [
      [0, 8 / 255, 22 / 255],
      [0, 22 / 255, 65 / 255],
      [220 / 255, 238 / 255, 1],
      [0, 100 / 255, 1],
    ],
  },
]

const VERT = `#version 300 es
layout(location = 0) in vec3 position;
out vec2 vPosition;
void main() {
  gl_Position = vec4(position, 1.0);
  vPosition = position.xy;
}`

const FRAG = `#version 300 es
precision highp float;

uniform vec3  u_color1, u_color2, u_color3, u_color4, u_color5;
uniform float u_colorSize, u_colorSpacing, u_colorSpread, u_colorRotation;
uniform float u_displacement, u_noiseSize, u_noiseIntensity, u_seed;
uniform float u_color5Mix;
uniform vec2  u_colorOffset, u_resolution, u_mouse;

in  vec2 vPosition;
out vec4 fragColor;

float hash(vec2 p) {
  p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
  return -1.0 + 2.0 * fract(p.x * p.y * (p.x + p.y));
}

float noise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
    mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
    u.y
  );
}

vec4 gradientDerivativesNoise3D(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u  = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec3 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
  float a  = hash(i.xy + vec2(0,0) + i.z);
  float b  = hash(i.xy + vec2(1,0) + i.z);
  float c  = hash(i.xy + vec2(0,1) + i.z);
  float d  = hash(i.xy + vec2(1,1) + i.z);
  float e  = hash(i.xy + vec2(0,0) + i.z + 1.0);
  float f2 = hash(i.xy + vec2(1,0) + i.z + 1.0);
  float g  = hash(i.xy + vec2(0,1) + i.z + 1.0);
  float h  = hash(i.xy + vec2(1,1) + i.z + 1.0);
  float k0 =  a;
  float k1 =  b - a;
  float k2 =  c - a;
  float k3 =  e - a;
  float k4 =  a - b - c + d;
  float k5 =  a - b - e + f2;
  float k6 =  a - c - e + g;
  float k7 = -a + b + c - d + e - f2 - g + h;
  return vec4(
    k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.x*u.z + k6*u.y*u.z + k7*u.x*u.y*u.z,
    du * vec3(
      k1 + k4*u.y + k5*u.z + k7*u.y*u.z,
      k2 + k4*u.x + k6*u.z + k7*u.x*u.z,
      k3 + k5*u.x + k6*u.y + k7*u.x*u.y
    )
  );
}

vec2 rotate(vec2 v, float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c) * v;
}

void main() {
  vec2 uv = vPosition;
  uv.x *= min(1.0, u_resolution.x / u_resolution.y);
  uv /= max(u_colorSize, 0.001);

  vec2 mouseUV = u_mouse;
  mouseUV.x *= min(1.0, u_resolution.x / u_resolution.y);
  mouseUV /= max(u_colorSize, 0.001);

  vec2 toMouse = mouseUV - uv;
  float dist = length(toMouse);
  float pull = smoothstep(2.5, 0.0, dist) * 0.35;
  vec2 warped = uv + toMouse * pull;

  vec3 noiseInput = vec3(warped * u_noiseSize, u_seed);
  vec3 dispNoise  = gradientDerivativesNoise3D(noiseInput).yzw;
  vec2 position   = warped + dispNoise.xz * u_displacement + u_colorOffset;

  vec2 pos = rotate(position, -u_colorRotation);

  vec3 color = vec3(0.0);
  color = mix(u_color1, color, smoothstep(0.0, u_colorSpread, distance(pos, vec2(0.0,  u_colorSpacing * 1.5))));
  color = mix(u_color2, color, smoothstep(0.0, u_colorSpread, distance(pos, vec2(0.0,  u_colorSpacing * 0.5))));
  color = mix(u_color3, color, smoothstep(0.0, u_colorSpread, distance(pos, vec2(0.0, -u_colorSpacing * 0.5))));
  color = mix(u_color4, color, smoothstep(0.0, u_colorSpread, distance(pos, vec2(0.0, -u_colorSpacing * 1.5))));
  if (u_color5Mix > 0.0) {
    color = mix(color, u_color5, u_color5Mix * (1.0 - smoothstep(0.0, u_colorSpread * 0.8, distance(pos, vec2(0.0, 0.0)))));
  }

  float glow = smoothstep(1.8, 0.0, dist) * 0.12;
  color += glow;

  float grain = noise2D(vPosition.xy * 600.0 + u_seed);
  color += grain * u_noiseIntensity;

  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`

type ColorState = {
  r1: number
  g1: number
  b1: number
  r2: number
  g2: number
  b2: number
  r3: number
  g3: number
  b3: number
  r4: number
  g4: number
  b4: number
  r5: number
  g5: number
  b5: number
  mix5: number
}

function paletteToColorState(palette: GlowPalette): ColorState {
  const [c1, c2, c3, c4] = palette.colors
  const c5 = palette.colors[4] ?? [0, 0, 0]
  return {
    r1: c1![0],
    g1: c1![1],
    b1: c1![2],
    r2: c2![0],
    g2: c2![1],
    b2: c2![2],
    r3: c3![0],
    g3: c3![1],
    b3: c3![2],
    r4: c4![0],
    g4: c4![1],
    b4: c4![2],
    r5: c5[0],
    g5: c5[1],
    b5: c5[2],
    mix5: palette.colors.length > 4 ? 1 : 0,
  }
}

function lerpColorState(from: ColorState, to: ColorState, t: number): ColorState {
  const k = (a: number, b: number) => a + (b - a) * t
  return {
    r1: k(from.r1, to.r1),
    g1: k(from.g1, to.g1),
    b1: k(from.b1, to.b1),
    r2: k(from.r2, to.r2),
    g2: k(from.g2, to.g2),
    b2: k(from.b2, to.b2),
    r3: k(from.r3, to.r3),
    g3: k(from.g3, to.g3),
    b3: k(from.b3, to.b3),
    r4: k(from.r4, to.r4),
    g4: k(from.g4, to.g4),
    b4: k(from.b4, to.b4),
    r5: k(from.r5, to.r5),
    g5: k(from.g5, to.g5),
    b5: k(from.b5, to.b5),
    mix5: k(from.mix5, to.mix5),
  }
}

function compile(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) throw new Error("Failed to create shader")
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(info || "Shader compile failed")
  }
  return shader
}

function subscribeReducedMotion(onStoreChange: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
  mql.addEventListener("change", onStoreChange)
  return () => mql.removeEventListener("change", onStoreChange)
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function getReducedMotionServerSnapshot() {
  return false
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  )
}

export function GlowCanvas({
  className,
  params = DEFAULT_GLOW_PARAMS,
  palettes = GLOW_PALETTES,
  /** Index into `palettes`. Defaults to Ember (0). */
  initialPalette = 0,
  /** Seconds between automatic palette transitions. Set `0` to freeze. */
  autoCycleSeconds = 10,
  pauseWhenOffscreen = true,
}: {
  className?: string
  params?: GlowParams
  palettes?: GlowPalette[]
  initialPalette?: number
  autoCycleSeconds?: number
  pauseWhenOffscreen?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const paramsRef = useRef(params)
  paramsRef.current = params
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      premultipliedAlpha: false,
      // Named `glow-canvas` group snapshots the bitmap. Without this the
      // buffer is cleared after composite and the group captures empty.
      preserveDrawingBuffer: true,
    })
    if (!gl) {
      console.error("WebGL2 not supported")
      return
    }

    const verts = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0])
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)

    const program = gl.createProgram()
    if (!program) return
    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.bindAttribLocation(program, 0, "position")
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    const loc = (name: string) => {
      const l = gl.getUniformLocation(program, name)
      if (!l) console.error("Missing uniform:", name)
      return l
    }

    const uSeed = loc("u_seed")
    const uResolution = loc("u_resolution")
    const uColorSize = loc("u_colorSize")
    const uColorSpacing = loc("u_colorSpacing")
    const uColorSpread = loc("u_colorSpread")
    const uColorRotation = loc("u_colorRotation")
    const uDisplacement = loc("u_displacement")
    const uNoiseSize = loc("u_noiseSize")
    const uNoiseIntensity = loc("u_noiseIntensity")
    const uColorOffset = loc("u_colorOffset")
    const uMouse = loc("u_mouse")
    const uColor1 = loc("u_color1")
    const uColor2 = loc("u_color2")
    const uColor3 = loc("u_color3")
    const uColor4 = loc("u_color4")
    const uColor5 = loc("u_color5")
    const uColor5Mix = loc("u_color5Mix")

    let paletteIndex = ((initialPalette % palettes.length) + palettes.length) % palettes.length
    let colors = paletteToColorState(palettes[paletteIndex]!)
    let colorFrom = colors
    let colorTo = colors
    let colorMix = 1
    const colorDuration = 1.4

    let seed = 0.18
    const mouseTarget = { x: 0, y: 0 }
    const mouseSmooth = { x: 0, y: 0 }
    let mouseRaf = 0
    let listening = false
    let visible = true
    let raf = 0
    let running = false
    let resizeTimer = 0
    let lastTs = 0

    function resize(forceDraw = false) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.round(window.innerWidth * dpr)
      canvas!.height = Math.round(window.innerHeight * dpr)
      gl!.viewport(0, 0, canvas!.width, canvas!.height)
      if (forceDraw) draw(false)
    }

    function onResize() {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => resize(true), 100)
    }

    function onMove(e: MouseEvent) {
      if (mouseRaf) return
      const { clientX, clientY } = e
      mouseRaf = requestAnimationFrame(() => {
        mouseRaf = 0
        const w = window.innerWidth
        const h = window.innerHeight
        if (!w || !h) return
        mouseTarget.x = (clientX / w) * 2 - 1
        mouseTarget.y = -((clientY / h) * 2 - 1)
      })
    }

    function startMouse() {
      if (listening || reducedMotion) return
      window.addEventListener("mousemove", onMove, { passive: true })
      listening = true
    }

    function stopMouse() {
      if (!listening) return
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(mouseRaf)
      mouseRaf = 0
      listening = false
    }

    function cyclePalette() {
      if (!visible || reducedMotion || palettes.length < 2) return
      paletteIndex = (paletteIndex + 1) % palettes.length
      colorFrom = colors
      colorTo = paletteToColorState(palettes[paletteIndex]!)
      colorMix = 0
    }

    function draw(advance: boolean) {
      const p = paramsRef.current
      if (
        !uSeed ||
        !uResolution ||
        !uColorSize ||
        !uColorSpacing ||
        !uColorSpread ||
        !uColorRotation ||
        !uDisplacement ||
        !uNoiseSize ||
        !uNoiseIntensity ||
        !uColorOffset ||
        !uMouse ||
        !uColor1 ||
        !uColor2 ||
        !uColor3 ||
        !uColor4 ||
        !uColor5 ||
        !uColor5Mix
      ) {
        return
      }

      if (advance) seed += p.speed

      if (colorMix < 1) {
        colorMix = Math.min(1, colorMix + 1 / 60 / colorDuration)
        // ease power2.inOut-ish
        const t =
          colorMix < 0.5
            ? 2 * colorMix * colorMix
            : 1 - Math.pow(-2 * colorMix + 2, 2) / 2
        colors = lerpColorState(colorFrom, colorTo, t)
      }

      if (!reducedMotion) {
        mouseSmooth.x += (mouseTarget.x - mouseSmooth.x) * 0.12
        mouseSmooth.y += (mouseTarget.y - mouseSmooth.y) * 0.12
      }

      gl!.uniform1f(uSeed, seed)
      gl!.uniform2f(uResolution, canvas!.width, canvas!.height)
      gl!.uniform1f(uColorSize, p.scale)
      gl!.uniform1f(uColorSpacing, p.spacing)
      gl!.uniform1f(uColorSpread, p.spread)
      gl!.uniform1f(uColorRotation, p.rotation)
      gl!.uniform1f(uDisplacement, p.displacement)
      gl!.uniform1f(uNoiseSize, p.noiseScale)
      gl!.uniform1f(uNoiseIntensity, p.grain)
      gl!.uniform2f(uColorOffset, p.offsetX, p.offsetY)
      gl!.uniform2f(uMouse, mouseSmooth.x, mouseSmooth.y)
      gl!.uniform3f(uColor1, colors.r1, colors.g1, colors.b1)
      gl!.uniform3f(uColor2, colors.r2, colors.g2, colors.b2)
      gl!.uniform3f(uColor3, colors.r3, colors.g3, colors.b3)
      gl!.uniform3f(uColor4, colors.r4, colors.g4, colors.b4)
      gl!.uniform3f(uColor5, colors.r5, colors.g5, colors.b5)
      gl!.uniform1f(uColor5Mix, colors.mix5)
      gl!.clear(gl!.COLOR_BUFFER_BIT)
      gl!.drawArrays(gl!.TRIANGLES, 0, 3)
    }

    function frame(ts: number) {
      if ((!visible && pauseWhenOffscreen) || reducedMotion) {
        running = false
        return
      }
      // Keep dt-ish advance even if tab throttles
      if (!lastTs) lastTs = ts
      lastTs = ts
      draw(true)
      raf = requestAnimationFrame(frame)
      running = true
    }

    function startLoop() {
      if (running || reducedMotion) return
      raf = requestAnimationFrame(frame)
      running = true
    }

    function stopLoop() {
      cancelAnimationFrame(raf)
      raf = 0
      running = false
      lastTs = 0
    }

    function setVisible(isVisible: boolean) {
      visible = isVisible
      if (reducedMotion) {
        if (isVisible) draw(false)
        return
      }
      if (pauseWhenOffscreen) {
        if (isVisible) {
          startMouse()
          startLoop()
        } else {
          stopMouse()
          stopLoop()
        }
      } else {
        startMouse()
        startLoop()
      }
    }

    window.addEventListener("resize", onResize)
    resize()

    let cycleTimer = 0
    if (!reducedMotion && autoCycleSeconds > 0 && palettes.length > 1) {
      cycleTimer = window.setInterval(
        cyclePalette,
        autoCycleSeconds * 1000
      )
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setVisible(entry.isIntersecting)
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    // Initial paint — reduced motion gets a single static frame
    if (reducedMotion) {
      const rect = canvas.getBoundingClientRect()
      const onScreen =
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        rect.right > 0 &&
        rect.left < window.innerWidth
      if (onScreen) draw(false)
    } else if (!pauseWhenOffscreen) {
      startMouse()
      startLoop()
    } else {
      // Observer will kick the loop when intersecting; paint once in case we already are
      draw(false)
    }

    return () => {
      stopLoop()
      observer.disconnect()
      stopMouse()
      window.removeEventListener("resize", onResize)
      window.clearTimeout(resizeTimer)
      window.clearInterval(cycleTimer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buffer)
      gl.deleteVertexArray(vao)
    }
  }, [
    autoCycleSeconds,
    initialPalette,
    palettes,
    pauseWhenOffscreen,
    reducedMotion,
  ])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={[
        "pointer-events-none absolute inset-0 z-0 block size-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
