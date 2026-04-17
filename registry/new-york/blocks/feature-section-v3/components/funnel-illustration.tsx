"use client"

import {
  ArrowDownRight,
  ChevronRight,
  LayoutDashboard,
  SearchCheck,
  Settings,
  Users,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  type ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

import { useFsv3IllustrationActive } from "../hooks/use-fsv3-illustration-active"
import { useFunnelAnimation } from "../hooks/use-funnel-animation"

const STAGES = [
  { name: "Visit", value: 12482 },
  { name: "Product", value: 8430 },
  { name: "Checkout", value: 2310 },
  { name: "Paid", value: 1260 },
] as const

const CHART_CONFIG = {
  count: { label: "People", color: "#f59e0b" },
} satisfies ChartConfig

const chartData = [...STAGES].reverse().map((row, idx) => ({
  ...row,
  isOpportunity: idx === 1,
}))

export default function FunnelIllustration() {
  const active = useFsv3IllustrationActive()
  const { isResult, scanIndex } = useFunnelAnimation(active)

  return (
    <div className="flex size-full overflow-hidden rounded-lg border border-border bg-card">
      <aside className="flex w-7 shrink-0 flex-col items-center gap-1 border-r border-border bg-muted/25 py-1.5">
        <span className="flex size-6 items-center justify-center rounded-md bg-muted text-foreground">
          <LayoutDashboard className="size-3" aria-hidden />
        </span>
        <span className="flex size-6 items-center justify-center rounded-md text-muted-foreground">
          <Users className="size-3" aria-hidden />
        </span>
        <span className="flex size-6 items-center justify-center rounded-md text-muted-foreground">
          <SearchCheck className="size-3" aria-hidden />
        </span>
        <span className="flex size-6 items-center justify-center rounded-md text-muted-foreground">
          <Settings className="size-3" aria-hidden />
        </span>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-7 shrink-0 items-center justify-between gap-2 border-b border-border px-2.5">
          <nav className="flex min-w-0 items-center gap-0.5 text-[10px]" aria-label="Breadcrumb">
            <span className="truncate text-muted-foreground">Dashboard</span>
            <ChevronRight className="size-2.5 shrink-0 text-muted-foreground/70" aria-hidden />
            <span className="truncate font-medium text-foreground">Opportunity finder</span>
          </nav>
          <Badge variant="secondary" className="h-4 shrink-0 px-1.5 text-[10px] font-normal">
            Last 7d
          </Badge>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-1 p-1.5">
          <div className="rounded-md border border-border bg-background/70 p-1.5">
            <ChartContainer config={CHART_CONFIG} className="aspect-auto h-[88px] w-full">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
                accessibilityLayer
              >
                <CartesianGrid horizontal={false} strokeDasharray="2 4" className="stroke-border/65" />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={50}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9 }}
                  className="fill-muted-foreground"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel className="px-2 py-1 text-[10px]" />}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={14}>
                  {chartData.map((row) => (
                    <Cell
                      key={row.name}
                      fill={row.isOpportunity && isResult ? "#d97706" : "var(--color-count)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>

          <Separator />

          <div className="rounded-md border border-border bg-muted/25 p-1.5">
            <div className="flex items-center justify-between text-[9px] text-muted-foreground">
              <span>Opportunity confidence</span>
              <span className="font-mono tabular-nums text-foreground">
                {isResult ? "82%" : `${Math.min(25 + scanIndex * 18, 79)}%`}
              </span>
            </div>
            <Progress
              value={isResult ? 82 : Math.min(25 + scanIndex * 18, 79)}
              className="mt-1 h-1 **:data-[slot=progress-indicator]:bg-amber-500/75"
            />
            <p className="mt-1 text-[9px] leading-snug text-muted-foreground">
              {isResult ? (
                <>
                  Biggest gap at <span className="font-medium text-amber-600 dark:text-amber-400">Checkout</span>
                  {" "}step
                </>
              ) : (
                "Scanning behavior patterns to surface the highest-value gap."
              )}
            </p>
          </div>
        </div>

        <footer className="flex h-6 shrink-0 items-center gap-1.5 px-2.5 text-[10px]">
          {isResult ? (
            <>
              <ArrowDownRight className="size-2.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
              <span className="truncate text-muted-foreground">
                Opportunity found · <span className="font-medium text-foreground">+18% projected lift</span>
              </span>
            </>
          ) : (
            <span className="truncate text-muted-foreground">Looking for the highest-impact drop-off.</span>
          )}
        </footer>
      </main>
    </div>
  )
}
