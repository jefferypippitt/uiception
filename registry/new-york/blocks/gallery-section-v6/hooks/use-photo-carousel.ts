import { useCallback, useId, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"

const CARD_MAX = 365
const STEP_RATIO = 196 / 365
const CENTER_SCALE = 0.95
const SIDE_SCALE = 0.75
const RADIUS_RATIO = 56 / 365
/** Horizontal blur, in px, for each px/ms of travel. Only applied while a slide is moving. */
const BLUR_GAIN = 8
const BLUR_MAX = 4
/** Entrance: the cards fade in as one squared-up pile, then expand sideways into the strip. */
const DECK_SCALE = 0.82

function mod(value: number, count: number) {
  return ((value % count) + count) % count
}

function wrapDelta(index: number, progress: number, count: number) {
  let delta = index - progress
  delta %= count
  if (delta > count / 2) delta -= count
  if (delta < -count / 2) delta += count
  return delta
}

function measure(stage: HTMLElement) {
  const card = Math.min(CARD_MAX, Math.max(210, stage.clientWidth * 0.34))
  return { card, step: card * STEP_RATIO }
}

export function usePhotoCarousel(count: number) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const filterId = `gsv6-${useId().replace(/:/g, "")}`
  const api = useRef({
    goTo: (_index: number) => {},
    onCardClick: (_index: number) => {},
  })

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage || count < 1) return

    const cards = [
      ...stage.querySelectorAll<HTMLElement>("[data-gsv6-card]"),
    ]
    const blurEl = stage.querySelector("feGaussianBlur")
    if (cards.length === 0 || !blurEl) return

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
    let lastProgress = 0
    let lastTime = performance.now()
    let primed = false
    let laidCard = -1
    let tween: gsap.core.Tween | null = null
    let frame = 0
    let pendingX = 0
    let pendingTime = 0
    let suppressTimer = 0
    let introPending = !reduce.current
    let intro: gsap.core.Timeline | null = null
    let captionFade: gsap.core.Tween | null = null

    const setBlur = (amount: number) => {
      const photos = stage.querySelectorAll<HTMLElement>("[data-gsv6-photo]")
      if (amount < 0.6 || reduce.current) {
        blurEl.setAttribute("stdDeviation", "0 0")
        photos.forEach((photo) => {
          photo.style.filter = "none"
          photo.style.willChange = "auto"
        })
        return
      }
      blurEl.setAttribute("stdDeviation", `${amount} 0`)
      const filter = `url(#${filterId})`
      photos.forEach((photo) => {
        photo.style.filter = filter
        photo.style.willChange = "filter"
      })
    }

    const syncActive = () => {
      const next = mod(Math.round(progress.current), count)
      if (next === active.current) return
      active.current = next
      setActiveIndex(next)
    }

    const layout = (forcedBlur?: number) => {
      const now = performance.now()
      const { card, step } = metrics.current
      const direction = progress.current - lastProgress
      let blur = forcedBlur ?? 0
      if (forcedBlur == null && primed && !reduce.current) {
        const dt = Math.min(48, Math.max(8, now - lastTime))
        const speed = (Math.abs(direction) * step) / dt
        blur = Math.min(BLUR_MAX, speed * BLUR_GAIN)
      }
      primed = true
      lastProgress = progress.current
      lastTime = now

      const sizeChanged = card !== laidCard
      if (sizeChanged) laidCard = card
      const radius = card * RADIUS_RATIO
      const dark = document.documentElement.classList.contains("dark")
      cards.forEach((cardEl, index) => {
        const delta = wrapDelta(index, progress.current, count)
        const distance = Math.abs(delta)
        const t = Math.min(distance, 1)
        const scale = gsap.utils.interpolate(CENTER_SCALE, SIDE_SCALE, t)
        const shadowY = gsap.utils.interpolate(28, 6, t)
        const shadowBlur = gsap.utils.interpolate(80, 18, t)
        const shadowAlpha = gsap.utils.interpolate(0.11, 0.035, t)
        const captionOpacity = gsap.utils.clamp(0, 1, 1 - distance / 0.38)
        const prefer =
          direction > 0.0001 ? 1 : direction < -0.0001 ? -1 : 0
        const zIndex =
          Math.round(80 - distance * 24) +
          (Math.sign(delta) === prefer ? 4 : 0)

        if (sizeChanged) {
          cardEl.style.width = `${card}px`
          cardEl.style.height = `${card}px`
          cardEl.style.borderRadius = `${radius}px`
        }
        const lift = dark ? Math.min(0.55, shadowAlpha * 2.8) : shadowAlpha
        cardEl.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0,0,0,${lift})`

        gsap.set(cardEl, {
          xPercent: -50,
          yPercent: -50,
          x: delta * step,
          scale,
          zIndex,
          autoAlpha: distance > count / 2 - 0.05 ? 0 : 1,
          force3D: true,
        })

        const caption = cardEl.querySelector<HTMLElement>("[data-gsv6-caption]")
        const scrim = cardEl.querySelector<HTMLElement>("[data-gsv6-scrim]")
        const hit = cardEl.querySelector<HTMLElement>("[data-gsv6-hit]")
        if (caption) {
          caption.style.opacity = String(captionOpacity)
          caption.setAttribute(
            "aria-hidden",
            captionOpacity > 0.4 ? "false" : "true",
          )
        }
        if (scrim) scrim.style.opacity = String(captionOpacity)
        if (hit) {
          const resting = distance < 0.4
          hit.style.pointerEvents = resting ? "none" : "auto"
        }
      })

      setBlur(blur)
      syncActive()
    }

    const introBusy = () => introPending || intro !== null

    const overlays = () =>
      stage.querySelectorAll<HTMLElement>(
        "[data-gsv6-caption], [data-gsv6-scrim]",
      )

    const deltaOf = (el: Element) =>
      wrapDelta(Number(el.getAttribute("data-index")), progress.current, count)

    /** Intro start: every card sits hidden at the center, squared onto one pile. */
    const setDeck = () => {
      cards.forEach((cardEl) => {
        gsap.set(cardEl, {
          x: 0,
          scale: DECK_SCALE,
          autoAlpha: 0,
        })
      })
      overlays().forEach((el) => {
        el.style.opacity = "0"
      })
    }

    const finishIntro = () => {
      intro = null
      layout(0)
      captionFade = gsap.from(overlays(), {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          captionFade = null
        },
      })
    }

    const playIntro = () => {
      if (!introPending) return
      introPending = false
      const { step } = metrics.current
      const alphaOf = (el: Element) =>
        Math.abs(deltaOf(el)) > count / 2 - 0.05 ? 0 : 1

      intro = gsap.timeline({ onComplete: finishIntro })

      // The pile fades in all at once (layout already put the center card on top).
      intro.to(cards, {
        autoAlpha: (_i: number, el: Element) => alphaOf(el),
        duration: 0.4,
        ease: "power2.out",
      })

      // Then, after a beat, the pile slides open into the strip.
      intro.to(
        cards,
        {
          x: (_i: number, el: Element) => deltaOf(el) * step,
          scale: (_i: number, el: Element) =>
            gsap.utils.interpolate(
              CENTER_SCALE,
              SIDE_SCALE,
              Math.min(Math.abs(deltaOf(el)), 1),
            ),
          duration: 1.1,
          ease: "expo.inOut",
        },
        "+=0.15",
      )
    }

    const animateTo = (target: number) => {
      tween?.kill()
      captionFade?.progress(1)
      if (
        reduce.current ||
        Math.abs(target - progress.current) < 0.001
      ) {
        progress.current = target
        layout(0)
        return
      }
      const distance = Math.abs(target - progress.current)
      const proxy = { value: progress.current }
      tween = gsap.to(proxy, {
        value: target,
        duration: Math.min(1.05, 0.72 + distance * 0.06),
        ease: "power3.inOut",
        onUpdate: () => {
          progress.current = proxy.value
          layout()
        },
        onComplete: () => {
          progress.current = target
          layout(0)
        },
      })
    }

    const goTo = (index: number) => {
      if (introBusy()) return
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
      if (event.button !== 0 || introBusy()) return
      const target = event.target
      if (
        target instanceof Element &&
        target.closest("[data-gsv6-cta], [data-gsv6-dot]")
      ) {
        return
      }
      tween?.kill()
      captionFade?.progress(1)
      const card =
        target instanceof Element
          ? target.closest("[data-gsv6-card]")
          : null
      drag.pressIndex = card
        ? Number(card.getAttribute("data-index"))
        : -1
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
      const flickSlides = gsap.utils.clamp(
        -2,
        2,
        (-drag.velocity * 200) / metrics.current.step,
      )
      animateTo(Math.round(progress.current + flickSlides))
    }

    const onResize = () => {
      metrics.current = measure(stage)
      if (intro) return
      layout(0)
      if (introPending) setDeck()
    }

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(stage)
    const themeObserver = new MutationObserver(() => {
      if (intro) return
      layout(0)
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    stage.addEventListener("pointerdown", onPointerDown)
    stage.addEventListener("pointermove", onPointerMove)
    stage.addEventListener("pointerup", endDrag)
    stage.addEventListener("pointercancel", endDrag)

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onMotion = () => {
      reduce.current = motionQuery.matches
      if (reduce.current) {
        tween?.kill()
        introPending = false
        intro?.progress(1)
        layout(0)
      }
    }
    motionQuery.addEventListener("change", onMotion)

    layout(0)

    let introObserver: IntersectionObserver | null = null
    if (introPending) {
      setDeck()
      introObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return
          introObserver?.disconnect()
          playIntro()
        },
        { threshold: 0.45 },
      )
      introObserver.observe(stage)
    }

    return () => {
      tween?.kill()
      intro?.kill()
      captionFade?.kill()
      introObserver?.disconnect()
      window.clearTimeout(suppressTimer)
      if (frame) cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      stage.removeEventListener("pointerdown", onPointerDown)
      stage.removeEventListener("pointermove", onPointerMove)
      stage.removeEventListener("pointerup", endDrag)
      stage.removeEventListener("pointercancel", endDrag)
      motionQuery.removeEventListener("change", onMotion)
    }
  }, [count, filterId])

  const goTo = useCallback((index: number) => {
    api.current.goTo(index)
  }, [])

  const onCardClick = useCallback((index: number) => {
    api.current.onCardClick(index)
  }, [])

  return { stageRef, activeIndex, filterId, goTo, onCardClick }
}
