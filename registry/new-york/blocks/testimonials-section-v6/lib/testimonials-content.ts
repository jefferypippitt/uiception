import type { ComponentType, SVGProps } from "react"

import { clerkWordmarkDark as ClerkWordmarkDark } from "@/components/ui/svgs/clerkWordmarkDark"
import { ConvexWordmarkDark } from "@/components/ui/svgs/convexWordmarkDark"
import { GithubWordmarkDark } from "@/components/ui/svgs/githubWordmarkDark"
import { StripeWordmarkDark } from "@/components/ui/svgs/stripeWordmarkDark"
import { SupabaseWordmarkDark } from "@/components/ui/svgs/supabaseWordmarkDark"
import { VercelWordmarkDark } from "@/components/ui/svgs/vercelWordmarkDark"

export type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

export type CompanyMark = {
  name: string
  mark: SvgComponent
}

export type TestimonialItem = {
  id: string
  avatarFile: string
  avatarAlt: string
  description: string
  storyHref: string
  company: CompanyMark
}

export type ResolvedTestimonial = Omit<TestimonialItem, "avatarFile"> & {
  avatarSrc: string
}

export const sectionMeta = {
  title: "What teams are building with us",
  description:
    "A closer look at how engineering and product teams put the platform to work, straight from the people running it.",
} as const

export const testimonials: TestimonialItem[] = [
  {
    id: "stripe",
    avatarFile: "avatar-1.png",
    avatarAlt: "Head of Payments at Stripe",
    description:
      "Stripe's payments team centralized checkout monitoring into one live dashboard, shipping the integration in a single sprint.",
    storyHref: "#",
    company: { name: "Stripe", mark: StripeWordmarkDark },
  },
  {
    id: "github",
    avatarFile: "avatar-2.png",
    avatarAlt: "VP Engineering at GitHub",
    description:
      "GitHub's engineering team migrated their entire release workflow with zero downtime.",
    storyHref: "#",
    company: { name: "GitHub", mark: GithubWordmarkDark },
  },
  {
    id: "vercel",
    avatarFile: "avatar-3.png",
    avatarAlt: "Director of Platform at Vercel",
    description:
      "Vercel's platform team gives every pull request a live, reviewable preview.",
    storyHref: "#",
    company: { name: "Vercel", mark: VercelWordmarkDark },
  },
  {
    id: "convex",
    avatarFile: "avatar-4.png",
    avatarAlt: "Staff Engineer at Convex",
    description:
      "Convex's engineering team keeps every agent working from one source of truth.",
    storyHref: "#",
    company: { name: "Convex", mark: ConvexWordmarkDark },
  },
  {
    id: "clerk",
    avatarFile: "avatar-5.png",
    avatarAlt: "Head of Growth at Clerk",
    description:
      "Clerk's growth team rolled out sign-up in an afternoon and never touched auth again.",
    storyHref: "#",
    company: { name: "Clerk", mark: ClerkWordmarkDark },
  },
  {
    id: "supabase",
    avatarFile: "avatar-6.png",
    avatarAlt: "Lead Backend Engineer at Supabase",
    description:
      "Supabase's backend team cut their query latency in half after moving the whole stack over.",
    storyHref: "#",
    company: { name: "Supabase", mark: SupabaseWordmarkDark },
  },
]
