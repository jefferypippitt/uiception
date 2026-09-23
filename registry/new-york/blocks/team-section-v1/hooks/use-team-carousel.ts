import { useCallback, useLayoutEffect, useRef, useState } from "react"

const CARD_MAX = 240
const CARD_MIN = 168
/**
 * Distance between card centers, as a share of the card width: the first hop
 * clears the flat center card, later hops only clear foreshortened side cards.
 */
const STEP_RATIO = 0.97
const FAR_STEP_RATIO = 0.9
const SIDE_SCALE = 0.88
/** Degrees each side card turns toward the center (3D, around its vertical axis). */
const TILT = 18
const PERSPECTIVE = 900
/** Release glide that settles a drag onto the nearest card. */
const SNAP_MS = 320

function mod(value: number, count: number) {
  return ((value % count) + count) % count
}

function clamp(min: number, max: number, value: number) {
  return Math.min(max, Math.max(min, value))
}

function wrapDelta(index: number, progress: number, count: number) {
  let delta = index - progress
  delta %= count
  if (delta > count / 2) delta -= count
  if (delta < -count / 2) delta += count
  return delta
}

/** Horizontal offset, in card widths, of a card `delta` slots from the center. */
function offsetOf(delta: number) {
  const distance = Math.abs(delta)
  const slots =
    Math.min(distance, 1) * STEP_RATIO +
    Math.max(distance - 1, 0) * FAR_STEP_RATIO
  return Math.sign(delta) * slots
}

function measure(stage: HTMLElement) {
  const card = clamp(CARD_MIN, CARD_MAX, stage.clientWidth * 0.26)
  return { card, step: card * STEP_RATIO }
}

