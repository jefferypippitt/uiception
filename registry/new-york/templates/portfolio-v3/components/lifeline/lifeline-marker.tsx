"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type TransitionEvent as ReactTransitionEvent,
} from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { CompanyIcon } from "./company-icon"
import {
  getLifelineEventCategory,
  getLifelineEventImage,
  getLifelineEventKey,
  getLifelineEventVideo,
  LIFELINE_EVENT_CATEGORY_DOT_CLASS,
  LifelineEventText,
} from "./lifeline-event"
import { LifelineInlineClip } from "./lifeline-inline-clip"
import { LifelineInlineStill } from "./lifeline-inline-still"
import {
  aggregateLifelineGlobalEvents,
  LIFELINE_GLOBAL_EVENTS_VISIBLE,
  LifelineGlobalEvents,
} from "./lifeline-global-events"
import {
  clamp,
  LIFELINE_EXPAND_GESTURE,
  type LifelineExpandGestureDetail,
} from "./lifeline-utils"
import type { LifelineMarker } from "./types"

type ExpandPhase = "idle" | "opening" | "closing"

const SNAP_VELOCITY = 0.4

// Keep the rail itself fully opaque, then dissolve over a short band in the
// gap between the dotted timeline and the first title.
const RAIL_DISSOLVE =
  "linear-gradient(to bottom, rgb(255 255 255 / 0) 0, rgb(255 255 255 / 0) 14px, #fff 56px)"
const RAIL_DISSOLVE_MASK: CSSProperties = {
  maskImage: RAIL_DISSOLVE,
  WebkitMaskImage: RAIL_DISSOLVE,
}

const MOTION =
  "duration-[560ms] ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none"

