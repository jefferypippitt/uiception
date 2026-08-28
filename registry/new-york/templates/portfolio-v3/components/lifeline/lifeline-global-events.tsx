import { forwardRef } from "react"
import { CompanyIcon } from "./company-icon"
import type { LifelineGlobalEvent, LifelineMarker } from "./types"

/** Max global events a single year lists before the rest collapse behind "More". */
export const LIFELINE_GLOBAL_EVENTS_VISIBLE = 4

export function aggregateLifelineGlobalEvents(
  marker: LifelineMarker,
): LifelineGlobalEvent[] {
  const map = new Map<string, LifelineGlobalEvent>()

  marker.globalEvents?.forEach((item) => {
    if (!map.has(item.name)) map.set(item.name, item)
  })

  return [...map.values()]
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
}

function LifelineGlobalEventPlace({ item }: { item: LifelineGlobalEvent }) {
  const place = item.place?.trim()
  const date = item.date?.trim()
  const fallback = item.role?.trim()

  if (!place && !date && !fallback) return null

  const label = [place, date].filter(Boolean).join(" · ") || fallback

  return (
    <p
      className="text-[11px] leading-snug text-pretty text-muted-foreground/80"
      title={label}
    >
      {place && date ? (
        <>
          <span className="wrap-break-word">{place}</span>
          <span className="text-muted-foreground/40"> · </span>
          <span className="whitespace-nowrap tabular-nums">{date}</span>
        </>
      ) : (
        <span className="wrap-break-word">{place || date || fallback}</span>
      )}
    </p>
  )
}

interface LifelineGlobalEventsProps {
  events: LifelineGlobalEvent[]
}

export const LifelineGlobalEvents = forwardRef<
  HTMLDivElement,
  LifelineGlobalEventsProps
>(function LifelineGlobalEvents({ events }, ref) {
  if (events.length === 0) return null

  return (
    <div ref={ref} className="flex w-full flex-col gap-3">
      {events.map((item) => (
        <div key={item.name} className="flex w-full items-start gap-2.5">
          <div className="flex h-7 w-3 shrink-0 items-center justify-center">
            <span
              className="size-1.5 rounded-full bg-pink-500"
              aria-hidden="true"
            />
          </div>
          {item.icon ? (
            <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-foreground">
              <CompanyIcon
                id={item.icon}
                label={item.name}
                className="h-4 w-5"
              />
            </span>
          ) : (
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background transition-colors duration-300">
              {getInitials(item.name)}
            </span>
          )}
          <div className="min-w-0 text-left leading-snug">
            <p className="text-[13px] text-pretty text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
              {item.name}
            </p>
            <LifelineGlobalEventPlace item={item} />
          </div>
        </div>
      ))}
    </div>
  )
})