export function useTeamCarousel(count: number) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const api = useRef({
    goTo: (() => {}) as (index: number) => void,
    onCardClick: (() => {}) as (index: number) => void,
  })

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage || count < 1) return

    const cards = [...stage.querySelectorAll<HTMLElement>("[data-tsv1-card]")]
    if (cards.length === 0) return

    const progress = { current: 0 }
    const metrics = { current: measure(stage) }
    const reduce = {
      current: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    }
    const active = { current: 0 }
    const suppressClick = { current: false }
    const drag = {
      pointerId: -1,
      startX: 0,
      startProgress: 0,
      lastX: 0,
      lastTime: 0,
      velocity: 0,
      moved: false,
      pressIndex: -1,
    }
    let snap = 0
    let frame = 0
    let pendingX = 0
    let pendingTime = 0
    let suppressTimer = 0

    const syncActive = () => {
      const next = mod(Math.round(progress.current), count)
      if (next === active.current) return
      active.current = next
      setActiveIndex(next)
    }

    const layout = () => {
      const { card } = metrics.current
      stage.style.setProperty("--tsv1-card", `${card}px`)
      cards.forEach((cardEl, index) => {
        const delta = wrapDelta(index, progress.current, count)
        const distance = Math.abs(delta)
        const scale = 1 + (SIDE_SCALE - 1) * Math.min(distance, 1)
        const turn = clamp(-1, 1, delta) * TILT
        const captionOpacity = clamp(0, 1, 1 - distance / 0.5)

        cardEl.style.width = `${card}px`
        cardEl.style.transformOrigin = `50% ${card / 2}px`
        cardEl.style.transform = `translate3d(calc(-50% + ${offsetOf(delta) * card}px), 0, 0) perspective(${PERSPECTIVE}px) rotateY(${-turn}deg) scale(${scale})`
        cardEl.style.zIndex = String(Math.round(80 - distance * 24))
        cardEl.style.visibility =
          distance > count / 2 - 0.05 ? "hidden" : "visible"

        const caption = cardEl.querySelector<HTMLElement>("[data-tsv1-caption]")
        const hit = cardEl.querySelector<HTMLElement>("[data-tsv1-hit]")
        if (caption) {
          caption.style.opacity = String(captionOpacity)
          caption.setAttribute(
            "aria-hidden",
            captionOpacity > 0.4 ? "false" : "true"
          )
        }
        if (hit) hit.style.pointerEvents = distance < 0.4 ? "none" : "auto"
      })
      syncActive()
    }

    const animateTo = (target: number) => {
      cancelAnimationFrame(snap)
      const from = progress.current
      if (reduce.current || Math.abs(target - from) < 0.001) {
        progress.current = target
        layout()
        return
      }
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / SNAP_MS)
        const eased = 1 - (1 - t) ** 3
        progress.current = from + (target - from) * eased
        layout()
        if (t < 1) snap = requestAnimationFrame(tick)
      }
      snap = requestAnimationFrame(tick)
    }

    const goTo = (index: number) => {
      const normalized = mod(index, count)
      const currentMod = mod(progress.current, count)
      let delta = normalized - currentMod
      if (delta > count / 2) delta -= count
      if (delta < -count / 2) delta += count
      animateTo(progress.current + delta)
    }

    api.current.goTo = goTo
    api.current.onCardClick = (index: number) => {
      if (suppressClick.current) return
      goTo(index)
    }

    const applyPointer = (clientX: number, now: number) => {
      const dx = clientX - drag.startX
      if (Math.abs(dx) > 6) drag.moved = true
      const dt = now - drag.lastTime
      if (dt > 0) {
        const instant = (clientX - drag.lastX) / dt
        drag.velocity = drag.velocity * 0.65 + instant * 0.35
      }
      drag.lastX = clientX
      drag.lastTime = now
      progress.current = drag.startProgress - dx / metrics.current.step
      layout()
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      const target = event.target
      cancelAnimationFrame(snap)
      const card =
        target instanceof Element ? target.closest("[data-tsv1-card]") : null
      drag.pressIndex = card ? Number(card.getAttribute("data-index")) : -1
      drag.pointerId = event.pointerId
      drag.startX = event.clientX
      drag.startProgress = progress.current
      drag.lastX = event.clientX
      drag.lastTime = performance.now()
      drag.velocity = 0
      drag.moved = false
      try {
        stage.setPointerCapture(event.pointerId)
      } catch {
        // Already released, or an untrusted pointer.
      }
      stage.dataset.dragging = "true"
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== drag.pointerId) return
      pendingX = event.clientX
      pendingTime = performance.now()
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        if (drag.pointerId === -1) return
        applyPointer(pendingX, pendingTime)
      })
    }

    const endDrag = (event: PointerEvent) => {
      if (event.pointerId !== drag.pointerId) return
      if (frame) {
        cancelAnimationFrame(frame)
        frame = 0
        applyPointer(event.clientX, performance.now())
      }
      drag.pointerId = -1
      delete stage.dataset.dragging
      if (stage.hasPointerCapture(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId)
      }
      if (!drag.moved) {
        if (drag.pressIndex >= 0) goTo(drag.pressIndex)
        return
      }
      suppressClick.current = true
      window.clearTimeout(suppressTimer)
      suppressTimer = window.setTimeout(() => {
        suppressClick.current = false
      }, 0)
      const flickSlides = clamp(
        -2,
        2,
        (-drag.velocity * 200) / metrics.current.step
      )
      animateTo(Math.round(progress.current + flickSlides))
    }

    const resizeObserver = new ResizeObserver(() => {
      metrics.current = measure(stage)
      layout()
    })
    resizeObserver.observe(stage)
    stage.addEventListener("pointerdown", onPointerDown)
    stage.addEventListener("pointermove", onPointerMove)
    stage.addEventListener("pointerup", endDrag)
    stage.addEventListener("pointercancel", endDrag)

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onMotion = () => {
      reduce.current = motionQuery.matches
    }
    motionQuery.addEventListener("change", onMotion)

    layout()

    return () => {
      cancelAnimationFrame(snap)
      if (frame) cancelAnimationFrame(frame)
      window.clearTimeout(suppressTimer)
      resizeObserver.disconnect()
      stage.removeEventListener("pointerdown", onPointerDown)
      stage.removeEventListener("pointermove", onPointerMove)
      stage.removeEventListener("pointerup", endDrag)
      stage.removeEventListener("pointercancel", endDrag)
      motionQuery.removeEventListener("change", onMotion)
    }
  }, [count])

  const goTo = useCallback((index: number) => {
    api.current.goTo(index)
  }, [])

  const onCardClick = useCallback((index: number) => {
    api.current.onCardClick(index)
  }, [])

  return { stageRef, activeIndex, goTo, onCardClick }
}
