"use client"

import { cn } from "@/lib/utils"

import { FeatureIllustration } from "./feature-illustration"
import { featureIllustrationViewBoxes } from "./features"
import { useInViewOnce } from "./use-in-view-once"

export default function DropoffIllustration() {
  const { ref, active } = useInViewOnce()

  return (
    <div ref={ref} className="size-full min-h-0">
      <FeatureIllustration
        viewBox={featureIllustrationViewBoxes["dropoff-diagnosis"]}
        svgClassName={cn("fsv3-do-chart", active && "fsv3-do-chart--active")}
      >
        <rect
          x="32"
          y="24"
          width="424"
          height="334"
          rx="2"
          fill="var(--card)"
          stroke="url(#fsv3_do_frame)"
        />
        <line x1="32" y1="64" x2="456" y2="64" stroke="currentColor" strokeOpacity="0.3" />
        <line x1="72" y1="44" x2="120" y2="44" stroke="currentColor" strokeOpacity="0.45" />

        <path
          className="fsv3-do-path"
          pathLength={1}
          d="M168 88 L168 320"
          stroke="url(#fsv3_do_path)"
          strokeWidth="1.5"
          fill="none"
        />
        <circle className="fsv3-do-node fsv3-do-node--1" cx="168" cy="108" r="6" stroke="currentColor" strokeOpacity="0.35" />
        <circle
          className="fsv3-do-node fsv3-do-node--2"
          cx="168"
          cy="168"
          r="8"
          fill="var(--card)"
          stroke="currentColor"
          strokeOpacity="0.55"
        />
        <circle className="fsv3-do-node fsv3-do-node--3" cx="168" cy="228" r="6" stroke="currentColor" strokeOpacity="0.25" />
        <circle className="fsv3-do-node fsv3-do-node--4" cx="168" cy="288" r="5" stroke="currentColor" strokeOpacity="0.15" />

        <g className="fsv3-do-callout motion-safe:transition-transform duration-200 ease-out group-hover/card:-translate-y-0.5">
          <rect
            x="208"
            y="148"
            width="168"
            height="72"
            rx="4"
            fill="var(--card)"
            stroke="url(#fsv3_do_callout)"
          />
          <line x1="224" y1="168" x2="280" y2="168" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="224" y1="184" x2="340" y2="184" stroke="currentColor" strokeOpacity="0.35" />
          <rect
            x="224"
            y="196"
            width="136"
            height="6"
            rx="3"
            fill="currentColor"
            fillOpacity="0.1"
          />
          <rect
            x="224"
            y="196"
            width="112"
            height="6"
            rx="3"
            fill="currentColor"
            fillOpacity="0.45"
          />
          <line
            x1="200"
            y1="168"
            x2="208"
            y2="168"
            stroke="currentColor"
            strokeOpacity="0.4"
            strokeDasharray="3 2"
          />
        </g>

        <line x1="56" y1="320" x2="120" y2="320" stroke="currentColor" strokeOpacity="0.2" />
        <line x1="360" y1="320" x2="420" y2="320" stroke="currentColor" strokeOpacity="0.15" />

        <defs>
          <linearGradient
            id="fsv3_do_frame"
            x1="244"
            y1="24"
            x2="244"
            y2="358"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" />
            <stop offset="0.8" stopColor="var(--background)" />
          </linearGradient>
          <linearGradient
            id="fsv3_do_path"
            x1="168"
            y1="88"
            x2="168"
            y2="320"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" stopOpacity="0.5" />
            <stop offset="1" stopColor="var(--foreground)" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient
            id="fsv3_do_callout"
            x1="292"
            y1="148"
            x2="292"
            y2="220"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" />
            <stop offset="1" stopColor="var(--foreground)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </FeatureIllustration>
    </div>
  )
}