interface LifelineMarkerColumnProps {
  marker: LifelineMarker
  birthYear: number
  minWidth: number
  animateIntro?: boolean
  introDelay?: number
  introDuration?: number
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export const LifelineMarkerColumn = forwardRef<
  HTMLDivElement,
  LifelineMarkerColumnProps
>(function LifelineMarkerColumn(
  {
    marker,
    birthYear,
    minWidth,
    animateIntro = false,
    introDelay = 0,
    introDuration = 420,
  },
  ref,
) {
  const age = marker.age ?? marker.year - birthYear
  const globalEvents = aggregateLifelineGlobalEvents(marker)

  // The timeline gives each year a fixed slot (navbar + footer pin it). Past
  // the visible count, the extra global events are held just below the fold;
  // grabbing up (or "More") scrolls the stack so they rise into view while
  // the year's content parks in the gap under the rail. The column never grows.
  const hiddenCount = globalEvents.length - LIFELINE_GLOBAL_EVENTS_VISIBLE
  const isTruncated = hiddenCount > 0

  const [expanded, setExpanded] = useState(false)
  const [phase, setPhase] = useState<ExpandPhase>("idle")
  const [windowHeight, setWindowHeight] = useState<number | null>(null)
  const [extra, setExtra] = useState(0)
  const [progress, setProgress] = useState(0)
  const [scrubbing, setScrubbing] = useState(false)

  const columnRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const extraRef = useRef(0)
  const progressRef = useRef(0)
  const originProgressRef = useRef(0)
  const accYRef = useRef(0)
  const scrubbingRef = useRef(false)

  const assignRef = useCallback(
    (node: HTMLDivElement | null) => {
      columnRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  const setProgressValue = useCallback((next: number) => {
    const clamped = clamp(next, 0, 1)
    progressRef.current = clamped
    setProgress(clamped)
    setExpanded(clamped >= 0.5)
  }, [])

  const snapTo = useCallback(
    (target: 0 | 1) => {
      setScrubbing(false)
      scrubbingRef.current = false

      if (
        prefersReducedMotion() ||
        Math.abs(progressRef.current - target) < 0.001
      ) {
        setProgressValue(target)
        setPhase("idle")
        return
      }

      setPhase(target === 1 ? "opening" : "closing")
      setProgressValue(target)
    },
    [setProgressValue],
  )

  // Freeze the window to the collapsed stack's height so expanding shifts
  // content inside it instead of growing the column (and recentering the
  // rail off-screen). All events stay mounted so a vertical grab can scrub.
  useLayoutEffect(() => {
    if (!isTruncated) return
    const track = trackRef.current
    const list = listRef.current
    if (!track || !list) return

    const measure = () => {
      const items = [...list.children] as HTMLElement[]
      const lastVisible =
        items[Math.min(LIFELINE_GLOBAL_EVENTS_VISIBLE, items.length) - 1]
      if (!lastVisible) return

      const fold = Math.round(
        lastVisible.getBoundingClientRect().bottom -
          track.getBoundingClientRect().top,
      )
      const nextExtra = Math.max(0, track.offsetHeight - fold)
      extraRef.current = nextExtra
      setWindowHeight((prev) => (prev === fold ? prev : fold))
      setExtra((prev) => (prev === nextExtra ? prev : nextExtra))
    }

    measure()

    let raf = 0
    const scheduleMeasure = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }

    const observer = new ResizeObserver(scheduleMeasure)
    observer.observe(track)
    observer.observe(list)
    window.addEventListener("resize", scheduleMeasure)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener("resize", scheduleMeasure)
    }
  }, [isTruncated, globalEvents.length])

  useEffect(() => {
    if (!isTruncated) return
    const node = columnRef.current
    if (!node) return

    const onGesture = (event: Event) => {
      const { phase: gesturePhase, deltaY, velocityY } = (
        event as CustomEvent<LifelineExpandGestureDetail>
      ).detail

      if (gesturePhase === "start") {
        originProgressRef.current = progressRef.current
        accYRef.current = 0
        setScrubbing(true)
        scrubbingRef.current = true
        setPhase("idle")
        return
      }

      if (gesturePhase === "move") {
        const span = extraRef.current
        if (span <= 0) return
        accYRef.current += deltaY
        setProgressValue(originProgressRef.current - accYRef.current / span)
        return
      }

      const current = progressRef.current
      let target: 0 | 1
      if (velocityY < -SNAP_VELOCITY) target = 1
      else if (velocityY > SNAP_VELOCITY) target = 0
      else target = current > 0.5 ? 1 : 0
      snapTo(target)
    }

    node.addEventListener(LIFELINE_EXPAND_GESTURE, onGesture)
    return () => node.removeEventListener(LIFELINE_EXPAND_GESTURE, onGesture)
  }, [isTruncated, setProgressValue, snapTo])

  // Safety net for reduced-motion (no transitionend) or a dropped event.
  useEffect(() => {
    if (phase === "idle") return
    const id = window.setTimeout(() => setPhase("idle"), 720)
    return () => window.clearTimeout(id)
  }, [phase])

  function toggle(event: ReactMouseEvent) {
    event.stopPropagation()
    if (scrubbing || windowHeight == null || extra <= 0) return
    snapTo(progress > 0.5 ? 0 : 1)
  }

  function handleTrackTransitionEnd(
    event: ReactTransitionEvent<HTMLDivElement>,
  ) {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") {
      return
    }
    setPhase("idle")
  }

  const isOpen = progress > 0.02
  const trackStyle: CSSProperties = {
    transform: `translateY(${-progress * extra}px)`,
  }

  const innerContent = (
    <>
      <div
        className={cn(
          "flex w-full flex-col items-start pt-6",
          globalEvents.length > 0 &&
            "min-h-[var(--lifeline-global-events-top)] pb-6",
        )}
      >
        {marker.badges && marker.badges.length > 0 && (
          <div className="mb-3 flex items-center justify-start gap-2">
            {marker.badges.map((badge) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={badge.src}
                src={badge.src}
                alt={badge.alt}
                className="h-6 w-6 object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100"
              />
            ))}
          </div>
        )}

        {marker.companies && marker.companies.length > 0 && (
          <div className="mb-2 flex items-center justify-start gap-1.5">
            {marker.companies.map((company) => (
              <CompanyIcon
                key={company.id}
                id={company.id}
                label={company.name}
                className="opacity-70 transition-opacity duration-300 group-hover:opacity-100"
              />
            ))}
          </div>
        )}

        <div className="min-h-[3.25rem] space-y-4">
          {marker.events.map((event, index) => {
            const image = getLifelineEventImage(event)
            const clip = getLifelineEventVideo(event)
            const category = getLifelineEventCategory(event)

            return (
              <div key={getLifelineEventKey(event, index)}>
                <p className="flex max-w-[18rem] items-start gap-2 text-left text-[14px] leading-[1.55] tracking-[-0.01em]">
                  {category && (
                    <span
                      className={cn("mt-[7px] size-1.5 shrink-0 rounded-full",
                        LIFELINE_EVENT_CATEGORY_DOT_CLASS[category],
                      )}
                      aria-hidden="true"
                    />
                  )}
                  <LifelineEventText event={event} />
                </p>
                {image && <LifelineInlineStill image={image} />}
                {clip && <LifelineInlineClip clip={clip} />}
              </div>
            )
          })}
        </div>
      </div>

      {globalEvents.length > 0 && (
        <div className="w-full">
          <LifelineGlobalEvents ref={listRef} events={globalEvents} />
        </div>
      )}
    </>
  )

