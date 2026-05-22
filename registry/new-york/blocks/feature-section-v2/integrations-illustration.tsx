"use client"

import { cn } from "@/lib/utils"

import { FeatureIllustration } from "./feature-illustration"
import { featureIllustrationViewBoxes } from "./features"
import { useInViewOnce } from "./use-in-view-once"

export default function IntegrationsIllustration() {
  const { ref, active } = useInViewOnce()

  return (
    <div ref={ref} className="size-full min-h-0">
      <FeatureIllustration
        viewBox={featureIllustrationViewBoxes.integrations}
        svgClassName={cn("fsv2-in-chart", active && "fsv2-in-chart--active")}
      >
        <rect
          x="28"
          y="24"
          width="432"
          height="334"
          fill="var(--card)"
          stroke="url(#fsv2_in_frame)"
        />

        <path
          className="fsv2-in-spoke fsv2-in-spoke--1"
          pathLength={1}
          d="M244 191 L120 100"
          stroke="url(#fsv2_in_line)"
          strokeOpacity="0.45"
          fill="none"
        />
        <path
          className="fsv2-in-spoke fsv2-in-spoke--2"
          pathLength={1}
          d="M244 191 L368 100"
          stroke="url(#fsv2_in_line)"
          strokeOpacity="0.45"
          fill="none"
        />
        <path
          className="fsv2-in-spoke fsv2-in-spoke--3"
          pathLength={1}
          d="M244 191 L96 220"
          stroke="url(#fsv2_in_line)"
          strokeOpacity="0.35"
          fill="none"
        />
        <path
          className="fsv2-in-spoke fsv2-in-spoke--4"
          pathLength={1}
          d="M244 191 L392 220"
          stroke="url(#fsv2_in_line)"
          strokeOpacity="0.35"
          fill="none"
        />
        <path
          className="fsv2-in-spoke fsv2-in-spoke--5"
          pathLength={1}
          d="M244 191 L244 300"
          stroke="url(#fsv2_in_line)"
          strokeOpacity="0.5"
          fill="none"
        />

        <g className="fsv2-in-node fsv2-in-node--1 motion-safe:transition-transform duration-200 ease-out group-hover/card:-translate-y-1">
          <rect
            x="88"
            y="72"
            width="64"
            height="48"
            rx="4"
            fill="var(--card)"
            stroke="currentColor"
            strokeOpacity="0.35"
          />
          <line x1="100" y1="88" x2="140" y2="88" stroke="currentColor" strokeOpacity="0.4" />
          <line x1="100" y1="104" x2="128" y2="104" stroke="currentColor" strokeOpacity="0.25" />
        </g>

        <g className="fsv2-in-node fsv2-in-node--2 motion-safe:transition-transform duration-200 ease-out group-hover/card:-translate-y-1">
          <rect
            x="336"
            y="72"
            width="64"
            height="48"
            rx="4"
            fill="var(--card)"
            stroke="currentColor"
            strokeOpacity="0.35"
          />
          <line x1="348" y1="88" x2="388" y2="88" stroke="currentColor" strokeOpacity="0.4" />
          <line x1="348" y1="104" x2="376" y2="104" stroke="currentColor" strokeOpacity="0.25" />
        </g>

        <g className="fsv2-in-node fsv2-in-node--3 motion-safe:transition-transform duration-200 ease-out group-hover/card:translate-x-1">
          <rect
            x="64"
            y="196"
            width="64"
            height="48"
            rx="4"
            fill="var(--card)"
            stroke="currentColor"
            strokeOpacity="0.28"
          />
          <line x1="76" y1="212" x2="116" y2="212" stroke="currentColor" strokeOpacity="0.3" />
        </g>

        <g className="fsv2-in-node fsv2-in-node--4 motion-safe:transition-transform duration-200 ease-out group-hover/card:-translate-x-1">
          <rect
            x="360"
            y="196"
            width="64"
            height="48"
            rx="4"
            fill="var(--card)"
            stroke="currentColor"
            strokeOpacity="0.28"
          />
          <line x1="372" y1="212" x2="412" y2="212" stroke="currentColor" strokeOpacity="0.3" />
        </g>

        <g className="fsv2-in-node fsv2-in-node--5 motion-safe:transition-transform duration-200 ease-out group-hover/card:translate-y-1">
          <rect
            x="212"
            y="276"
            width="64"
            height="48"
            rx="4"
            fill="var(--card)"
            stroke="currentColor"
            strokeOpacity="0.4"
          />
          <line x1="224" y1="292" x2="264" y2="292" stroke="currentColor" strokeOpacity="0.35" />
        </g>

        <g className="fsv2-in-hub">
          <circle
            cx="244"
            cy="191"
            r="44"
            fill="var(--card)"
            stroke="url(#fsv2_in_hub)"
            strokeWidth="1.5"
          />
          <circle cx="244" cy="191" r="6" fill="currentColor" fillOpacity="0.7" />
          <line x1="244" y1="163" x2="244" y2="219" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="216" y1="191" x2="272" y2="191" stroke="currentColor" strokeOpacity="0.5" />
        </g>

        <defs>
          <linearGradient
            id="fsv2_in_frame"
            x1="244"
            y1="24"
            x2="244"
            y2="358"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" />
            <stop offset="0.8" stopColor="var(--card)" />
          </linearGradient>
          <linearGradient
            id="fsv2_in_hub"
            x1="244"
            y1="147"
            x2="244"
            y2="235"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" />
            <stop offset="1" stopColor="var(--foreground)" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient
            id="fsv2_in_line"
            x1="244"
            y1="191"
            x2="244"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" stopOpacity="0.6" />
            <stop offset="1" stopColor="var(--foreground)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </FeatureIllustration>
    </div>
  )
}
