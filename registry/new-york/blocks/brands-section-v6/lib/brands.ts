import type { ComponentType, SVGProps } from "react"

import { clerkWordmarkLight } from "@/components/ui/svgs/clerkWordmarkLight"
import { clerkWordmarkDark } from "@/components/ui/svgs/clerkWordmarkDark"
import { betterAuthWordmarkLight } from "@/components/ui/svgs/betterAuthWordmarkLight"
import { betterAuthWordmarkDark } from "@/components/ui/svgs/betterAuthWordmarkDark"
import { workos } from "@/components/ui/svgs/workos"
import { workosLight } from "@/components/ui/svgs/workosLight"
import { keycloak } from "@/components/ui/svgs/keycloak"
import { bitwarden } from "@/components/ui/svgs/bitwarden"
import { authjs } from "@/components/ui/svgs/authjs"
import { auth0 } from "@/components/ui/svgs/auth0"
import { authy } from "@/components/ui/svgs/authy"
import { twilio } from "@/components/ui/svgs/twilio"
import { jwt } from "@/components/ui/svgs/jwt"

export type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

export type Brand = {
  name: string
  light: SvgComponent
  dark?: SvgComponent
}

export const brands: Brand[] = [
  { name: "Clerk", light: clerkWordmarkLight, dark: clerkWordmarkDark },
  { name: "Better Auth", light: betterAuthWordmarkLight, dark: betterAuthWordmarkDark },
  { name: "WorkOS", light: workos, dark: workosLight },
  { name: "Keycloak", light: keycloak },
  { name: "Bitwarden", light: bitwarden },
  { name: "Auth.js", light: authjs },
  { name: "Auth0", light: auth0 },
  { name: "Authy", light: authy },
  { name: "Twilio", light: twilio },
  { name: "JWT", light: jwt },
]
