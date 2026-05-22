"use client"

import { cn } from "@/lib/utils"

import { FeatureIllustration } from "./feature-illustration"
import { featureIllustrationViewBoxes } from "./features"
import { useInViewOnce } from "./use-in-view-once"

export default function RealTimeAnalyticsIllustration() {
  const { ref, active } = useInViewOnce()

  return (
    <div ref={ref} className="size-full min-h-0">
      <FeatureIllustration
        viewBox={featureIllustrationViewBoxes["real-time-analytics"]}
        svgClassName={cn("fsv2-an-chart", active && "fsv2-an-chart--active")}
      >
        <rect
          x="32"
          y="36"
          width="424"
          height="310"
          fill="var(--card)"
          stroke="url(#fsv2_an_frame)"
        />
        <line x1="32" y1="76" x2="456" y2="76" stroke="currentColor" strokeOpacity="0.3" />

        <g className="fsv2-an-live">
          <rect
            x="52"
            y="52"
            width="48"
            height="16"
            rx="8"
            stroke="currentColor"
            strokeOpacity="0.4"
          />
          <circle cx="64" cy="60" r="3" fill="#22c55e" fillOpacity="0.9" />
          <line x1="72" y1="60" x2="88" y2="60" stroke="currentColor" strokeOpacity="0.5" />
        </g>

        <path
          d="M72 108H416M72 148H416M72 188H416M72 228H416M72 268H416M72 308H416"
          stroke="currentColor"
          strokeOpacity="0.08"
        />

        <g className="motion-safe:transition-opacity duration-200 ease-out group-hover/card:opacity-100 opacity-90">
          <path
            className="fsv2-an-spark"
            pathLength={1}
            d="M72 248 L120 220 L168 232 L216 180 L264 196 L312 140 L360 156 L408 108"
            stroke="url(#fsv2_an_spark)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        <rect
          className="fsv2-an-bar fsv2-an-bar--1"
          x="88"
          y="248"
          width="36"
          height="60"
          fill="url(#fsv2_an_bar)"
          fillOpacity="0.25"
          stroke="currentColor"
          strokeOpacity="0.2"
        />
        <rect
          className="fsv2-an-bar fsv2-an-bar--2"
          x="136"
          y="220"
          width="36"
          height="88"
          fill="url(#fsv2_an_bar)"
          fillOpacity="0.3"
          stroke="currentColor"
          strokeOpacity="0.25"
        />
        <rect
          className="fsv2-an-bar fsv2-an-bar--3"
          x="184"
          y="196"
          width="36"
          height="112"
          fill="url(#fsv2_an_bar_active)"
          fillOpacity="0.35"
          stroke="currentColor"
          strokeOpacity="0.65"
        />
        <rect
          className="fsv2-an-bar fsv2-an-bar--4"
          x="232"
          y="212"
          width="36"
          height="96"
          fill="url(#fsv2_an_bar)"
          fillOpacity="0.28"
          stroke="currentColor"
          strokeOpacity="0.22"
        />
        <rect
          className="fsv2-an-bar fsv2-an-bar--5"
          x="280"
          y="168"
          width="36"
          height="140"
          fill="url(#fsv2_an_bar)"
          fillOpacity="0.32"
          stroke="currentColor"
          strokeOpacity="0.28"
        />
        <rect
          className="fsv2-an-bar fsv2-an-bar--6"
          x="328"
          y="184"
          width="36"
          height="124"
          fill="url(#fsv2_an_bar)"
          fillOpacity="0.26"
          stroke="currentColor"
          strokeOpacity="0.2"
        />

        <g className="fsv2-an-marker">
          <line
            x1="184"
            y1="196"
            x2="220"
            y2="196"
            stroke="currentColor"
            strokeOpacity="0.7"
            strokeDasharray="4 3"
          />
          <circle cx="220" cy="196" r="3" fill="currentColor" fillOpacity="0.8" />
        </g>

        <defs>
          <linearGradient
            id="fsv2_an_frame"
            x1="244"
            y1="36"
            x2="244"
            y2="346"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" />
            <stop offset="0.8" stopColor="var(--card)" />
          </linearGradient>
          <linearGradient
            id="fsv2_an_spark"
            x1="72"
            y1="248"
            x2="408"
            y2="108"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" stopOpacity="0.15" />
            <stop offset="1" stopColor="var(--foreground)" />
          </linearGradient>
          <linearGradient
            id="fsv2_an_bar"
            x1="0"
            y1="1"
            x2="0"
            y2="0"
            gradientUnits="objectBoundingBox"
          >
            <stop stopColor="var(--foreground)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--foreground)" />
          </linearGradient>
          <linearGradient
            id="fsv2_an_bar_active"
            x1="0"
            y1="1"
            x2="0"
            y2="0"
            gradientUnits="objectBoundingBox"
          >
            <stop stopColor="var(--foreground)" stopOpacity="0.1" />
            <stop offset="1" stopColor="var(--foreground)" />
          </linearGradient>
        </defs>
      </FeatureIllustration>
    </div>
  )
}
