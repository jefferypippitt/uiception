export type FeatureIllustrationId =
  | "trip-planner"
  | "smart-search"
  | "guides-memories"

export const featureIllustrationViewBoxes = {
  "trip-planner": "24 28 440 326",
  "smart-search": "24 28 440 326",
  "guides-memories": "40 24 368 296",
} as const satisfies Record<FeatureIllustrationId, string>

export type FeatureColumn = {
  id: string
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
  illustration: FeatureIllustrationId
}

export const featureColumns: FeatureColumn[] = [
  {
    id: "trip-planner",
    title: "Itinerary board",
    description:
      "Combine destinations, dates, and notes for each day on one shared timeline everyone can follow.",
    ctaLabel: "Build itinerary",
    ctaHref: "#",
    illustration: "trip-planner",
  },
  {
    id: "smart-search",
    title: "Fare workspace",
    description:
      "Reserve flights, lodging, and ground connections in one window instead of many browser tabs.",
    ctaLabel: "View fares",
    ctaHref: "#",
    illustration: "smart-search",
  },
  {
    id: "guides-memories",
    title: "Offline library",
    description:
      "Store maps, photos, and reference files once, then open them anywhere without connectivity.",
    ctaLabel: "View downloads",
    ctaHref: "#",
    illustration: "guides-memories",
  },
]
