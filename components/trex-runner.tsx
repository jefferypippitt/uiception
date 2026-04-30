"use client"

import { useEffect, useRef, useCallback } from "react"
import { useSound } from "@/hooks/use-sound"
import { useOptionalSoundPreference } from "@/contexts/sound-preference"
import { select008Sound } from "@/lib/select-008"
import { uEscapeScreenOpenSound } from "@/lib/u-escape-screen-open"

const W = 800
const H = 352
const GROUND_Y = H - 72

const GRAVITY = 0.6
const JUMP_VEL = -13
const INITIAL_SPEED = 5
const SPEED_INC = 0.002    // max speed reached ~score 30000 (~8–10 min)
const MAX_SPEED = 40       // ~800px/40 = 20 frames cactus transit — edge of human reaction
const FRAME_MS = 1000 / 60

const SPRITE_URL = "https://trex-runner.com/img/offline-sprite-2x.png"

const TX = 1338, TY = 2, TW = 88, TH = 94
const FR = { JUMP: 0, RUN1: 176, RUN2: 264, CRASH: 440 }

const SPRITE_NATIVE_SCALE = 0.5
const GAME_SCALE = 1.5
const SPRITE_SCALE = SPRITE_NATIVE_SCALE * GAME_SCALE
const scaleSprite = (value: number) => Math.round(value * SPRITE_SCALE)

const DX = 80                   
const DW = scaleSprite(TW)
const DH = scaleSprite(TH)
const REST_Y = GROUND_Y - DH

const CL_SX = 166, CL_SY = 2, CL_W = 92, CL_H = 28
const CL_DW = scaleSprite(CL_W)
const CL_DH = scaleSprite(CL_H)

const SC_SX = 446, SC_SY = 2, SC_UW = 34, SC_H = 70
const LC_SX = 652, LC_SY = 2, LC_UW = 50, LC_H = 100

const HZ_SX = 2, HZ_SY = 104, HZ_SW = 1200, HZ_SH = 26
const HZ_TW = 600
const HZ_TH = scaleSprite(HZ_SH)

type CactusKind = "S" | "L"
interface Cactus { x: number; kind: CactusKind; units: number; w: number; h: number }
interface Cloud  { x: number; y: number }

interface State {
  started: boolean; running: boolean; dead: boolean
  dinoY: number; dinoVY: number; onGround: boolean
  score: number; hiScore: number
  speed: number; frame: number; groundOff: number; legFrame: number
  cacti: Cactus[]; nextCactus: number
  clouds: Cloud[]; nextCloud: number
  runAnimTick: number
  landingBlend: number
}

function makeState(hiScore = 0): State {
  return {
    started: false, running: false, dead: false,
    dinoY: REST_Y, dinoVY: 0, onGround: true,
    score: 0, hiScore,
    speed: INITIAL_SPEED, frame: 0, groundOff: 0, legFrame: 0,
    cacti: [], nextCactus: 90,
    clouds: [], nextCloud: 40,
    runAnimTick: 0,
    landingBlend: 0,
  }
}

function spawnCactus(score = 0): Cactus {
  const kind: CactusKind = Math.random() < 0.5 ? "S" : "L"
  const bigClusterChance = Math.min(0.45, score / 8000)
  const maxUnits = Math.random() < bigClusterChance ? 4 : 3
  const units = Math.ceil(Math.random() * maxUnits)
  const uw = kind === "S" ? SC_UW : LC_UW
  const h  = kind === "S" ? SC_H  : LC_H
  return {
    x: W + 10,
    kind,
    units,
    w: scaleSprite(uw * units),
    h: scaleSprite(h),
  }
}

const SAFE_GAP_FRAMES = 62

function cactusGap(speed: number, score: number): number {
  const progress = score / 5000  
  const minGapPx = Math.round(550 - progress * 250)  
  const maxGapPx = Math.round(1000 - progress * 400)  

  const minFrames = Math.max(SAFE_GAP_FRAMES, Math.round(minGapPx / speed))
  const maxFrames = Math.max(minFrames + 20, Math.round(maxGapPx / speed))

  return minFrames + Math.floor(Math.random() * (maxFrames - minFrames + 1))
}

function drawBg(ctx: CanvasRenderingContext2D, sprite: boolean) {
  ctx.fillStyle = sprite ? "#f7f7f7" : "#181818"
  ctx.fillRect(0, 0, W, H)
}

