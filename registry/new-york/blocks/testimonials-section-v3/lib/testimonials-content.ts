import type { ComponentType, SVGProps } from "react"

import { StripeWordmark } from "@/components/ui/svgs/stripeWordmark"
import { StripeWordmarkDark } from "@/components/ui/svgs/stripeWordmarkDark"
import { GithubWordmarkLight } from "@/components/ui/svgs/githubWordmarkLight"
import { GithubWordmarkDark } from "@/components/ui/svgs/githubWordmarkDark"
import { VercelWordmark } from "@/components/ui/svgs/vercelWordmark"
import { VercelWordmarkDark } from "@/components/ui/svgs/vercelWordmarkDark"
import { ConvexWordmarkLight } from "@/components/ui/svgs/convexWordmarkLight"
import { ConvexWordmarkDark } from "@/components/ui/svgs/convexWordmarkDark"

export type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

export type CompanyLogo = {
  name: string
  light: SvgComponent
  dark?: SvgComponent
}

export type Testimonial = {
  id: string
  quote: string
  name: string
  role: string
  storyHref: string
  logo: CompanyLogo
}

export const testimonials: Testimonial[] = [
  {
    id: "marcus-chen",
    quote:
      "We cut onboarding time in half. The API was straightforward and our team shipped the integration in a single sprint.",
    name: "Marcus Chen",
    role: "Head of Payments",
    storyHref: "#",
    logo: {
      name: "Stripe",
      light: StripeWordmark,
      dark: StripeWordmarkDark,
    },
  },
  {
    id: "david-park",
    quote:
      "Migration was painless. We moved our entire workflow over without downtime and the team picked it up immediately.",
    name: "David Park",
    role: "VP Engineering",
    storyHref: "#",
    logo: {
      name: "GitHub",
      light: GithubWordmarkLight,
      dark: GithubWordmarkDark,
    },
  },
  {
    id: "sarah-mitchell",
    quote:
      "Deploy previews changed how we ship. Every pull request gets a live URL and stakeholders review before anything hits production.",
    name: "Sarah Mitchell",
    role: "Director of Platform",
    storyHref: "#",
    logo: {
      name: "Vercel",
      light: VercelWordmark,
      dark: VercelWordmarkDark,
    },
  },
  {
    id: "jordan-ellis",
    quote:
      "Real-time sync across our stack changed how we build. Our agents finally have one source of truth they can trust.",
    name: "Jordan Ellis",
    role: "Staff Engineer",
    storyHref: "#",
    logo: {
      name: "Convex",
      light: ConvexWordmarkLight,
      dark: ConvexWordmarkDark,
    },
  },
]
