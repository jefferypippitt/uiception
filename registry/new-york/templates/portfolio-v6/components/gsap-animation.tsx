"use client"

import { useLayoutEffect, useRef, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

function belowFold(el: HTMLElement) {
  return el.getBoundingClientRect().top > window.innerHeight
}

function pageKind(pathname: string): "about" | "index" | "entry" {
  const at = pathname.indexOf("/writing")
  if (at === -1) return "about"
  const rest = pathname
    .slice(at + "/writing".length)
    .replace(/^\/+|\/+$/g, "")
  return rest ? "entry" : "index"
}

function reveal(
  targets: HTMLElement | HTMLElement[],
  trigger: HTMLElement,
  {
    duration = 0.5,
    fromY = 10,
    fromX = 0,
    stagger,
  }: {
    duration?: number
    fromY?: number
    fromX?: number
    stagger?: number
  } = {}
) {
  gsap.set(targets, { autoAlpha: 0, y: fromY, x: fromX })
  gsap.to(targets, {
    autoAlpha: 1,
    y: 0,
    x: 0,
    duration,
    stagger,
    ease: "power2.out",
    overwrite: "auto",
    clearProps: "transform,opacity,visibility",
    scrollTrigger: {
      trigger,
      start: "top 92%",
      once: true,
    },
  })
}

function enterItems(
  items: HTMLElement[],
  { fromX = 0, fromY = 10, stagger = 0.07, duration = 0.48, at = 0 },
  tl: gsap.core.Timeline
) {
  if (!items.length) return
  gsap.set(items, { autoAlpha: 0, x: fromX, y: fromY })
  tl.to(
    items,
    {
      autoAlpha: 1,
      x: 0,
      y: 0,
      duration,
      stagger,
      ease: "power2.out",
      overwrite: "auto",
      clearProps: "transform,opacity,visibility",
    },
    at
  )
}

function setupEnter(
  root: HTMLElement,
  kind: "about" | "index" | "entry",
  fromX: number
) {
  const main = root.querySelector("main")
  if (!main) return

  const tl = gsap.timeline({ defaults: { ease: "power2.out" } })
  const back = main.querySelector<HTMLElement>("[data-resume-back]")
  const heading = main.querySelector<HTMLElement>("[data-resume-heading]")
  const when = main.querySelector<HTMLElement>("[data-resume-when]")
  const dek = main.querySelector<HTMLElement>("[data-resume-dek]")
  const grafs = gsap
    .utils.toArray<HTMLElement>("[data-resume-prose] p", main)
    .filter((el) => !belowFold(el))
  const rows = gsap
    .utils.toArray<HTMLElement>("[data-resume-row]", main)
    .filter((el) => !belowFold(el))
  const headings = gsap
    .utils.toArray<HTMLElement>("[data-resume-heading]", main)
    .filter((el) => !belowFold(el))

  if (kind === "entry") {
    if (back) enterItems([back], { fromX: fromX || -6, fromY: 0, duration: 0.36 }, tl)
    const head = [heading, when].filter(Boolean) as HTMLElement[]
    enterItems(head, { fromX, fromY: 8, duration: 0.42, stagger: 0.05, at: 0.04 }, tl)
    if (dek) enterItems([dek], { fromX, fromY: 8, duration: 0.45, at: 0.1 }, tl)
    enterItems(grafs, { fromX, fromY: 10, duration: 0.5, stagger: 0.08, at: 0.16 }, tl)
    return
  }

  if (kind === "index") {
    enterItems(rows, { fromX, fromY: 10, duration: 0.46, stagger: 0.06, at: 0 }, tl)
    return
  }

  enterItems(headings, { fromX: 0, fromY: 8, duration: 0.42, stagger: 0.05, at: 0 }, tl)
  enterItems(rows, { fromX: 0, fromY: 10, duration: 0.46, stagger: 0.05, at: 0.06 }, tl)
}

function setupStory(root: HTMLElement) {
  const header = root.querySelector<HTMLElement>("[data-resume-header]")
  const avatar = root.querySelector<HTMLElement>("[data-resume-avatar]")
  const main = root.querySelector("main") ?? root
  const headings = gsap.utils.toArray<HTMLElement>("[data-resume-heading]", main)
  const rows = gsap.utils.toArray<HTMLElement>("[data-resume-row]", main)
  const paragraphs = gsap.utils.toArray<HTMLElement>("[data-resume-prose] p", main)
  const extras = gsap.utils.toArray<HTMLElement>("[data-resume-reveal]", main)

  if (avatar && header) {
    gsap.to(avatar, {
      y: 14,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=45%",
        scrub: 0.8,
      },
    })
  }

  headings.forEach((heading) => {
    if (!belowFold(heading)) return
    reveal(heading, heading, { duration: 0.45, fromY: 8 })
  })

  rows.forEach((row) => {
    if (!belowFold(row)) return
    const date = row.querySelector<HTMLElement>("[data-resume-date]")
    const copy = row.querySelector<HTMLElement>("[data-resume-copy]")
    const bits = [date, copy].filter(Boolean) as HTMLElement[]
    if (!bits.length) {
      reveal(row, row)
      return
    }
    reveal(bits, row, { stagger: 0.06, duration: 0.48, fromY: 10 })
  })

  paragraphs.forEach((paragraph) => {
    if (!belowFold(paragraph)) return
    reveal(paragraph, paragraph, { duration: 0.55, fromY: 10 })
  })

  extras.forEach((el) => {
    if (!belowFold(el)) return
    reveal(el, el, { duration: 0.45, fromY: 8 })
  })

  requestAnimationFrame(() => {
    ScrollTrigger.refresh()
  })
}

function setupNavHover(root: HTMLElement) {
  const cleanups: Array<() => void> = []

  const bind = (el: HTMLElement | null, hoverX: number) => {
    if (!el) return
    const xTo = gsap.quickTo(el, "x", { duration: 0.22, ease: "power2.out" })
    const onEnter = () => xTo(hoverX)
    const onLeave = () => xTo(0)
    el.addEventListener("mouseenter", onEnter)
    el.addEventListener("mouseleave", onLeave)
    el.addEventListener("focus", onEnter)
    el.addEventListener("blur", onLeave)
    cleanups.push(() => {
      el.removeEventListener("mouseenter", onEnter)
      el.removeEventListener("mouseleave", onLeave)
      el.removeEventListener("focus", onEnter)
      el.removeEventListener("blur", onLeave)
    })
  }

  bind(root.querySelector("[data-resume-back]"), -4)
  bind(root.querySelector("[data-resume-prev]"), -4)
  bind(root.querySelector("[data-resume-next]"), 4)

  return () => {
    cleanups.forEach((fn) => fn())
  }
}

export function GsapAnimation({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const firstLoadRef = useRef(true)
  const prevKindRef = useRef<ReturnType<typeof pageKind> | null>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const kind = pageKind(pathname)
    const prev = prevKindRef.current
    const firstLoad = firstLoadRef.current
    firstLoadRef.current = false
    prevKindRef.current = kind

    const fromX =
      prev === "index" && kind === "entry"
        ? 8
        : prev === "entry" && kind === "index"
          ? -8
          : prev === "entry" && kind === "entry"
            ? 8
            : 0

    const mm = gsap.matchMedia()
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (!firstLoad || kind !== "about") {
        setupEnter(root, kind, fromX)
      }
      setupStory(root)
      return setupNavHover(root)
    })

    return () => mm.revert()
  }, [pathname])

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  )
}
