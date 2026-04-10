import type { ComponentType, SVGProps } from "react"

import { Supabase } from "@/components/ui/svgs/supabase"
import { Convex } from "@/components/ui/svgs/convex"
import { Vercel } from "@/components/ui/svgs/vercel"
import { VercelDark } from "@/components/ui/svgs/vercelDark"
import { Neon } from "@/components/ui/svgs/neon"
import { Upstash } from "@/components/ui/svgs/upstash"
import { TursoLight } from "@/components/ui/svgs/tursoLight"

export type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

export type Brand = {
  name: string
  Icon: SvgComponent
  darkIcon?: SvgComponent
  color: string
}

export const brands: Brand[] = [
  { name: "Supabase", Icon: Supabase,   color: "#3ECF8E" },
  { name: "Convex",   Icon: Convex,     color: "#F3B01C" },
  { name: "Vercel",   Icon: Vercel,     darkIcon: VercelDark, color: "#888888" },
  { name: "Neon",     Icon: Neon,       color: "#00E0D9" },
  { name: "Upstash",  Icon: Upstash,    color: "#00C98D" },
  { name: "Turso",    Icon: TursoLight, color: "#3CD5A1" },
]