  return (
    <div
      ref={assignRef}
      className="group relative shrink-0 pr-8 transition-opacity duration-300 ease-out will-change-opacity"
      style={{ width: minWidth }}
      aria-label={marker.label ?? `${marker.year}`}
      {...(isTruncated ? { "data-lifeline-expand": "" } : {})}
    >
      <div
        className={cn("relative", animateIntro && "lifeline-marker-intro")}
        style={{
          animationDelay: animateIntro ? `${introDelay}ms` : undefined,
          ...(animateIntro
            ? ({
                "--lifeline-marker-fade-ms": `${introDuration}ms`,
              } as CSSProperties)
            : {}),
        }}
      >
        <span
          className="absolute left-0 top-[var(--lifeline-rail)] z-10 h-[10px] w-px -translate-y-1/2 bg-muted-foreground transition-colors duration-300 group-hover:bg-muted-foreground"
          aria-hidden="true"
        />

        {/* Hairline over the pocket so the rail stays readable while content
            dissolves in the gap below it. */}
        {isTruncated && (
          <div
            aria-hidden="true"
            className={cn("pointer-events-none absolute left-0 right-0 top-[var(--lifeline-rail)] z-30 border-t border-dashed border-border transition-opacity duration-300",
              isOpen ? "opacity-100" : "opacity-0",
            )}
          />
        )}

        <div className="flex w-full flex-col items-start text-left">
          <p className="mb-5 h-4 text-[15px] font-medium leading-4 tabular-nums text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
            {age}
          </p>

          <p className="mb-6 h-5 whitespace-nowrap text-[15px] font-medium leading-5 tabular-nums text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
            {marker.label ?? marker.year}
          </p>

          <div className="relative w-full pb-10 text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
            {isTruncated ? (
              <div
                className="relative overflow-hidden"
                style={{
                  height: windowHeight ?? undefined,
                  ...(isOpen ? RAIL_DISSOLVE_MASK : null),
                }}
              >
                <div
                  ref={trackRef}
                  onTransitionEnd={handleTrackTransitionEnd}
                  className={cn(
                    "will-change-transform",
                    !scrubbing && "transition-transform",
                    !scrubbing && MOTION,
                  )}
                  style={trackStyle}
                >
                  {innerContent}
                </div>

                {/* Soft lower edge only while the stack is in motion. */}
                <div
                  aria-hidden="true"
                  className={cn("pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-background to-transparent transition-opacity duration-200",
                    scrubbing || phase !== "idle" ? "opacity-100" : "opacity-0",
                  )}
                />
              </div>
            ) : (
              <div>{innerContent}</div>
            )}

            {isTruncated && (
              <button
                type="button"
                data-lifeline-interactive=""
                onClick={toggle}
                disabled={scrubbing}
                aria-expanded={expanded}
                aria-label={
                  expanded
                    ? `Collapse ${marker.label ?? marker.year}`
                    : `Show ${hiddenCount} more for ${
                        marker.label ?? marker.year
                      }`
                }
                className="group/more relative z-20 mt-4 flex w-full justify-center disabled:opacity-60"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-dashed border-muted-foreground/40 text-muted-foreground transition-colors duration-300 group-hover/more:border-muted-foreground/70 group-hover/more:text-foreground">
                  <ChevronDown
                    className={cn("size-3.5 transition-transform duration-300 motion-reduce:transition-none",
                      progress < 0.5 && "rotate-180",
                    )}
                  />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
