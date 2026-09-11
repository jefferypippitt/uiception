export type CreditOption = {
  id: string
  label: string
  price: string
}

export type PricingPlan = {
  id: "free" | "basic" | "pro"
  name: string
  description: string
  /** Fixed price when the plan has no credit options. */
  price?: string
  priceSuffix: string
  /** Static credit label for Free / Basic. */
  creditLabel?: string
  /** Interactive credit options for Pro — selecting one updates the price. */
  creditOptions?: CreditOption[]
  featuresIntro: string
  features: string[]
  ctaLabel: string
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "See what's possible",
    price: "$0",
    priceSuffix: "/ month",
    creditLabel: "Limited credits",
    featuresIntro: "What's included:",
    features: [
      "2 team members",
      "10 projects",
      "Integrations",
    ],
    ctaLabel: "Get Started",
  },
  {
    id: "basic",
    name: "Basic",
    description: "Build personal apps",
    price: "$25",
    priceSuffix: "/ month",
    creditLabel: "100 Credits",
    featuresIntro: "Everything in Free, plus:",
    features: ["2 team members", "2 published apps", "1 enabled workflow"],
    ctaLabel: "Get Started",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Build apps you can share",
    priceSuffix: "/ month",
    creditOptions: [
      { id: "250", label: "250 Credits", price: "$50" },
      { id: "500", label: "500 Credits", price: "$90" },
      { id: "1000", label: "1000 Credits", price: "$160" },
    ],
    featuresIntro: "Everything in Basic, plus:",
    features: ["3 team members", "5 published apps", "20 projects"],
    ctaLabel: "Get Started",
  },
]
