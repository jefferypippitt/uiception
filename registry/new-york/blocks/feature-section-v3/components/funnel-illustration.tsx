"use client"

import { cn } from "@/lib/utils"

import { FeatureIllustration } from "./feature-illustration"
import { featureIllustrationViewBoxes } from "../lib/features"
import { useInViewOnce } from "../lib/use-in-view-once"

export default function FunnelIllustration() {
  const { ref, active } = useInViewOnce()

  return (
    <div ref={ref} className="size-full min-h-0">
      <FeatureIllustration
        viewBox={featureIllustrationViewBoxes["funnel-opportunities"]}
        svgClassName={cn("fsv3-fn-chart", active && "fsv3-fn-chart--active")}
      >
        <rect
          x="24"
          y="28"
          width="440"
          height="326"
          rx="2"
          fill="var(--card)"
          stroke="url(#fsv3_fn_frame)"
        />
        <line x1="24" y1="68" x2="464" y2="68" stroke="currentColor" strokeOpacity="0.35" />
        <rect
          x="388"
          y="40"
          width="52"
          height="18"
          rx="9"
          stroke="currentColor"
          strokeOpacity="0.45"
        />
        <line x1="400" y1="49" x2="428" y2="49" stroke="currentColor" strokeOpacity="0.5" />

        <g className="fsv3-fn-wedge fsv3-fn-wedge--1">
          <rect
            x="108"
            y="108"
            width="272"
            height="36"
            rx="3"
            fill="var(--card)"
            stroke="url(#fsv3_fn_panel)"
            strokeOpacity="0.35"
          />
        </g>
        <g className="fsv3-fn-wedge fsv3-fn-wedge--2">
          <rect
            x="132"
            y="160"
            width="224"
            height="36"
            rx="3"
            fill="var(--card)"
            stroke="url(#fsv3_fn_panel)"
            strokeOpacity="0.45"
          />
        </g>
        <g className="fsv3-fn-wedge fsv3-fn-wedge--3 fsv3-fn-focal origin-center motion-safe:transition-transform duration-200 ease-out group-hover/card:scale-[1.02]">
          <rect
            x="168"
            y="212"
            width="152"
            height="36"
            rx="3"
            fill="var(--card)"
            stroke="url(#fsv3_fn_focal)"
            strokeWidth="1.5"
          />
          <circle cx="244" cy="230" r="4" fill="currentColor" fillOpacity="0.7" />
          <line x1="184" y1="230" x2="220" y2="230" stroke="currentColor" strokeOpacity="0.55" />
        </g>
        <g className="fsv3-fn-wedge fsv3-fn-wedge--4">
          <rect
            x="196"
            y="264"
            width="96"
            height="28"
            rx="3"
            fill="var(--card)"
            stroke="url(#fsv3_fn_panel)"
            strokeOpacity="0.2"
          />
        </g>

        <g className="fsv3-fn-gap">
          <rect
            x="176"
            y="308"
            width="112"
            height="22"
            rx="4"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeDasharray="4 3"
            pathLength={1}
          />
          <line x1="188" y1="319" x2="276" y2="319" stroke="currentColor" strokeOpacity="0.4" />
        </g>

        <defs>
          <linearGradient
            id="fsv3_fn_frame"
            x1="244"
            y1="28"
            x2="244"
            y2="354"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" />
            <stop offset="0.8" stopColor="var(--background)" />
          </linearGradient>
          <linearGradient
            id="fsv3_fn_panel"
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
            id="fsv3_fn_focal"
            x1="244"
            y1="212"
            x2="244"
            y2="248"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" />
            <stop offset="1" stopColor="var(--foreground)" stopOpacity="0.25" />
          </linearGradient>
        </defs>
      </FeatureIllustration>
    </div>
  )
}
