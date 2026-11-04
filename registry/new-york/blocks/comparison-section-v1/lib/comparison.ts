import type { ComponentType, SVGProps } from "react"

import { Amd } from "@/components/ui/svgs/amd"
import { Intel } from "@/components/ui/svgs/intel"
import { NvidiaWordmarkDark } from "@/components/ui/svgs/nvidiaWordmarkDark"
import { NvidiaWordmarkLight } from "@/components/ui/svgs/nvidiaWordmarkLight"

export type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

export type ProductId = "nvidia" | "amd" | "intel"

export type Product = {
  id: ProductId
  name: string
  logoLight: SvgComponent
  /** Black wordmark for light backgrounds, white wordmark for dark backgrounds. */
  logoDark?: SvgComponent
  logoClassName: string
}

export type ComparisonRow = {
  id: string
  criterion: string
  cells: Record<ProductId, string>
}

export type ComparisonGroup = {
  id: string
  label: string
  rows: ComparisonRow[]
}

export const comparisonHeader = {
  title: "What NVIDIA, AMD, and Intel sell",
} as const

export const products: Product[] = [
  {
    id: "nvidia",
    name: "NVIDIA",
    logoLight: NvidiaWordmarkLight,
    logoDark: NvidiaWordmarkDark,
    logoClassName: "h-[1.125rem] w-auto",
  },
  {
    id: "amd",
    name: "AMD",
    logoLight: Amd,
    logoClassName: "h-8 w-auto",
  },
  {
    id: "intel",
    name: "Intel",
    logoLight: Intel,
    logoClassName: "h-5 w-auto",
  },
]

export const groups: ComparisonGroup[] = [
  {
    id: "products",
    label: "Products",
    rows: [
      {
        id: "discrete-gpu",
        criterion: "Discrete GPU",
        cells: {
          nvidia: "GeForce",
          amd: "Radeon",
          intel: "Arc",
        },
      },
      {
        id: "desktop-cpu",
        criterion: "Desktop CPU",
        cells: {
          nvidia: "No desktop CPU",
          amd: "Ryzen",
          intel: "Core",
        },
      },
      {
        id: "server-cpu",
        criterion: "Server CPU",
        cells: {
          nvidia: "Grace",
          amd: "EPYC",
          intel: "Xeon",
        },
      },
      {
        id: "integrated-graphics",
        criterion: "Integrated graphics",
        cells: {
          nvidia: "No integrated graphics",
          amd: "Most Ryzen chips",
          intel: "Most Core chips",
        },
      },
    ],
  },
  {
    id: "software",
    label: "Software",
    rows: [
      {
        id: "compute",
        criterion: "GPU compute",
        cells: {
          nvidia: "CUDA",
          amd: "ROCm",
          intel: "oneAPI",
        },
      },
    ],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    rows: [
      {
        id: "fabrication",
        criterion: "Chip fabrication",
        cells: {
          nvidia: "TSMC",
          amd: "TSMC",
          intel: "Its own fabs",
        },
      },
      {
        id: "foundry",
        criterion: "Foundry service",
        cells: {
          nvidia: "Does not offer it",
          amd: "Does not offer it",
          intel: "Intel Foundry",
        },
      },
    ],
  },
]
