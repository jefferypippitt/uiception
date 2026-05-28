import type { ComponentType, SVGProps } from "react"

import { Convex } from "@/components/ui/svgs/convex"
import { Supabase } from "@/components/ui/svgs/supabase"
import { TursoLight } from "@/components/ui/svgs/tursoLight"
import { TursoDark } from "@/components/ui/svgs/tursoDark"
import { Upstash } from "@/components/ui/svgs/upstash"
import { Neon } from "@/components/ui/svgs/neon"
import { Planetscale } from "@/components/ui/svgs/planetscale"
import { PlanetscaleDark } from "@/components/ui/svgs/planetscaleDark"
import { MongodbIconLight } from "@/components/ui/svgs/mongodbIconLight"
import { MongodbIconDark } from "@/components/ui/svgs/mongodbIconDark"

export type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

export type Brand = {
  name: string
  light: SvgComponent
  dark?: SvgComponent
}

export const brands: Brand[] = [
  { name: "Convex",      light: Convex },
  { name: "Supabase",    light: Supabase },
  { name: "Turso",       light: TursoLight,      dark: TursoDark },
  { name: "Upstash",     light: Upstash },
  { name: "Neon",        light: Neon },
  { name: "PlanetScale", light: Planetscale,     dark: PlanetscaleDark },
  { name: "MongoDB",     light: MongodbIconLight, dark: MongodbIconDark },
]
