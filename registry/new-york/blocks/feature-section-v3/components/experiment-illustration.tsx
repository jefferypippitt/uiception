"use client"

import { cn } from "@/lib/utils"

import { FeatureIllustration } from "./feature-illustration"
import { featureIllustrationViewBoxes } from "../lib/features"
import { useInViewOnce } from "../lib/use-in-view-once"

export default function ExperimentIllustration() {
  const { ref, active } = useInViewOnce()

  return (
    <div ref={ref} className="size-full min-h-0">
      <FeatureIllustration
        viewBox={featureIllustrationViewBoxes["experiment-impact"]}
        svgClassName={cn("fsv3-ex-chart", active && "fsv3-ex-chart--active")}
      >
        <rect
          x="28"
          y="32"
          width="432"
          height="318"
          rx="2"
          fill="var(--card)"
          stroke="url(#fsv3_ex_frame)"
        />
        <line x1="28" y1="72" x2="460" y2="72" stroke="currentColor" strokeOpacity="0.3" />
        <rect
          x="48"
          y="48"
          width="48"
          height="16"
          rx="8"
          stroke="currentColor"
          strokeOpacity="0.4"
        />
        <circle cx="60" cy="56" r="3" fill="#22c55e" fillOpacity="0.9" />
        <line x1="68" y1="56" x2="84" y2="56" stroke="currentColor" strokeOpacity="0.5" />

        <path
          d="M56 108H404M56 148H404M56 188H404M56 228H404"
          stroke="currentColor"
          strokeOpacity="0.07"
        />

        <g className="fsv3-ex-launch">
          <line
            x1="196"
            y1="96"
            x2="196"
            y2="248"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeDasharray="4 4"
          />
          <rect
            x="184"
            y="252"
            width="24"
            height="14"
            rx="3"
            stroke="currentColor"
            strokeOpacity="0.35"
          />
          <line x1="188" y1="259" x2="204" y2="259" stroke="currentColor" strokeOpacity="0.4" />
        </g>

        <path
          className="fsv3-ex-control"
          pathLength={1}
          d="M56 208 L120 206 L156 207 L196 208"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          className="fsv3-ex-control fsv3-ex-control--variant"
          pathLength={1}
          d="M196 208 L232 205 L268 196 L304 178 L340 158 L376 132 L412 108"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        <g className="fsv3-ex-lift motion-safe:transition-[opacity,transform] duration-200 ease-out group-hover/card:-translate-y-0.5 group-hover/card:opacity-100 opacity-90">
          <path
            className="fsv3-ex-lift__area"
            d="M196 208 L232 200 L268 182 L304 158 L340 128 L376 98 L412 72 L412 208 L196 208 Z"
            fill="url(#fsv3_ex_area)"
            fillOpacity="0.12"
          />
          <path
            className="fsv3-ex-lift__line"
            pathLength={1}
            d="M196 208 L232 200 L268 182 L304 158 L340 128 L376 98 L412 72"
            stroke="url(#fsv3_ex_lift)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <g className="fsv3-ex-lift__endpoint">
            <circle cx="412" cy="72" r="4" fill="currentColor" fillOpacity="0.75" />
            <line
              x1="376"
              y1="72"
              x2="412"
              y2="72"
              stroke="currentColor"
              strokeOpacity="0.5"
              strokeDasharray="3 2"
            />
          </g>
        </g>

        <line x1="56" y1="268" x2="404" y2="268" stroke="currentColor" strokeOpacity="0.12" />

        <g className="fsv3-ex-pipeline">
          <circle
            className="fsv3-ex-pipeline__node"
            cx="88"
            cy="296"
            r="5"
            fill="var(--card)"
            stroke="currentColor"
            strokeOpacity="0.35"
          />
          <line
            className="fsv3-ex-pipeline__link"
            x1="96"
            y1="296"
            x2="168"
            y2="296"
            stroke="currentColor"
            strokeOpacity="0.2"
          />

          <circle
            className="fsv3-ex-pipeline__node"
            cx="196"
            cy="296"
            r="6"
            fill="var(--card)"
            stroke="currentColor"
            strokeOpacity="0.55"
          />
          <line
            className="fsv3-ex-pipeline__link"
            x1="204"
            y1="296"
            x2="276"
            y2="296"
            stroke="currentColor"
            strokeOpacity="0.3"
          />

          <circle
            className="fsv3-ex-pipeline__node fsv3-ex-pipeline__node--impact"
            cx="340"
            cy="296"
            r="7"
            fill="currentColor"
            fillOpacity="0.15"
            stroke="currentColor"
            strokeOpacity="0.75"
          />
          <circle
            className="fsv3-ex-pipeline__node fsv3-ex-pipeline__node--impact"
            cx="340"
            cy="296"
            r="3"
            fill="currentColor"
            fillOpacity="0.7"
          />
        </g>

        <defs>
          <linearGradient
            id="fsv3_ex_frame"
            x1="244"
            y1="32"
            x2="244"
            y2="350"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" />
            <stop offset="0.8" stopColor="var(--background)" />
          </linearGradient>
          <linearGradient
            id="fsv3_ex_lift"
            x1="196"
            y1="208"
            x2="412"
            y2="72"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" stopOpacity="0.35" />
            <stop offset="1" stopColor="var(--foreground)" />
          </linearGradient>
          <linearGradient
            id="fsv3_ex_area"
            x1="196"
            y1="208"
            x2="412"
            y2="72"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--foreground)" stopOpacity="0.35" />
          </linearGradient>
        </defs>
      </FeatureIllustration>
    </div>
  )
}
