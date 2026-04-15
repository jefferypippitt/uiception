"use client"

import { cn } from "@/lib/utils"

import { useFsv2IllustrationActive } from "../hooks/use-fsv2-illustration-active"
import { useAnalyticsAnimation }     from "../hooks/use-analytics-animation"
import "../styles/analytics-illustration.css"

/* ── SVG chart path builder — straight lines for stock-chart feel ─────────── */

function buildChart(data: number[], W = 240, H = 60) {
  const PAD_T = 8
  const PAD_B = 0
  const n = data.length

  const min = Math.min(...data) * 0.88
  const max = Math.max(...data) * 1.04
  const range = max - min || 1

  const px = (i: number) => (i / (n - 1)) * W
  const py = (v: number) => PAD_T + (1 - (v - min) / range) * (H - PAD_T - PAD_B)

  // Straight segments — stock chart look
  let line = `M ${px(0).toFixed(2)} ${py(data[0]!).toFixed(2)}`
  for (let i = 1; i < n; i++) {
    line += ` L ${px(i).toFixed(2)} ${py(data[i]!).toFixed(2)}`
  }

  const sum = data.reduce((acc, v) => acc + v, 0)
  const avg = sum / n

  const lx = px(n - 1)
  const yLatest = py(data[n - 1]!)
  const yAverage = py(avg)
  const area = `${line} L ${lx.toFixed(2)} ${H + 2} L 0 ${H + 2} Z`

  // Grid Y positions at 25 / 50 / 75 % of chart area
  const gridYs = [0.25, 0.5, 0.75].map(t => PAD_T + t * (H - PAD_T - PAD_B))

  return { line, area, lx, yLatest, yAverage, gridYs }
}

/* ── Component ───────────────────────────────────────────────────────────── */

const W = 240
const H = 60

export default function AnalyticsIllustration() {
  const { ref, active } = useFsv2IllustrationActive()
  const { chartData, users, events, flashUser, trend } = useAnalyticsAnimation(active)

  const { line, area, lx, yLatest, yAverage, gridYs } = buildChart(chartData, W, H)

  const isUp   = trend === "up"
  const color  = isUp ? "#4ade80" : "#ef4444"
  const colorA = isUp ? "rgba(74,222,128," : "rgba(239,68,68,"

  return (
    <div ref={ref} className="ana-root">
      <div className="ana-window">

        {/* ── Primary metric ── */}
        <div className="ana-metric-section">
          <div className="ana-metric-left">
            <span className="ana-metric-label">Active Users</span>
            <span className={cn("ana-metric-value", flashUser && "ana-metric-value--flash")}>
              {users}
            </span>
          </div>
          <div className="ana-metric-right">
            <span className="ana-period-label">live</span>
          </div>
        </div>

        {/* ── Chart ── */}
        <div className="ana-chart">
          <svg
            className="ana-chart-svg"
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <defs>
              <linearGradient id="ana-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={`${colorA}0.18)`} />
                <stop offset="100%" stopColor={`${colorA}0.00)`} />
              </linearGradient>
            </defs>

            {/* Horizontal grid lines */}
            {gridYs.map((y, i) => (
              <line key={i} x1="0" y1={y} x2={W} y2={y}
                stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
            ))}

            {/* Window average — reference line (live count is the dot) */}
            <line x1="0" y1={yAverage} x2={W} y2={yAverage}
              stroke="rgba(161,161,170,0.38)" strokeWidth="0.65"
              strokeDasharray="3 3.5" />

            {/* Area fill + line */}
            <path d={area} fill="url(#ana-grad)" />
            <path d={line} fill="none" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />

            {/* Live endpoint */}
            <circle cx={lx} cy={yLatest} r="5" fill="none"
              stroke={`${colorA}0.35)`} strokeWidth="1.5"
              style={{ animation: "ana-ring-pulse 1.8s ease-out infinite" }} />
            <circle cx={lx} cy={yLatest} r="2" fill={color} />
          </svg>
        </div>

        {/* ── Secondary stats ── */}
        <div className="ana-stats">
          <div className="ana-stat">
            <span className="ana-stat-value">{events}</span>
            <span className="ana-stat-label">events / min</span>
          </div>
          <div className="ana-stat">
            <span className="ana-stat-value">99.4%</span>
            <span className="ana-stat-label">uptime</span>
          </div>
          <div className="ana-stat">
            <span className="ana-stat-value">142ms</span>
            <span className="ana-stat-label">latency</span>
          </div>
        </div>

      </div>
    </div>
  )
}
