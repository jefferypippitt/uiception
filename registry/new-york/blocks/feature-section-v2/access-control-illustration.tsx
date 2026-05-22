"use client"

import { cn } from "@/lib/utils"

import { FeatureIllustration } from "./feature-illustration"
import { featureIllustrationViewBoxes } from "./features"
import { useInViewOnce } from "./use-in-view-once"

export default function AccessControlIllustration() {
  const { ref, active } = useInViewOnce()

  return (
    <div ref={ref} className="size-full min-h-0">
      <FeatureIllustration
        viewBox={featureIllustrationViewBoxes["access-control"]}
        svgClassName={cn("fsv2-ac-chart", active && "fsv2-ac-chart--active")}
      >
        <g className="fsv2-ac-layer fsv2-ac-layer--3">
          <rect
            x="72"
            y="56"
            width="344"
            height="280"
            fill="var(--card)"
            stroke="url(#fsv2_ac_layer3)"
            strokeOpacity="0.35"
          />
          <line x1="96" y1="96" x2="392" y2="96" stroke="currentColor" strokeOpacity="0.12" />
          <line x1="96" y1="128" x2="320" y2="128" stroke="currentColor" strokeOpacity="0.08" />
        </g>

        <g className="fsv2-ac-layer fsv2-ac-layer--2">
          <rect
            x="56"
            y="44"
            width="344"
            height="280"
            fill="var(--card)"
            stroke="url(#fsv2_ac_layer2)"
            strokeOpacity="0.55"
          />
          <line x1="80" y1="84" x2="376" y2="84" stroke="currentColor" strokeOpacity="0.2" />
          <line x1="80" y1="116" x2="340" y2="116" stroke="currentColor" strokeOpacity="0.14" />
          <rect
            x="80"
            y="140"
            width="72"
            height="20"
            rx="4"
            stroke="currentColor"
            strokeOpacity="0.25"
          />
        </g>

        <g className="fsv2-ac-layer fsv2-ac-layer--1 motion-safe:transition-transform duration-200 ease-out group-hover/card:-translate-y-0.5">
          <rect
            x="40"
            y="32"
            width="344"
            height="280"
            fill="var(--card)"
            stroke="url(#fsv2_ac_layer1)"
          />
          <line x1="64" y1="72" x2="360" y2="72" stroke="currentColor" strokeOpacity="0.35" />
          <line x1="64" y1="104" x2="360" y2="104" stroke="currentColor" strokeOpacity="0.28" />
          <line x1="64" y1="136" x2="300" y2="136" stroke="currentColor" strokeOpacity="0.2" />
          <line x1="64" y1="168" x2="360" y2="168" stroke="currentColor" strokeOpacity="0.14" />

          <rect
            x="64"
            y="292"
            width="56"
            height="18"
            rx="4"
            stroke="currentColor"
            strokeOpacity="0.35"
          />
          <rect
            x="132"
            y="292"
            width="72"
            height="18"
            rx="4"
            stroke="currentColor"
            strokeOpacity="0.2"
          />
        </g>

        <g className="fsv2-ac-lock">
          <rect
            x="196"
            y="188"
            width="96"
            height="88"
            rx="6"
            fill="var(--card)"
            stroke="url(#fsv2_ac_lock)"
          />
          <path
            d="M228 224V212C228 200.954 236.954 192 248 192C259.046 192 268 200.954 268 212V224"
            stroke="currentColor"
            strokeOpacity="0.75"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <rect
            x="220"
            y="224"
            width="56"
            height="40"
            rx="4"
            stroke="currentColor"
            strokeOpacity="0.75"
          />
          <circle cx="248" cy="240" r="4" fill="currentColor" fillOpacity="0.6" />
          <line x1="248" y1="244" x2="248" y2="252" stroke="currentColor" strokeOpacity="0.5" />
        </g>

        <defs>
          <linearGradient
            id="fsv2_ac_layer1"
            x1="212"
            y1="32"
            x2="212"
            y2="312"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" />
            <stop offset="0.8" stopColor="var(--foreground)" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="fsv2_ac_layer2"
            x1="228"
            y1="44"
            x2="228"
            y2="324"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" stopOpacity="0.7" />
            <stop offset="0.8" stopColor="var(--foreground)" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="fsv2_ac_layer3"
            x1="244"
            y1="56"
            x2="244"
            y2="336"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" stopOpacity="0.4" />
            <stop offset="0.8" stopColor="var(--foreground)" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="fsv2_ac_lock"
            x1="244"
            y1="188"
            x2="244"
            y2="276"
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
