export type Stat = {
  id: string
  description: string
  numeric: number
  prefix: string
  suffix: string
  decimals?: number
  useLocale?: boolean
}

export const LABEL = "By the numbers"

export const HEADING = "The platform serious investors trust."

export const STATS: Stat[] = [
  {
    id: "instruments",
    description: "Stocks, ETFs, and options monitored in real time",
    numeric: 12000,
    prefix: "",
    suffix: "+",
    useLocale: true,
  },
  {
    id: "speed",
    description: "Average signal detection speed across global markets",
    numeric: 47,
    prefix: "",
    suffix: "ms",
  },
  {
    id: "users",
    description: "Portfolio managers who made the switch last year",
    numeric: 8400,
    prefix: "",
    suffix: "+",
    useLocale: true,
  },
  {
    id: "assets",
    description: "Assets under analysis across all connected accounts",
    numeric: 2.1,
    prefix: "$",
    suffix: "T+",
    decimals: 1,
  },
]

export function formatStat(stat: Stat): string {
  const n = stat.decimals
    ? stat.numeric.toFixed(stat.decimals)
    : stat.useLocale
      ? stat.numeric.toLocaleString()
      : String(stat.numeric)
  return `${stat.prefix}${n}${stat.suffix}`
}
