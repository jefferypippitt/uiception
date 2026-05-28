"use client"

import { cn } from "@/lib/utils"

import { FeatureIllustration } from "./feature-illustration"
import { featureIllustrationViewBoxes } from "../lib/features"
import { useInViewOnce } from "../lib/use-in-view-once"

export default function WorkflowAutomationIllustration() {
  const { ref, active } = useInViewOnce()

  return (
    <div ref={ref} className="size-full min-h-0">
      <FeatureIllustration
        viewBox={featureIllustrationViewBoxes["workflow-automation"]}
        svgClassName={cn("fsv2-wf-chart", active && "fsv2-wf-chart--active")}
      >
        <rect
          x="24"
          y="28"
          width="440"
          height="326"
          rx="2"
          fill="var(--card)"
          stroke="url(#fsv2_wf_frame)"
        />
        <line x1="24" y1="68" x2="464" y2="68" stroke="currentColor" strokeOpacity="0.35" />
        <circle cx="44" cy="48" r="4" stroke="currentColor" strokeOpacity="0.5" />
        <circle cx="58" cy="48" r="4" stroke="currentColor" strokeOpacity="0.35" />
        <circle cx="72" cy="48" r="4" stroke="currentColor" strokeOpacity="0.2" />

        <g className="fsv2-wf-trigger">
          <rect
            x="48"
            y="108"
            width="112"
            height="88"
            rx="4"
            fill="var(--card)"
            stroke="url(#fsv2_wf_panel)"
            strokeDasharray="6 4"
          />
          <line x1="64" y1="132" x2="144" y2="132" stroke="currentColor" strokeOpacity="0.55" />
          <line x1="64" y1="152" x2="128" y2="152" stroke="currentColor" strokeOpacity="0.35" />
          <line x1="64" y1="172" x2="136" y2="172" stroke="currentColor" strokeOpacity="0.25" />
        </g>

        <g className="motion-safe:transition-transform duration-200 ease-out group-hover/card:translate-x-0.5">
          <path
            className="fsv2-wf-flow__line"
            pathLength={1}
            d="M176 152H208"
            stroke="url(#fsv2_wf_flow)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            className="fsv2-wf-flow__arrow"
            d="M208 152L198 146"
            stroke="currentColor"
            strokeOpacity="0.6"
            strokeLinecap="round"
          />
          <path
            className="fsv2-wf-flow__arrow"
            d="M208 152L198 158"
            stroke="currentColor"
            strokeOpacity="0.6"
            strokeLinecap="round"
          />
        </g>

        <g className="fsv2-wf-queue">
          <rect
            x="224"
            y="96"
            width="216"
            height="200"
            rx="4"
            fill="var(--card)"
            stroke="url(#fsv2_wf_panel)"
          />
          <rect
            x="240"
            y="116"
            width="184"
            height="28"
            rx="3"
            stroke="currentColor"
            strokeOpacity="0.15"
          />
          <rect
            x="240"
            y="156"
            width="184"
            height="28"
            rx="3"
            stroke="currentColor"
            strokeOpacity="0.55"
            fill="currentColor"
            fillOpacity="0.04"
          />
          <circle cx="252" cy="170" r="4" fill="currentColor" fillOpacity="0.7" />
          <rect
            x="240"
            y="196"
            width="184"
            height="28"
            rx="3"
            stroke="currentColor"
            strokeOpacity="0.12"
          />
          <rect
            x="240"
            y="236"
            width="184"
            height="28"
            rx="3"
            stroke="currentColor"
            strokeOpacity="0.08"
          />
        </g>

        <rect
          x="388"
          y="40"
          width="52"
          height="18"
          rx="9"
          stroke="currentColor"
          strokeOpacity="0.45"
        />
        <circle cx="426" cy="49" r="6" fill="currentColor" fillOpacity="0.35" />

        <defs>
          <linearGradient
            id="fsv2_wf_frame"
            x1="244"
            y1="28"
            x2="244"
            y2="354"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" />
            <stop offset="0.8" stopColor="var(--card)" />
          </linearGradient>
          <linearGradient
            id="fsv2_wf_panel"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
            gradientUnits="objectBoundingBox"
          >
            <stop stopColor="var(--foreground)" />
            <stop offset="0.75" stopColor="var(--foreground)" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="fsv2_wf_flow"
            x1="176"
            y1="152"
            x2="208"
            y2="152"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" stopOpacity="0.2" />
            <stop offset="1" stopColor="var(--foreground)" />
          </linearGradient>
        </defs>
      </FeatureIllustration>
    </div>
  )
}
