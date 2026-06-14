import type { ComponentType, SVGProps } from "react"

import { Stripe } from "@/components/ui/svgs/stripe"
import { Slack } from "@/components/ui/svgs/slack"
import { GithubLight } from "@/components/ui/svgs/githubLight"
import { GithubDark } from "@/components/ui/svgs/githubDark"
import { Google } from "@/components/ui/svgs/google"
import { Vercel } from "@/components/ui/svgs/vercel"
import { VercelDark } from "@/components/ui/svgs/vercelDark"
import { Salesforce } from "@/components/ui/svgs/salesforce"
import { MongodbIconLight } from "@/components/ui/svgs/mongodbIconLight"
import { MongodbIconDark } from "@/components/ui/svgs/mongodbIconDark"
import { Neon } from "@/components/ui/svgs/neon"
import { Planetscale } from "@/components/ui/svgs/planetscale"
import { PlanetscaleDark } from "@/components/ui/svgs/planetscaleDark"
import { auth0 } from "@/components/ui/svgs/auth0"
import { CursorLight } from "@/components/ui/svgs/cursorLight"
import { CursorDark } from "@/components/ui/svgs/cursorDark"
import { ClaudeAiIcon } from "@/components/ui/svgs/claudeAiIcon"
import { Openai } from "@/components/ui/svgs/openai"
import { OpenaiDark } from "@/components/ui/svgs/openaiDark"
import { Railway } from "@/components/ui/svgs/railway"
import { RailwayDark } from "@/components/ui/svgs/railwayDark"
import { Convex } from "@/components/ui/svgs/convex"
import { twilio } from "@/components/ui/svgs/twilio"
import { workos } from "@/components/ui/svgs/workos"
import { workosLight } from "@/components/ui/svgs/workosLight"
import { Meta } from "@/components/ui/svgs/meta"
import { MetaDark } from "@/components/ui/svgs/metaDark"
import { NvidiaIconLight } from "@/components/ui/svgs/nvidiaIconLight"
import { NvidiaIconDark } from "@/components/ui/svgs/nvidiaIconDark"
import { SanityLight } from "@/components/ui/svgs/sanityLight"
import { SanityDark } from "@/components/ui/svgs/sanityDark"

export type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

export type Brand = {
  name: string
  light: SvgComponent
  dark?: SvgComponent
}

export const col1Brands: Brand[] = [
  { name: "Stripe", light: Stripe },
  { name: "Slack", light: Slack },
  { name: "GitHub", light: GithubLight, dark: GithubDark },
  { name: "Google", light: Google },
  { name: "Vercel", light: Vercel, dark: VercelDark },
]

export const col2Brands: Brand[] = [
  { name: "Salesforce", light: Salesforce },
  { name: "MongoDB", light: MongodbIconLight, dark: MongodbIconDark },
  { name: "Neon", light: Neon },
  { name: "Planetscale", light: Planetscale, dark: PlanetscaleDark },
  { name: "Auth0", light: auth0 },
]

export const col3Brands: Brand[] = [
  { name: "Cursor", light: CursorLight, dark: CursorDark },
  { name: "Claude", light: ClaudeAiIcon },
  { name: "OpenAI", light: Openai, dark: OpenaiDark },
  { name: "Railway", light: Railway, dark: RailwayDark },
  { name: "Convex", light: Convex },
]

export const col4Brands: Brand[] = [
  { name: "Twilio", light: twilio },
  { name: "WorkOS", light: workos, dark: workosLight },
  { name: "Meta", light: Meta, dark: MetaDark },
  { name: "Nvidia", light: NvidiaIconLight, dark: NvidiaIconDark },
  { name: "Sanity", light: SanityLight, dark: SanityDark },
]
