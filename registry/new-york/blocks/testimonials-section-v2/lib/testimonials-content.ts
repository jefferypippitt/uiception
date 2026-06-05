import type { ComponentType, SVGProps } from "react"

import { StripeWordmark } from "@/components/ui/svgs/stripeWordmark"
import { StripeWordmarkDark } from "@/components/ui/svgs/stripeWordmarkDark"
import { GithubWordmarkLight } from "@/components/ui/svgs/githubWordmarkLight"
import { GithubWordmarkDark } from "@/components/ui/svgs/githubWordmarkDark"
import { betterAuthWordmarkLight } from "@/components/ui/svgs/betterAuthWordmarkLight"
import { betterAuthWordmarkDark } from "@/components/ui/svgs/betterAuthWordmarkDark"

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
  title: string
  avatarSrc: string
  initials: string
  logo: CompanyLogo
}

const blockAvatar = (filename: string) =>
  `https://uiception.com/images/blocks/testimonials-section-v2/${filename}`

export const testimonials: Testimonial[] = [
  {
    id: "marcus-chen",
    quote:
      "We cut onboarding time in half. The API was straightforward and our team shipped the integration in a single sprint.",
    name: "Marcus Chen",
    title: "Stripe",
    initials: "MC",
    avatarSrc: blockAvatar("avatar-1.png"),
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
    title: "GitHub",
    initials: "DP",
    avatarSrc: blockAvatar("avatar-2.png"),
    logo: {
      name: "GitHub",
      light: GithubWordmarkLight,
      dark: GithubWordmarkDark,
    },
  },
  {
    id: "sarah-mitchell",
    quote:
      "Real-time sync across our stack changed how we build. Our agents finally have one source of truth they can trust.",
    name: "Sarah Mitchell",
    title: "Better Auth",
    initials: "SM",
    avatarSrc: blockAvatar("avatar-3.png"),
    logo: {
      name: "Better Auth",
      light: betterAuthWordmarkLight,
      dark: betterAuthWordmarkDark,
    },
  },
]
