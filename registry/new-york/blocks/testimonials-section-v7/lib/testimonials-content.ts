import type { ComponentType, SVGProps } from "react"

import { GithubWordmarkDark } from "@/components/ui/svgs/githubWordmarkDark"
import { GithubWordmarkLight } from "@/components/ui/svgs/githubWordmarkLight"
import { StripeWordmark } from "@/components/ui/svgs/stripeWordmark"
import { StripeWordmarkDark } from "@/components/ui/svgs/stripeWordmarkDark"
import { VercelWordmark } from "@/components/ui/svgs/vercelWordmark"
import { VercelWordmarkDark } from "@/components/ui/svgs/vercelWordmarkDark"

export type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

export type CompanyMark = {
  name: string
  /** Wordmark shown on light cards. */
  markLight: SvgComponent
  /** Wordmark shown on dark cards. */
  markDark: SvgComponent
  /** Height utility that optically balances this wordmark against the others. */
  markClassName: string
}

export type TestimonialItem = {
  id: string
  name: string
  role: string
  avatarFile: string
  quote: string
  company: CompanyMark
}

export type ResolvedTestimonial = Omit<TestimonialItem, "avatarFile"> & {
  avatarSrc: string
}

export const sectionMeta = {
  title: "What teams are building with us",
  description:
    "Engineering and product teams at Stripe, GitHub, and Vercel run their day-to-day on the platform. Here's what the people running it have to say.",
} as const

export const testimonials: TestimonialItem[] = [
  {
    id: "stripe",
    name: "Sofia Marquez",
    role: "Head of Payments, Stripe",
    avatarFile: "avatar-1.png",
    quote:
      "We centralized checkout monitoring into one live dashboard and shipped the integration in a single sprint. Nothing else we evaluated came close to that.",
    company: {
      name: "Stripe",
      markLight: StripeWordmark,
      markDark: StripeWordmarkDark,
      markClassName: "h-6",
    },
  },
  {
    id: "github",
    name: "Lucas Bennett",
    role: "VP Engineering, GitHub",
    avatarFile: "avatar-2.png",
    quote:
      "We migrated our entire release workflow with zero downtime. As someone who has run a few of these, I know how rare that is.",
    company: {
      name: "GitHub",
      markLight: GithubWordmarkLight,
      markDark: GithubWordmarkDark,
      markClassName: "h-4",
    },
  },
  {
    id: "vercel",
    name: "Mei Lin",
    role: "Director of Platform, Vercel",
    avatarFile: "avatar-3.png",
    quote:
      "Every pull request now gets a live, reviewable preview. It changed how our team gives feedback.",
    company: {
      name: "Vercel",
      markLight: VercelWordmark,
      markDark: VercelWordmarkDark,
      markClassName: "h-3.5",
    },
  },
]
