import { useLayoutEffect, useRef } from "react"

const CARD_MAX = 156
const CARD_MIN = 72
/** Clear space, in px, kept between the cards and the centered heading. */
const GAP = 16
/** Widest the heading block may grow, in px. */
const TEXT_MAX = 448
/** Largest orbit radius, in px. */
const RADIUS_MAX = 420
/** How far the orbit may stretch into a tall oval on narrow screens before the heading narrows instead. */
const STRETCH_MAX = 1.35
/** Space between neighboring card centers along the orbit, in card widths. */
const SPACING_MIN = 1.5
/** The section's vertical padding (py-16), counted against the viewport height. */
const SECTION_PADDING = 128
/** Smallest share of the viewport height a card may shrink to on short screens. */
const CARD_VIEW_SHARE = 0.16

function clamp(min: number, max: number, value: number) {
  return Math.min(max, Math.max(min, value))
}

/**
 * Sizes the orbit so the heading always sits inside it and the whole section
 * fits one viewport. It prefers a true circle just big enough to clear the
 * heading block (plus half a card and a gap). When that circle is taller than
 * the viewport allows, it flattens into a wider oval. On narrow screens, where
 * the circle won't fit the width, it stretches into a tall oval, and past
 * STRETCH_MAX the heading narrows instead.
 */
function measure(stage: HTMLElement, text: HTMLElement, count: number) {
  const width = stage.clientWidth
  const viewHeight = window.innerHeight
  const card = clamp(
    CARD_MIN,
    CARD_MAX,
    Math.min(width * 0.15, viewHeight * CARD_VIEW_SHARE)
  )
  const reach = card / 2 + GAP
  const maxR = Math.max(card, Math.min(width / 2 - card * 0.2, RADIUS_MAX))
  const minR = (count * card * SPACING_MIN) / (Math.PI * 2)
  // Tallest radius that keeps the stage (orbit and cards) in view.
  const maxRy = (viewHeight - SECTION_PADDING - card - 16) / 2

  let textWidth = clamp(140, TEXT_MAX, 2 * (maxR * 0.85 - reach))
  let rx = maxR
  let ry = maxR
  for (let attempt = 0; attempt < 10; attempt++) {
    text.style.width = `${textWidth}px`
    const halfW = textWidth / 2 + reach
    const halfH = text.offsetHeight / 2 + reach
    const circle = Math.max(Math.hypot(halfW, halfH), minR)

    ry = Math.max(Math.min(circle, maxRy), halfH * 1.05)
    rx =
      ry >= circle
        ? circle
        : Math.max(ry, halfW / Math.sqrt(1 - (halfH / ry) ** 2))
    if (rx <= maxR) break

    rx = maxR
    const across = Math.min(0.95, halfW / rx)
    ry = halfH / Math.sqrt(1 - across ** 2)
    if (ry <= rx * STRETCH_MAX || textWidth <= 140) break
    textWidth = Math.max(140, textWidth - 24)
  }

  const cy = ry + card / 2 + 8
  stage.style.height = `${cy + ry + card / 2 + 8}px`
  stage.style.setProperty("--tsv3-cy", `${cy}px`)

  return { card, rx, ry, cy }
}

/** Lays the cards out around the heading, starting at the front (bottom). */
export function useTeamOrbit(count: number) {
  const stageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const stage = stageRef.current
    const text = textRef.current
    if (!stage || !text || count < 1) return

    const cards = [...stage.querySelectorAll<HTMLElement>("[data-tsv3-card]")]
    if (cards.length === 0) return

    const layout = () => {
      const { card, rx, ry, cy } = measure(stage, text, count)
      cards.forEach((cardEl, index) => {
        const angle = (index / count) * Math.PI * 2
        const x = Math.sin(angle) * rx
        const y = cy + Math.cos(angle) * ry

        cardEl.style.width = `${card}px`
        cardEl.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0)`
        cardEl.style.visibility = "visible"
      })
    }

    let lastWidth = stage.clientWidth
    let lastTextHeight = text.offsetHeight
    let lastViewHeight = window.innerHeight
    const relayout = () => {
      // Writing the stage height re-triggers the observer; only re-measure when
      // the width, the viewport height, or the heading's wrapped height moved.
      if (
        stage.clientWidth === lastWidth &&
        text.offsetHeight === lastTextHeight &&
        window.innerHeight === lastViewHeight
      ) {
        return
      }
      layout()
      lastWidth = stage.clientWidth
      lastTextHeight = text.offsetHeight
      lastViewHeight = window.innerHeight
    }
    const resizeObserver = new ResizeObserver(relayout)
    resizeObserver.observe(stage)
    resizeObserver.observe(text)
    window.addEventListener("resize", relayout)

    layout()
    lastTextHeight = text.offsetHeight

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", relayout)
    }
  }, [count])

  return { stageRef, textRef }
}
