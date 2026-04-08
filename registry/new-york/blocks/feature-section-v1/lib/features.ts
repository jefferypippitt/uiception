import { Cog, Activity, MessageCircle, BrainCog } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type FeatureLayout = "wide" | "narrow"

export type Feature = {
  id: string
  layout: FeatureLayout
  imageSrc?: string
  icon: LucideIcon
  title: string
  description: string
}

export const features: Feature[] = [
  {
    id: "next-level-home-ai",
    layout: "wide",
    imageSrc: "https://uiception.com/images/ggi_feature-section-v1_top.png",
    icon: BrainCog,
    title: "Learns how your home runs",
    description:
      "It picks up your rhythms and rolls with you when life gets busy or plans change.",
  },
  {
    id: "effortless-daily-automation",
    layout: "narrow",
    icon: Cog,
    title: "Take back your evenings",
    description:
      "Hand off the repetitive stuff so you're not stuck on the same tasks every night.",
  },
  {
    id: "smart-family-insights",
    layout: "narrow",
    icon: Activity,
    title: "A calmer read on home life",
    description:
      "Small, clear updates on how everyone is doing, without you playing detective.",
  },
  {
    id: "ai-powered-home-support",
    layout: "wide",
    imageSrc: "https://uiception.com/images/ggi_feature-section-v1_btm.png",
    icon: MessageCircle,
    title: "Someone to ask, anytime",
    description:
      "Patient, upbeat help when you need an answer, a nudge, or a little company.",
  },
]
