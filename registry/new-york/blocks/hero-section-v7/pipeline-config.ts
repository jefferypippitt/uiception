export type DeliveryExample = {
  id: string
  order: string
  prep: string
  platforms: string[]
  etaMin: number
}

export type PipelineStage = "ingest" | "transform" | "deliver" | "idle"

export const DELIVERY_EXAMPLES: DeliveryExample[] = [
  {
    id: "ord_4821",
    order: "Pepperoni pizza",
    prep: "Take out box",
    platforms: ["DoorDash"],
    etaMin: 12,
  },
  {
    id: "ord_7394",
    order: "Chicken wings",
    prep: "Take out box",
    platforms: ["Uber Eats"],
    etaMin: 15,
  },
]

export const DELIVERY_STAGES = [
  {
    id: "ingest",
    label: "Order",
    detail: "Customer checks out",
  },
  {
    id: "transform",
    label: "Prep",
    detail: "Kitchen packs it",
  },
  {
    id: "deliver",
    label: "Deliver",
    detail: "Driver en route",
  },
] as const

export const DELIVERY_PLATFORMS = [
  { id: "ubereats", label: "Uber Eats" },
  { id: "doordash", label: "DoorDash" },
] as const

export type DeliveryPlatformId = (typeof DELIVERY_PLATFORMS)[number]["id"]

export type DeliveryPlatformState =
  | "inactive"
  | "pending"
  | "queued"
  | "delivering"
  | "delivered"
  | "complete"

export function getDeliveryPlatformState(
  platformLabel: string,
  orderPlatforms: string[],
  stage: PipelineStage,
  activePlatforms: string[]
): DeliveryPlatformState {
  if (!orderPlatforms.includes(platformLabel)) {
    return "inactive"
  }

  switch (stage) {
    case "idle":
      return "complete"
    case "ingest":
      return "pending"
    case "transform":
      return "queued"
    case "deliver":
      return activePlatforms.includes(platformLabel)
        ? "delivered"
        : "delivering"
    default:
      return "pending"
  }
}

export function getFooterPlatforms(
  stage: PipelineStage,
  orderPlatforms: string[]
) {
  const route = orderPlatforms.join(" + ")

  if (stage === "deliver" || stage === "idle") {
    return {
      text: route,
      highlighted: true,
    }
  }

  return {
    text: route,
    highlighted: false,
  }
}

export function getFooterStepActive(
  stage: PipelineStage,
  orderPlatforms: string[]
) {
  const platforms = getFooterPlatforms(stage, orderPlatforms)

  return {
    order: stage === "ingest",
    prep: stage === "transform",
    platforms: platforms.highlighted,
  }
}
