import type { ComponentType, SVGProps } from "react"

import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark"
import { Vite } from "@/components/ui/svgs/vite"
import { Laravel } from "@/components/ui/svgs/laravel"
import { AstroIconLight } from "@/components/ui/svgs/astroIconLight"
import { AstroIconDark } from "@/components/ui/svgs/astroIconDark"
import { Nuxt } from "@/components/ui/svgs/nuxt"
import { Svelte } from "@/components/ui/svgs/svelte"

export type SeriesId = "nextjs" | "vite" | "laravel" | "astro" | "nuxt" | "svelte"

export type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

export type BrandConfig = {
  id: SeriesId
  label: string
  npmPackage: string
  githubRepo: string
  color: string
  Icon: SvgComponent
  DarkIcon: SvgComponent
}

export type SeriesData = {
  id: SeriesId
  total: number
  weeklyDownloads: number
  stars: number
  contributors: number
  points: { i: number; v: number }[]
}

export const BRANDS: BrandConfig[] = [
  {
    id: "nextjs",
    label: "Next.js",
    npmPackage: "next",
    githubRepo: "vercel/next.js",
    color: "#888888",
    Icon: NextjsIconDark,
    DarkIcon: NextjsIconDark,
  },
  {
    id: "vite",
    label: "Vite",
    npmPackage: "vite",
    githubRepo: "vitejs/vite",
    color: "#646CFF",
    Icon: Vite,
    DarkIcon: Vite,
  },
  {
    id: "laravel",
    label: "Laravel",
    npmPackage: "laravel-vite-plugin",
    githubRepo: "laravel/framework",
    color: "#FF2D20",
    Icon: Laravel,
    DarkIcon: Laravel,
  },
  {
    id: "astro",
    label: "Astro",
    npmPackage: "astro",
    githubRepo: "withastro/astro",
    color: "#FF5D01",
    Icon: AstroIconLight,
    DarkIcon: AstroIconDark,
  },
  {
    id: "nuxt",
    label: "Nuxt",
    npmPackage: "nuxt",
    githubRepo: "nuxt/nuxt",
    color: "#00DC82",
    Icon: Nuxt,
    DarkIcon: Nuxt,
  },
  {
    id: "svelte",
    label: "Svelte",
    npmPackage: "svelte",
    githubRepo: "sveltejs/svelte",
    color: "#FF3E00",
    Icon: Svelte,
    DarkIcon: Svelte,
  },
]

export function formatInt(n: number) {
  return new Intl.NumberFormat("en-US").format(n)
}
