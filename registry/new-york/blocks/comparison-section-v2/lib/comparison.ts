import type { ComponentType, SVGProps } from "react"

import { DoordashWordmark } from "@/components/ui/svgs/doordashWordmark"
import { InstacartWordmarkDark } from "@/components/ui/svgs/instacartWordmarkDark"
import { InstacartWordmarkLight } from "@/components/ui/svgs/instacartWordmarkLight"
import { UberDark } from "@/components/ui/svgs/uberDark"
import { UberLight } from "@/components/ui/svgs/uberLight"

export type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

export type CompanyId = "doordash" | "uber" | "instacart"

export type Company = {
  id: CompanyId
  name: string
  /** The logo already spells the name, so the row does not repeat it. */
  wordmark?: boolean
  /** Uber’s figures are its Delivery segment, not the whole company. */
  note?: string
  logoLight: SvgComponent
  logoDark?: SvgComponent
  logoClassName: string
}

export type ComparisonBar = {
  companyId: CompanyId
  value: string
  widthClass: string
}

export type ComparisonChart = {
  id: string
  label: string
  bars: ComparisonBar[]
}

export const comparisonHeader = {
  title: "What delivery sold in 2025",
} as const

export const companies: Company[] = [
  {
    id: "doordash",
    name: "DoorDash",
    wordmark: true,
    logoLight: DoordashWordmark,
    logoClassName: "h-4 w-auto",
  },
  {
    id: "uber",
    name: "Uber",
    wordmark: true,
    note: "Delivery",
    logoLight: UberLight,
    logoDark: UberDark,
    logoClassName: "h-4 w-auto",
  },
  {
    id: "instacart",
    name: "Instacart",
    wordmark: true,
    logoLight: InstacartWordmarkLight,
    logoDark: InstacartWordmarkDark,
    logoClassName: "h-6 w-auto",
  },
]

export const charts: ComparisonChart[] = [
  {
    id: "revenue",
    label: "Revenue",
    bars: [
      { companyId: "doordash", value: "$13.7 billion", widthClass: "w-[80%]" },
      { companyId: "uber", value: "$17.2 billion", widthClass: "w-full" },
      { companyId: "instacart", value: "$3.7 billion", widthClass: "w-[22%]" },
    ],
  },
  {
    id: "order-value",
    label: "Order value",
    bars: [
      { companyId: "doordash", value: "$102 billion", widthClass: "w-full" },
      { companyId: "uber", value: "$91 billion", widthClass: "w-[89%]" },
      { companyId: "instacart", value: "$37 billion", widthClass: "w-[36%]" },
    ],
  },
]
