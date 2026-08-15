import type {
  LifelineEvent,
  LifelineEventCategory,
  LifelineEventClip,
  LifelineEventImage,
  LifelineEventSegment,
} from "./types"

export const LIFELINE_EVENT_CATEGORY_DOT_CLASS: Record<
  LifelineEventCategory,
  string
> = {
  work: "bg-amber-500",
  college: "bg-violet-500",
  destination: "bg-teal-500",
}

function getEventContent(
  event: LifelineEvent,
): string | LifelineEventSegment[] {
  if (typeof event === "object" && !Array.isArray(event) && "text" in event) {
    return event.text
  }

  return event
}

export function getLifelineEventImage(
  event: LifelineEvent,
): LifelineEventImage | undefined {
  if (typeof event === "object" && !Array.isArray(event) && "image" in event) {
    return event.image
  }

  return undefined
}

export function getLifelineEventVideo(
  event: LifelineEvent,
): LifelineEventClip | undefined {
  if (typeof event === "object" && !Array.isArray(event) && "video" in event) {
    return event.video
  }

  return undefined
}

export function getLifelineEventCategory(
  event: LifelineEvent,
): LifelineEventCategory | undefined {
  if (
    typeof event === "object" &&
    !Array.isArray(event) &&
    "category" in event
  ) {
    return event.category
  }

  return undefined
}

export function LifelineEventText({
  event,
  className,
}: {
  event: LifelineEvent
  className?: string
}) {
  const content = getEventContent(event)

  if (typeof content === "string") {
    return <span className={className}>{content}</span>
  }

  return (
    <span className={className}>
      {content.map((segment, index) =>
        segment.type === "link" ? (
          <a
            key={index}
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-muted-foreground underline-offset-2 transition-colors duration-300 group-hover:text-foreground group-hover:decoration-foreground"
          >
            {segment.value}
          </a>
        ) : (
          <span key={index}>{segment.value}</span>
        ),
      )}
    </span>
  )
}

export function LifelineEventMedia({
  media,
  className,
}: {
  media: LifelineEventImage
  className?: string
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={media.src} alt={media.alt} loading="lazy" className={className} />
  )
}

export function getLifelineEventKey(event: LifelineEvent, index: number) {
  const content = getEventContent(event)

  if (typeof content === "string") return `${index}-${content}`

  return `${index}-${content.map((segment) => segment.value).join("")}`
}
