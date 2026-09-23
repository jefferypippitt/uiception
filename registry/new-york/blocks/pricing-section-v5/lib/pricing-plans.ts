export type FeatureIcon =
  | "timer"
  | "git-branch"
  | "shield"
  | "globe"
  | "cpu"
  | "shield-ban"
  | "activity"
  | "circle-dollar-sign"
  | "gauge"
  | "wallet"
  | "users"
  | "snowflake"
  | "link"
  | "key-round"
  | "folder-sync"
  | "shield-plus"
  | "server"
  | "clock"
  | "headset"

export type PricingFeature = {
  icon: FeatureIcon
  label: string
}

export type PricingPlan = {
  id: "hobby" | "pro" | "enterprise"
  name: string
  description: string
  price: string
  priceSuffix?: string
  popular?: boolean
  featuresIntro?: string
  features: PricingFeature[]
  ctaLabel: string
  ctaVariant: "default" | "outline"
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "hobby",
    name: "Hobby",
    description:
      "The perfect starting place for your web app or personal project.",
    price: "$0",
    priceSuffix: "/mo.",
    ctaLabel: "Get started free",
    ctaVariant: "outline",
    features: [
      { icon: "timer", label: "Unlimited personal workspaces" },
      { icon: "git-branch", label: "Version history for every project" },
      { icon: "shield", label: "Secure by default project links" },
      { icon: "globe", label: "Share previews with a public URL" },
      { icon: "cpu", label: "Core automation templates" },
      { icon: "shield-ban", label: "Spam and abuse filtering" },
      { icon: "activity", label: "Basic usage and activity charts" },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Everything you need to build and scale your app.",
    price: "$20",
    priceSuffix: "/mo.",
    popular: true,
    featuresIntro: "Includes Hobby, plus:",
    ctaLabel: "Start Pro trial",
    ctaVariant: "default",
    features: [
      { icon: "circle-dollar-sign", label: "Included monthly credits" },
      {
        icon: "gauge",
        label: "Higher throughput on shared workloads",
      },
      { icon: "wallet", label: "Spend alerts before you overshoot" },
      {
        icon: "users",
        label: "Invite teammates with role-based access",
      },
      { icon: "snowflake", label: "Priority queue for heavy jobs" },
      { icon: "link", label: "Branded share links and domains" },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description:
      "Critical security, performance, observability, platform SLAs, and support.",
    price: "Custom",
    featuresIntro: "Includes Pro, plus:",
    ctaLabel: "Talk to sales",
    ctaVariant: "outline",
    features: [
      { icon: "key-round", label: "Org-wide permission policies" },
      { icon: "folder-sync", label: "Directory sync for your IdP" },
      { icon: "shield-plus", label: "Custom security rule sets" },
      { icon: "server", label: "Isolated environments per region" },
      { icon: "clock", label: "Contracted response times" },
      { icon: "headset", label: "Named account support" },
    ],
  },
]
