export type PlanId = "free" | "basic" | "pro"

export type PricingPlan = {
  id: PlanId
  name: string
  price: string
  priceSuffix: string
  ctaLabel: string
  /** Rendered as the dark, inverted card. */
  highlighted?: boolean
}

/** `true` renders a check, `false` a muted cross, a string renders as-is. */
export type FeatureValue = boolean | string

export type PricingFeature = {
  label: string
  values: Record<PlanId, FeatureValue>
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    priceSuffix: "Per month",
    ctaLabel: "Get Started",
  },
  {
    id: "basic",
    name: "Basic",
    price: "$25",
    priceSuffix: "Per month",
    ctaLabel: "Get Started",
    highlighted: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$50",
    priceSuffix: "Per month",
    ctaLabel: "Get Started",
  },
]

export const pricingFeatures: PricingFeature[] = [
  {
    label: "Team members",
    values: { free: "1", basic: "2", pro: "3" },
  },
  {
    label: "Projects",
    values: { free: "3", basic: "10", pro: "20" },
  },
  {
    label: "Published apps",
    values: { free: false, basic: "2", pro: "5" },
  },
  {
    label: "Integrations",
    values: { free: true, basic: true, pro: true },
  },
  {
    label: "Custom domains",
    values: { free: false, basic: true, pro: true },
  },
  {
    label: "Enabled workflows",
    values: { free: false, basic: "1", pro: "Unlimited" },
  },
  {
    label: "Priority support",
    values: { free: false, basic: false, pro: true },
  },
]
