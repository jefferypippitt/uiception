export interface StirInput {
  active: boolean
  from: [number, number]
  to: [number, number]
  velocity: [number, number]
  consumeStep(): void
  dispose(): void
}

/**
 * Stir input bound to the card wrapper (not the canvas), so Select/Button
 * keep normal clicks. Pointer splat only follows real movement over the card —
 * no synthetic idle squirts.
 */
export function installStirInput(target: HTMLElement): StirInput {
  let hovering = false
  let from: [number, number] = [0.5, 0.5]
  let to: [number, number] = [0.5, 0.5]
  let velocity: [number, number] = [0, 0]
  let lastTime = 0
  let decay = 0

  const rectContains = (event: PointerEvent) => {
    const r = target.getBoundingClientRect()
    return (
      event.clientX >= r.left &&
      event.clientX <= r.right &&
      event.clientY >= r.top &&
      event.clientY <= r.bottom
    )
  }

  const point = (event: PointerEvent): [number, number] => {
    const r = target.getBoundingClientRect()
    return [
      Math.max(0, Math.min(1, (event.clientX - r.left) / Math.max(1, r.width))),
      Math.max(
        0,
        Math.min(1, 1 - (event.clientY - r.top) / Math.max(1, r.height))
      ),
    ]
  }

  const clear = () => {
    hovering = false
    lastTime = 0
    decay = 0
    velocity = [0, 0]
  }

  const enter = (event: PointerEvent) => {
    if (!event.isPrimary) return
    hovering = true
    from = to = point(event)
    lastTime = event.timeStamp
    velocity = [0, 0]
  }

  const move = (event: PointerEvent) => {
    if (!event.isPrimary) return
    if (!rectContains(event)) {
      if (hovering || decay > 0) clear()
      return
    }
    hovering = true
    const next = point(event)
    if (lastTime === 0) {
      from = to = next
      lastTime = event.timeStamp
      return
    }
    const dt = Math.max(
      0.004,
      Math.min(0.05, (event.timeStamp - lastTime) / 1000)
    )
    from = to
    to = next
    velocity = [
      Math.max(-2.5, Math.min(2.5, (to[0] - from[0]) / dt)),
      Math.max(-2.5, Math.min(2.5, (to[1] - from[1]) / dt)),
    ]
    lastTime = event.timeStamp
    decay = 8
  }

  const leave = (event: PointerEvent) => {
    if (!event.isPrimary) return
    clear()
  }

  // Window listener only clears stale hover if pointerleave is missed
  // (iframe chrome, portaled menus). It never starts a stir off-card.
  const onGlobalMove = (event: PointerEvent) => {
    if (!event.isPrimary) return
    if ((hovering || decay > 0) && !rectContains(event)) clear()
  }

  target.addEventListener("pointerenter", enter)
  target.addEventListener("pointermove", move)
  target.addEventListener("pointerleave", leave)
  target.addEventListener("pointercancel", leave)
  window.addEventListener("pointermove", onGlobalMove, { passive: true })
  window.addEventListener("blur", clear)

  return {
    get active() {
      return hovering && decay > 0
    },
    get from() {
      return from
    },
    get to() {
      return to
    },
    get velocity() {
      return velocity
    },
    consumeStep() {
      from = to
      if (decay > 0) {
        if (!hovering) {
          velocity = [velocity[0] * 0.45, velocity[1] * 0.45]
        }
        decay--
      }
    },
    dispose() {
      target.removeEventListener("pointerenter", enter)
      target.removeEventListener("pointermove", move)
      target.removeEventListener("pointerleave", leave)
      target.removeEventListener("pointercancel", leave)
      window.removeEventListener("pointermove", onGlobalMove)
      window.removeEventListener("blur", clear)
      clear()
    },
  }
}
