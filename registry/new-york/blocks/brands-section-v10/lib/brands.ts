import type { ComponentType, SVGProps } from "react"

import { StripeWordmark } from "@/components/ui/svgs/stripeWordmark"
import { VercelWordmark } from "@/components/ui/svgs/vercelWordmark"
import { VercelWordmarkDark } from "@/components/ui/svgs/vercelWordmarkDark"
import { GithubWordmarkLight } from "@/components/ui/svgs/githubWordmarkLight"
import { GithubWordmarkDark } from "@/components/ui/svgs/githubWordmarkDark"
import { OpenaiWordmarkLight } from "@/components/ui/svgs/openaiWordmarkLight"
import { OpenaiWordmarkDark } from "@/components/ui/svgs/openaiWordmarkDark"
import { NvidiaWordmarkLight } from "@/components/ui/svgs/nvidiaWordmarkLight"
import { NvidiaWordmarkDark } from "@/components/ui/svgs/nvidiaWordmarkDark"
import { clerkWordmarkLight } from "@/components/ui/svgs/clerkWordmarkLight"
import { clerkWordmarkDark } from "@/components/ui/svgs/clerkWordmarkDark"

export type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

export type Brand = {
  name: string
  light: SvgComponent
  dark?: SvgComponent
}

export const brands: Brand[] = [
  { name: "Stripe", light: StripeWordmark },
  { name: "Vercel", light: VercelWordmark, dark: VercelWordmarkDark },
  { name: "GitHub", light: GithubWordmarkLight, dark: GithubWordmarkDark },
  { name: "OpenAI", light: OpenaiWordmarkLight, dark: OpenaiWordmarkDark },
  { name: "NVIDIA", light: NvidiaWordmarkLight, dark: NvidiaWordmarkDark },
  { name: "Clerk", light: clerkWordmarkLight, dark: clerkWordmarkDark },
]
