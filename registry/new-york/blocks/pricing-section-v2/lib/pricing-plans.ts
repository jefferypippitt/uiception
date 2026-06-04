export type BillingCycle = "monthly" | "yearly"

export type PricingPlan = {
  id: "hobby" | "pro" | "teams" | "enterprise"
  name: string
  monthly: { price: string }
  yearly: { price: string }
  intro: string
  features: string[]
  ctaLabel: string
  ctaVariant?: "default" | "outline"
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "hobby",
    name: "Hobby",
    monthly: { price: "Free" },
    yearly: { price: "Free" },
    intro: "Includes:",
    features: [
      "1 workspace",
      "Up to 3 active projects",
      "100 tasks per month",
      "Basic workflow templates",
    ],
    ctaLabel: "Get started",
    ctaVariant: "outline",
  },
  {
    id: "pro",
    name: "Pro",
    monthly: { price: "$20" },
    yearly: { price: "$16" },
    intro: "Everything in Hobby, plus:",
    features: [
      "Unlimited active projects",
      "Unlimited tasks",
      "Custom automations",
      "50+ app integrations",
      "Priority email support",
    ],
    ctaLabel: "Get Pro",
  },
  {
    id: "teams",
    name: "Teams",
    monthly: { price: "$40" },
    yearly: { price: "$32" },
    intro: "Everything in Pro, plus:",
    features: [
      "Up to 25 seats",
      "Shared dashboards and reporting",
      "Role-based access control",
      "Admin controls and permissions",
      "SSO and SAML",
      "SLA-backed uptime",
    ],
    ctaLabel: "Get Teams",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: { price: "Custom" },
    yearly: { price: "Custom" },
    intro: "Everything in Teams, plus:",
    features: [
      "Unlimited seats",
      "Dedicated infrastructure",
      "Custom data retention policies",
      "SOC 2 Type II compliance",
      "Tailored onboarding",
      "24/7 dedicated support",
    ],
    ctaLabel: "Contact sales",
    ctaVariant: "outline",
  },
]