function drawGround(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  offset: number,
) {
  if (img) {
    const roll = Math.floor(offset % HZ_TW)
    for (let tx = -roll; tx < W + HZ_TW; tx += HZ_TW) {
      ctx.drawImage(img, HZ_SX, HZ_SY, HZ_SW, HZ_SH, tx, GROUND_Y, HZ_TW, HZ_TH)
    }
  } else {
    ctx.fillStyle = "#555"
    ctx.fillRect(0, GROUND_Y, W, 2)
    ctx.fillStyle = "#3a3a3a"
    for (let i = 0; i < W; i += 40) {
      const x = ((i - Math.floor(offset)) % W + W) % W
      ctx.fillRect(x, GROUND_Y + 6, 20, 2)
    }
  }
}

function drawDino(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  y: number,
  onGround: boolean,
  legFrame: number,
  landingBlend: number,
  dead: boolean,
) {
  const offset = dead
    ? FR.CRASH
    : !onGround
      ? FR.JUMP
      : landingBlend > 0
        ? FR.RUN1
        : legFrame % 2 === 0
          ? FR.RUN1
          : FR.RUN2
  if (img) {
    ctx.drawImage(img, TX + offset, TY, TW, TH, Math.round(DX), Math.round(y), DW, DH)
  } else {
    drawDinoFallback(ctx, DX, y, onGround, legFrame, dead)
  }
}

function drawCactus(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  c: Cactus,
) {
  const destY = GROUND_Y - c.h
  if (img) {
    const sx = c.kind === "S" ? SC_SX : LC_SX
    const sy = c.kind === "S" ? SC_SY : LC_SY
    const uw = c.kind === "S" ? SC_UW : LC_UW
    ctx.drawImage(img, sx, sy, uw * c.units, c.kind === "S" ? SC_H : LC_H, c.x, destY, c.w, c.h)
  } else {
    ctx.fillStyle = "#535353"
    ctx.fillRect(c.x + c.w / 2 - 4, destY, 8, c.h)
    ctx.fillRect(c.x, GROUND_Y - c.h * 0.65, c.w, 7)
    ctx.fillRect(c.x, GROUND_Y - c.h * 0.65 - 16, 8, 18)
    ctx.fillRect(c.x + c.w - 8, GROUND_Y - c.h * 0.65 - 10, 8, 12)
  }
}

function drawCloud(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  cl: Cloud,
) {
  if (img) {
    ctx.drawImage(img, CL_SX, CL_SY, CL_W, CL_H, cl.x, cl.y, CL_DW, CL_DH)
  } else {
    ctx.fillStyle = "#3a3a3a"
    ctx.fillRect(cl.x, cl.y, 46, 10)
    ctx.fillRect(cl.x + 10, cl.y - 8, 26, 10)
  }
}

function drawScore(
  ctx: CanvasRenderingContext2D,
  score: number,
  hi: number,
  sprite: boolean,
) {
  ctx.font = "bold 13px 'Courier New', Courier, monospace"
  ctx.fillStyle = sprite ? "#aaaaaa" : "#858585"
  if (hi > 0) ctx.fillText(`HI ${String(hi).padStart(5, "0")}`, W - 178, 26)
  ctx.fillStyle = sprite ? "#535353" : "#cccccc"
  ctx.fillText(String(Math.floor(score)).padStart(5, "0"), W - 60, 26)
}

function drawHUD(
  ctx: CanvasRenderingContext2D,
  fps: number,
  speed: number,
  sprite: boolean,
) {
  const ratio = Math.min(1, (speed - INITIAL_SPEED) / (MAX_SPEED - INITIAL_SPEED))
  ctx.font = "bold 11px 'Courier New', Courier, monospace"

  ctx.fillStyle = sprite ? "#aaaaaa" : "#666666"
  ctx.fillText(`FPS ${String(fps).padStart(2)}`, 12, 18)

  ctx.fillText("SPD", 12, 34)

  const barX = 46, barY = 25, barW = 72, barH = 7
  const filled = Math.round(barW * ratio)

  ctx.fillStyle = sprite ? "#dddddd" : "#2a2a2a"
  ctx.fillRect(barX, barY, barW, barH)

  const r = Math.min(255, Math.round(ratio * 2 * 255))
  const g = Math.min(255, Math.round((1 - ratio) * 1.6 * 255))
  ctx.fillStyle = sprite ? `rgb(${r},${g},0)` : `rgb(${r},${g},50)`
  ctx.fillRect(barX, barY, filled, barH)

  ctx.fillStyle = sprite ? "#535353" : "#888888"
  ctx.fillText(speed.toFixed(1), barX + barW + 5, 34)
}

