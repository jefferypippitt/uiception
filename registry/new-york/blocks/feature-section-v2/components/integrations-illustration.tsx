"use client"

import type { SVGProps } from "react"
import { useId } from "react"
import { cn } from "@/lib/utils"

import { GithubDark } from "@/components/ui/svgs/githubDark"
import { VercelDark } from "@/components/ui/svgs/vercelDark"
import { Supabase }   from "@/components/ui/svgs/supabase"
import { OpenaiDark } from "@/components/ui/svgs/openaiDark"

import type { SyncStatus } from "../hooks/use-integrations-animation"
import { useFsv2IllustrationActive }  from "../hooks/use-fsv2-illustration-active"
import { useIntegrationsAnimation }   from "../hooks/use-integrations-animation"
import "../styles/integrations-illustration.css"

/* ── Icon registry ───────────────────────────────────────────────────────── */

type IconComp = React.ComponentType<SVGProps<SVGSVGElement>>

const ICON_MAP: Record<string, IconComp> = {
  github:   GithubDark,
  vercel:   VercelDark,
  supabase: Supabase,
  openai:   OpenaiDark,
}

/** Stroke / fill accent per brand */
const CHART_ACCENT: Record<string, string> = {
  github:   "#39d353",
  vercel:   "#e4e4e7",
  supabase: "#3ecf8e",
  openai:   "#74aa9c",
}

/* ── Metric formatter ────────────────────────────────────────────────────── */

function fmtMetric(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return `${n}`
}

function statusLabel(s: SyncStatus): string {
  return s === "syncing" ? "Syncing" : "Connected"
}

/** Map the last N absolute readings into 0–100 for the SVG (shape = recent relative range) */
function normalizeMetricWindow(values: number[]): number[] {
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (max === min) return values.map(() => 50)
  return values.map((v) => ((v - min) / (max - min)) * 100)
}

/* ── SVG area + line chart ───────────────────────────────────────────────── */

function IntegrationChart({
  integrationId,
  values,
}: {
  integrationId: string
  values:        number[]
}) {
  const rawId  = useId()
  const gradId = `itg-chart-grad-${rawId.replace(/:/g, "")}`
  const accent = CHART_ACCENT[integrationId] ?? "#71717a"
  const n      = values.length
  const padX   = 1.5
  const padY   = 2.5
  const w      = 100
  const h      = 34
  const bottom = h - padY
  const spanX  = w - 2 * padX
  const spanY  = bottom - padY

  const pts = values.map((v, i) => {
    const x = n <= 1 ? padX + spanX / 2 : padX + (i / (n - 1)) * spanX
    const y = bottom - (v / 100) * spanY
    return [x, y] as const
  })

  const lineD =
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`).join(" ")
  const areaD =
    `M ${pts[0]![0]},${bottom} ` +
    pts.map((p) => `L ${p[0]},${p[1]}`).join(" ") +
    ` L ${pts[n - 1]![0]},${bottom} Z`

  return (
    <div className="itg-chart-wrap">
      <svg
        className="itg-chart"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line
          className="itg-chart-baseline"
          x1={padX}
          y1={bottom}
          x2={w - padX}
          y2={bottom}
        />
        <path className="itg-chart-area" d={areaD} fill={`url(#${gradId})`} />
        <path
          className="itg-chart-line"
          d={lineD}
          fill="none"
          stroke={accent}
        />
      </svg>
    </div>
  )
}

/* ── Component ───────────────────────────────────────────────────────────── */

export default function IntegrationsIllustration() {
  const { ref, active } = useFsv2IllustrationActive()
  const { integrations, metrics, metricHistory, statuses, flashIdx } =
    useIntegrationsAnimation(active)

  return (
    <div ref={ref} className="itg-root">
      <div className="itg-window">
        <div className="itg-header" aria-hidden>
          <span className="itg-header-skip" />
          <span className="itg-header-label itg-header-label--source">Source</span>
          <span className="itg-header-label itg-header-label--metric">Metric</span>
          <span className="itg-header-label itg-header-label--window">Window</span>
          <span className="itg-header-label itg-header-label--value">Value</span>
          <span className="itg-header-label itg-header-label--status" />
        </div>

        <div className="itg-rows" role="list">
            {integrations.map((app, i) => {
              const Icon    = ICON_MAP[app.id]!
              const status  = statuses[i]!
              const syncing = status === "syncing"
              const flash   = flashIdx === i
              const value   = metrics[i]!
              const chart   = normalizeMetricWindow(metricHistory[i]!)

              return (
                <div
                  key={app.id}
                  role="listitem"
                  className={cn("itg-row", flash && "itg-row--flash")}
                  aria-label={`${app.name}, ${fmtMetric(value)} ${app.metric}, ${statusLabel(status)}. Sample window trend shown visually.`}
                >
                  <span className="itg-logo" aria-hidden>
                    <Icon className="itg-logo-svg" />
                  </span>

                  <span className="itg-name">{app.name}</span>

                  <span className="itg-col-label">{app.metric}</span>

                  <IntegrationChart
                    integrationId={app.id}
                    values={chart}
                  />

                  <span
                    className={cn(
                      "itg-metric",
                      flash &&
                        (syncing ? "itg-metric--flash-amber" : "itg-metric--flash-emerald"),
                    )}
                  >
                    {fmtMetric(value)}
                  </span>

                  <span className="itg-status" title={statusLabel(status)}>
                    <span
                      className={cn(
                        "itg-status-dot",
                        syncing ? "itg-status-dot--syncing" : "itg-status-dot--on",
                      )}
                      aria-hidden
                    />
                    <span className="itg-sr-only">{statusLabel(status)}</span>
                  </span>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
