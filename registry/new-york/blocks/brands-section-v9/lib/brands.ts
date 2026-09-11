import type { ComponentType, SVGProps } from "react"

import { StripeWordmark } from "@/components/ui/svgs/stripeWordmark"
import { VercelWordmark } from "@/components/ui/svgs/vercelWordmark"
import { GithubWordmarkLight } from "@/components/ui/svgs/githubWordmarkLight"
import { OpenaiWordmarkLight } from "@/components/ui/svgs/openaiWordmarkLight"
import { NvidiaWordmarkLight } from "@/components/ui/svgs/nvidiaWordmarkLight"
import { SlackWordmark } from "@/components/ui/svgs/slackWordmark"
import { CursorWordmarkLight } from "@/components/ui/svgs/cursorWordmarkLight"
import { NeonWordmarkLight } from "@/components/ui/svgs/neonWordmarkLight"
import { ConvexWordmarkLight } from "@/components/ui/svgs/convexWordmarkLight"
import { clerkWordmarkLight } from "@/components/ui/svgs/clerkWordmarkLight"
import { SupabaseWordmarkLight } from "@/components/ui/svgs/supabaseWordmarkLight"
import { GoogleWordmark } from "@/components/ui/svgs/googleWordmark"

export type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

export type Brand = {
  name: string
  Logo: SvgComponent
}

export const brands: Brand[] = [
  { name: "Stripe", Logo: StripeWordmark },
  { name: "Vercel", Logo: VercelWordmark },
  { name: "GitHub", Logo: GithubWordmarkLight },
  { name: "OpenAI", Logo: OpenaiWordmarkLight },
  { name: "NVIDIA", Logo: NvidiaWordmarkLight },
  { name: "Slack", Logo: SlackWordmark },
  { name: "Cursor", Logo: CursorWordmarkLight },
  { name: "Neon", Logo: NeonWordmarkLight },
  { name: "Convex", Logo: ConvexWordmarkLight },
  { name: "Clerk", Logo: clerkWordmarkLight },
  { name: "Supabase", Logo: SupabaseWordmarkLight },
  { name: "Google", Logo: GoogleWordmark },
]