function drawPrompt(ctx: CanvasRenderingContext2D, text: string, sprite: boolean) {
  ctx.fillStyle = sprite ? "#535353" : "#cccccc"
  ctx.font = "bold 14px 'Courier New', Courier, monospace"
  ctx.textAlign = "center"
  ctx.fillText(text, W / 2, H / 2)
  ctx.textAlign = "left"
}

function drawGameOver(ctx: CanvasRenderingContext2D, sprite: boolean) {
  ctx.fillStyle = sprite ? "#535353" : "#cccccc"
  ctx.font = "bold 18px 'Courier New', Courier, monospace"
  ctx.textAlign = "center"
  ctx.fillText("GAME OVER", W / 2, H / 2 - 18)
  ctx.font = "13px 'Courier New', Courier, monospace"
  ctx.fillStyle = sprite ? "#888" : "#858585"
  ctx.fillText("Press SPACE or tap to restart", W / 2, H / 2 + 10)
  ctx.textAlign = "left"
}

const S = 2
function drawDinoFallback(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  onGround: boolean, legFrame: number, dead: boolean,
) {
  ctx.fillStyle = "#535353"
  ctx.fillRect(x + 6*S, y,         5*S, 2*S)   
  ctx.fillRect(x + 5*S, y + 1*S,   8*S, 7*S)   
  ctx.fillRect(x +11*S, y + 7*S,   3*S, 1*S)   
  ctx.fillRect(x + 3*S, y + 5*S,   5*S, 4*S)   
  ctx.fillRect(x + 0*S, y + 7*S,  13*S, 6*S)   
  ctx.fillRect(x + 1*S, y +12*S,  11*S, 2*S)
  ctx.fillRect(x + 2*S, y +13*S,   8*S, 1*S)
  ctx.fillRect(x + 0*S, y + 8*S,   2*S, 5*S)   
  ctx.fillRect(x + 7*S, y + 9*S,   4*S, 2*S)   
  ctx.fillRect(x +10*S, y +10*S,   2*S, 2*S)
  ctx.fillStyle = "#1e1e1e"
  ctx.fillRect(x +10*S, y + 2*S,   2*S, 2*S)   
  if (dead) {
    ctx.fillStyle = "#535353"
    ctx.fillRect(x + 9*S, y + 1*S, 4*S, 4*S)
    ctx.fillStyle = "#1e1e1e"
    ctx.fillRect(x + 9*S, y + 1*S, 2*S, 2*S)
    ctx.fillRect(x +11*S, y + 3*S, 2*S, 2*S)
    ctx.fillRect(x +11*S, y + 1*S, 2*S, 2*S)
    ctx.fillRect(x + 9*S, y + 3*S, 2*S, 2*S)
  }
  ctx.fillStyle = "#535353"
  if (onGround && !dead) {
    if (legFrame % 2 === 0) {
      ctx.fillRect(x + 3*S, y +15*S, 3*S, 6*S)
      ctx.fillRect(x + 2*S, y +20*S, 5*S, 2*S)
      ctx.fillRect(x + 7*S, y +15*S, 3*S, 3*S)
      ctx.fillRect(x + 6*S, y +17*S, 5*S, 2*S)
    } else {
      ctx.fillRect(x + 3*S, y +15*S, 3*S, 3*S)
      ctx.fillRect(x + 3*S, y +17*S, 4*S, 2*S)
      ctx.fillRect(x + 7*S, y +15*S, 3*S, 6*S)
      ctx.fillRect(x + 7*S, y +20*S, 5*S, 2*S)
    }
  } else {
    ctx.fillRect(x + 3*S, y +15*S, 3*S, 5*S)
    ctx.fillRect(x + 2*S, y +19*S, 5*S, 2*S)
    ctx.fillRect(x + 7*S, y +15*S, 3*S, 5*S)
    ctx.fillRect(x + 7*S, y +19*S, 5*S, 2*S)
  }
}

function hitTest(dinoY: number, c: Cactus): boolean {
  const PAD = 10
  return (
    DX + DW - PAD > c.x + PAD &&
    DX + PAD < c.x + c.w - PAD &&
    dinoY + DH - PAD > GROUND_Y - c.h &&
    dinoY + PAD < GROUND_Y
  )
}

