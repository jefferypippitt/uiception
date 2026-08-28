import type { CompanyIconId } from "./company-icon"

export interface LifelineGlobalEvent {
  name: string
  /** Venue or city. Wraps onto the next line when it does not fit. */
  place?: string
  date?: string
  /** Freeform subtitle if `place` / `date` are not split. */
  role?: string
  icon?: CompanyIconId
}

export interface LifelineCompany {
  id: CompanyIconId
  name: string
}

export type LifelineEventSegment =
  | { type: "text"; value: string }
  | { type: "link"; value: string; href: string }

export interface LifelineEventImage {
  src: string
  alt: string
}

export interface LifelineEventClip {
  src: string
  alt: string
}

export type LifelineEventCategory = "work" | "college" | "destination"

export interface LifelineEventObject {
  text: string | LifelineEventSegment[]
  image?: LifelineEventImage
  video?: LifelineEventClip
  category?: LifelineEventCategory
}

export type LifelineEvent =
  | string
  | LifelineEventSegment[]
  | LifelineEventObject

export interface LifelineMarker {
  id: string
  year: number
  age?: number | string
  label?: string
  events: LifelineEvent[]
  badges?: { src: string; alt: string }[]
  companies?: LifelineCompany[]
  globalEvents?: LifelineGlobalEvent[]
}

export interface LifelineLegendItem {
  type: "globalEvent" | LifelineEventCategory
  label: string
}

export type LifelineMode = "auto" | "page" | "embed"

export interface LifelineProps {
  markers: LifelineMarker[]
  birthYear: number
  className?: string
  title?: string
  mode?: LifelineMode
}
