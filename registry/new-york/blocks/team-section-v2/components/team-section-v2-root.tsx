"use client"

import { GeistPixelCircle } from "geist/font/pixel"
import Image from "next/image"
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react"

import { sectionHeader, type TeamMember } from "../lib/config"
import "../styles/team-section-v2.css"

type TeamSectionV2RootProps = {
  members: TeamMember[]
}

function optionId(id: string) {
  return `team-section-v2-option-${id}`
}

export function TeamSectionV2Root({ members }: TeamSectionV2RootProps) {
  const count = members.length
  const [activeIndex, setActiveIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState(0)
  const [revealKey, setRevealKey] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [motionReady, setMotionReady] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const active = members[activeIndex]

  const measure = useCallback(() => {
    const list = listRef.current
    const frame = frameRef.current
    const row = list?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    )
    if (!list || !frame || !row) return

    const listRect = list.getBoundingClientRect()
    const rowRect = row.getBoundingClientRect()
    const circle = frame.querySelector<HTMLElement>("[data-tsv2-portrait]")
    const circleHeight = circle?.offsetHeight ?? frame.offsetHeight
    const rowCenter = rowRect.top - listRect.top + rowRect.height / 2
    const raw = rowCenter - circleHeight / 2
    const sectionRect = list.closest("section")?.getBoundingClientRect()
    const minY = sectionRect ? sectionRect.top + 32 - listRect.top : raw
    const next = Math.round(Math.max(raw, minY))
    setOffsetY((current) => (current === next ? current : next))
  }, [activeIndex])

  useLayoutEffect(() => {
    measure()
    const list = listRef.current
    const frame = frameRef.current
    if (!list) return
    const observer = new ResizeObserver(() => measure())
    observer.observe(list)
    if (frame) observer.observe(frame)
    return () => observer.disconnect()
  }, [measure])

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => setMotionReady(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  function select(index: number) {
    if (count < 1) return
    const normalized = ((index % count) + count) % count
    if (normalized === activeIndex) return
    setPreviousIndex(activeIndex)
    setActiveIndex(normalized)
    setRevealKey((key) => key + 1)
  }

  function onKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      select(activeIndex + 1)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      select(activeIndex - 1)
    } else if (event.key === "Home") {
      event.preventDefault()
      select(0)
    } else if (event.key === "End") {
      event.preventDefault()
      select(count - 1)
    }
  }

  if (!active) return null

  return (
    <section aria-label="Team" className="pt-16 pb-24 lg:pt-24 lg:pb-36">
      <div className="mx-auto max-w-6xl px-6">
        <header className="max-w-xl">
          <h2 className="text-4xl leading-[1.1] font-medium tracking-[-0.03em] text-foreground lg:text-5xl">
            {sectionHeader.title}
          </h2>
          <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-muted-foreground">
            {sectionHeader.description}
          </p>
        </header>

        <div className="mt-12 grid items-start gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_16.5rem] lg:gap-x-16">
          <ul
            ref={listRef}
            role="listbox"
            aria-label="Team members"
            aria-activedescendant={optionId(active.id)}
            tabIndex={0}
            className="border-t border-border outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-ring"
            onKeyDown={onKeyDown}
          >
            {members.map((member, index) => {
              const selected = index === activeIndex
              return (
                <li
                  key={member.id}
                  id={optionId(member.id)}
                  role="option"
                  aria-selected={selected}
                  aria-label={`${member.name}, ${member.title}`}
                  data-index={index}
                  className="flex cursor-pointer items-start border-b border-border py-5"
                  onMouseEnter={() => select(index)}
                  onClick={() => select(index)}
                >
                  <span
                    className={`min-w-0 transition-opacity duration-300 motion-reduce:transition-none ${
                      selected ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    <span
                      className={`${GeistPixelCircle.className} block text-[1.65rem] leading-none font-normal tracking-normal text-foreground lg:text-4xl`}
                    >
                      {member.name}
                    </span>
                    <span className="mt-1.5 block text-sm text-muted-foreground">
                      {member.title}
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>

          <div className="relative order-first lg:order-0">
            <div
              ref={frameRef}
              data-ready={motionReady ? "true" : "false"}
              style={{ "--tsv2-y": `${offsetY}px` } as CSSProperties}
              className="tsv2-frame mx-auto w-full max-w-xs lg:absolute lg:inset-x-0 lg:top-0 lg:max-w-none"
            >
              <Portrait
                members={members}
                activeIndex={activeIndex}
                previousIndex={previousIndex}
                revealKey={revealKey}
              />
              <p className="mt-4 text-center lg:hidden">
                <span className="block text-sm font-medium text-foreground">
                  {active.name}
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  {active.title}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Portrait({
  members,
  activeIndex,
  previousIndex,
  revealKey,
}: {
  members: TeamMember[]
  activeIndex: number
  previousIndex: number
  revealKey: number
}) {
  return (
    <div
      data-tsv2-portrait
      className="relative aspect-square overflow-hidden rounded-full bg-muted ring-1 ring-border"
    >
      {members.map((member, index) => {
        const active = index === activeIndex
        const leaving = revealKey > 0 && index === previousIndex && !active
        return (
          <Image
            key={member.id}
            src={member.avatarSrc}
            alt=""
            fill
            unoptimized
            sizes="280px"
            priority={index === 0}
            draggable={false}
            className={`object-cover grayscale ${
              revealKey > 0 && active
                ? "tsv2-portrait-in"
                : leaving
                  ? "tsv2-portrait-out"
                  : active
                    ? "opacity-100"
                    : "opacity-0"
            }`}
            style={{ zIndex: active ? 2 : leaving ? 1 : 0 }}
          />
        )
      })}
    </div>
  )
}
