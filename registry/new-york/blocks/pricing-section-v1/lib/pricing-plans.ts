export type PricingPlan = {
  id: "core" | "max" | "ultra" | "full-service"
  name: string
  subtitle: string
  priceLabel: string
  priceSuffix?: string
  monthlyLabel: string
  intro: string
  features: string[]
  ctaLabel: string
  ctaVariant?: "default" | "outline"
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "core",
    name: "Starter",
    subtitle: "For individuals and early-stage teams",
    priceLabel: "$29",
    priceSuffix: "/month",
    monthlyLabel: "Includes 3 seats",
    intro: "Everything you need to launch:",
    features: [
      "Up to 10,000 monthly active users",
      "3 team workspaces",
      "Unlimited projects and tasks",
      "Slack and Google Workspace integrations",
      "Basic analytics dashboard",
      "Email support",
    ],
    ctaLabel: "Get Started",
    ctaVariant: "default",
  },
  {
    id: "max",
    name: "Growth",
    subtitle: "For scaling product and operations teams",
    priceLabel: "$99",
    priceSuffix: "/month",
    monthlyLabel: "Includes 10 seats",
    intro: "Everything in Starter, plus:",
    features: [
      "Up to 50,000 monthly active users",
      "Advanced workflow automations",
      "Custom fields and role permissions",
      "API access with higher rate limits",
      "Priority email and chat support",
    ],
    ctaLabel: "Get Started",
    ctaVariant: "default",
  },
  {
    id: "ultra",
    name: "Business",
    subtitle: "For mature teams with advanced requirements",
    priceLabel: "$249",
    priceSuffix: "/month",
    monthlyLabel: "Includes 25 seats",
    intro: "Everything in Growth, plus:",
    features: [
      "Up to 200,000 monthly active users",
      "Single sign-on (SAML/SSO)",
      "Audit logs and security controls",
      "Custom reporting and data exports",
      "Dedicated customer success manager",
    ],
    ctaLabel: "Get Started",
    ctaVariant: "default",
  },
  {
    id: "full-service",
    name: "Enterprise",
    subtitle: "For large organizations with compliance needs",
    priceLabel: "Custom",
    monthlyLabel: "Annual contract",
    intro: "Everything in Business, plus:",
    features: [
      "Unlimited seats and advanced user governance",
      "Dedicated infrastructure and data residency",
      "SOC 2 support and custom compliance terms",
      "Custom SLAs and premium support",
      "Enterprise onboarding and technical training",
      "Quarterly architecture and optimization reviews",
    ],
    ctaLabel: "Book a Call",
    ctaVariant: "outline",
  },
]
