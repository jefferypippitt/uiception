import { CompanyIcon } from "./company-icon"
import type { LifelineGlobalEvent, LifelineMarker } from "./types"

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

interface LifelineGlobalEventsProps {
  events: LifelineGlobalEvent[]
  allowWrap?: boolean
}

export function LifelineGlobalEvents({
  events,
  allowWrap = false,
}: LifelineGlobalEventsProps) {
  if (events.length === 0) return null

  return (
    <div className="flex w-full flex-col gap-3">
      {events.map((item) => (
        <div key={item.name} className="flex w-full items-center gap-2.5">
          <div className="flex w-3 shrink-0 items-center justify-center">
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
          <div
            className={
              allowWrap
                ? "min-w-0 text-left leading-snug"
                : "min-w-0 whitespace-nowrap text-left"
            }
          >
            <p className="text-[13px] text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
              {item.name}
            </p>
            {item.role ? (
              <p className="text-[11px] text-muted-foreground/80">
                {item.role}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}
