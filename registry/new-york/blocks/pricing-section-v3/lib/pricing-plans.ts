export type BillingCycle = "monthly" | "yearly"

export type FeatureGroup = {
  title: string
  features: string[]
}

export type PricingPlan = {
  id: "core" | "growth" | "pro"
  name: string
  description: string
  popular?: boolean
  monthly: { price: string }
  yearly: { price: string }
  priceSuffix: string
  featureGroups: FeatureGroup[]
  ctaLabel: string
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "core",
    name: "Core",
    description: "For solo creators.",
    monthly: { price: "$29" },
    yearly: { price: "$23" },
    priceSuffix: "Per user/month",
    ctaLabel: "Get Started",
    featureGroups: [
      {
        title: "Workspace",
        features: [
          "3 shared workspaces",
          "Unlimited projects",
          "Basic workflow templates",
        ],
      },
      {
        title: "Support",
        features: [
          "Slack & email integrations",
          "Community templates",
          "Standard email support",
        ],
      },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    description: "For product teams shipping.",
    popular: true,
    monthly: { price: "$59" },
    yearly: { price: "$47" },
    priceSuffix: "Per user/month",
    ctaLabel: "Get Started",
    featureGroups: [
      {
        title: "Workspace",
        features: [
          "Unlimited workspaces",
          "Custom automations",
          "Role-based access",
        ],
      },
      {
        title: "Support",
        features: [
          "API access & webhooks",
          "Advanced analytics",
          "Priority chat support",
        ],
      },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For organizations scaling operations.",
    monthly: { price: "$119" },
    yearly: { price: "$95" },
    priceSuffix: "Per user/month",
    ctaLabel: "Get Started",
    featureGroups: [
      {
        title: "Workspace",
        features: [
          "Everything in Growth",
          "Audit logs & exports",
          "Admin policies",
        ],
      },
      {
        title: "Support",
        features: [
          "SSO and SAML",
          "Dedicated success contact",
          "Custom onboarding",
        ],
      },
    ],
  },
]