export default function TrexRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef  = useRef<State>(makeState())
  const rafRef    = useRef<number>(0)
  const imgRef    = useRef<HTMLImageElement | null>(null)
  const lastTsRef = useRef<number>(0)
  const fpsTsRef  = useRef<number[]>([])

  const soundEnabled = useOptionalSoundPreference()
  const [playJumpSound] = useSound(select008Sound, { volume: 0.35, interrupt: true, soundEnabled })
  const [playCrashSound] = useSound(uEscapeScreenOpenSound, { volume: 0.5, interrupt: true, soundEnabled })
  const playCrashRef = useRef(playCrashSound)
  playCrashRef.current = playCrashSound

  const jump = useCallback(() => {
    const s = stateRef.current
    if (s.dead) {
      stateRef.current = { ...makeState(s.hiScore), started: true, running: true }
      return
    }
    if (!s.started) { s.started = true; s.running = true; return }
    if (s.onGround) {
      playJumpSound()
      s.dinoVY = JUMP_VEL
      s.onGround = false
    }
  }, [playJumpSound])

  useEffect(() => {
    const img = new Image()
    img.onload = () => { imgRef.current = img }
    img.src = SPRITE_URL
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    ctx.imageSmoothingEnabled = false

    function tick(ts: number) {
      const s   = stateRef.current
      const img = imgRef.current
      const sp  = img?.complete ?? false  
      const prevTs = lastTsRef.current || ts
      const dtMs = Math.min(100, ts - prevTs)
      const frameStep = dtMs / FRAME_MS
      lastTsRef.current = ts

      fpsTsRef.current.push(ts)
      while (fpsTsRef.current.length > 0 && ts - fpsTsRef.current[0] > 1000) {
        fpsTsRef.current.shift()
      }
      const fps = fpsTsRef.current.length

      drawBg(ctx, sp)

      if (!s.started) {
        drawGround(ctx, img, 0)
        drawDino(ctx, img, REST_Y, true, 0, 0, false)
        drawPrompt(ctx, "Press SPACE or tap to start", sp)
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      if (s.running) {
        s.frame++
        s.score += s.speed * 0.08 * frameStep
        s.speed = Math.min(MAX_SPEED, s.speed + SPEED_INC * frameStep)
        s.groundOff = (s.groundOff + s.speed * frameStep) % HZ_TW

        if (s.onGround) {
          s.runAnimTick += frameStep
          if (s.runAnimTick >= 5) {
            s.legFrame++
            s.runAnimTick = 0
          }
        } else {
          s.runAnimTick = 0
        }

        s.dinoVY += GRAVITY * frameStep
        s.dinoY  += s.dinoVY * frameStep
        if (s.dinoY >= REST_Y) {
          const wasAirborne = !s.onGround
          s.dinoY = REST_Y
          s.dinoVY = 0
          s.onGround = true
          if (wasAirborne) {
            s.landingBlend = 4
            s.legFrame = 0
            s.runAnimTick = 0
          }
        }
        if (s.landingBlend > 0) {
          s.landingBlend = Math.max(0, s.landingBlend - frameStep)
        }

        s.nextCloud -= frameStep
        if (s.nextCloud <= 0) {
          s.clouds.push({ x: W + 20, y: 40 + Math.random() * 80 })
          s.nextCloud = 60 + Math.floor(Math.random() * 120)
        }
        s.clouds = s.clouds
          .map(c => ({ ...c, x: c.x - s.speed * 0.3 * frameStep }))
          .filter(c => c.x + CL_DW > 0)

        s.nextCactus -= frameStep
        if (s.nextCactus <= 0) {
          s.cacti.push(spawnCactus(s.score))
          s.nextCactus = cactusGap(s.speed, s.score)
        }
        s.cacti = s.cacti
          .map(c => ({ ...c, x: c.x - s.speed * frameStep }))
          .filter(c => c.x + c.w > 0)

        if (s.cacti.some(c => hitTest(s.dinoY, c))) {
          playCrashRef.current()
          s.running = false
          s.dead    = true
          if (s.score > s.hiScore) s.hiScore = Math.floor(s.score)
        }
      }

      s.clouds.forEach(c  => drawCloud(ctx, img, c))
      drawGround(ctx, img, s.groundOff)
      s.cacti.forEach(c   => drawCactus(ctx, img, c))
      drawDino(ctx, img, s.dinoY, s.onGround, s.legFrame, s.landingBlend, s.dead)
      drawScore(ctx, s.score, s.hiScore, sp)
      drawHUD(ctx, fps, s.speed, sp)
      if (s.dead) drawGameOver(ctx, sp)

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); jump() }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [jump])

  return (
    <div className="h-96 overflow-hidden">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={jump}
        className="h-full w-full cursor-pointer"
        style={{
          imageRendering: "pixelated",
          touchAction: "manipulation",
        }}
        aria-label="Dino runner — press Space or tap to play"
      />
    </div>
  )
}
