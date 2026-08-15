import { forwardRef, type CSSProperties } from "react"
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
import { aggregateLifelinePeople, LifelinePeople } from "./lifeline-people"
import type { LifelineMarker } from "./types"

interface LifelineMarkerColumnProps {
  marker: LifelineMarker
  birthYear: number
  minWidth: number
  animateIntro?: boolean
  introDelay?: number
  introDuration?: number
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
  const people = aggregateLifelinePeople(marker)

  return (
    <div
      ref={ref}
      className="group relative shrink-0 pr-8 transition-opacity duration-300 ease-out will-change-opacity"
      style={{ width: minWidth }}
      aria-label={marker.label ?? `${marker.year}`}
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

        <div className="flex w-full flex-col items-start text-left">
          <p className="mb-5 h-4 text-[11px] font-medium leading-4 tabular-nums text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
            {age}
          </p>

          <p className="mb-6 h-5 whitespace-nowrap text-[15px] font-medium leading-5 tabular-nums text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
            {marker.label ?? marker.year}
          </p>

          <div className="relative w-full pb-10 text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
            <div
              className={cn("flex w-full flex-col items-start pt-6",
                people.length > 0 &&
                  "min-h-[var(--lifeline-people-top)] pb-6",
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

            {people.length > 0 && (
              <div className="w-full">
                <LifelinePeople people={people} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
