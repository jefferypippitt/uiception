"use client"

import { cn } from "@/lib/utils"

import { FeatureIllustration } from "./feature-illustration"
import { featureIllustrationViewBoxes } from "./features"
import { IllustrationSlot } from "./illustration-slot"
import { useInViewOnce } from "./use-in-view-once"

export default function GuidesMemoriesIllustration() {
  const { ref, active } = useInViewOnce()

  return (
    <IllustrationSlot ref={ref}>
      <FeatureIllustration
        viewBox={featureIllustrationViewBoxes["guides-memories"]}
        svgClassName={cn("fsv7-guides-chart", active && "fsv7-guides-chart--active")}
      >
        <g className="fsv7-guides-layer fsv7-guides-layer--3">
          <rect
            x="72"
            y="56"
            width="304"
            height="248"
            fill="var(--card)"
            stroke="url(#fsv7_guides_layer3)"
            strokeOpacity="0.35"
          />
          <line x1="96" y1="96" x2="352" y2="96" stroke="currentColor" strokeOpacity="0.12" />
          <line x1="96" y1="128" x2="320" y2="128" stroke="currentColor" strokeOpacity="0.08" />
          <line x1="96" y1="160" x2="336" y2="160" stroke="currentColor" strokeOpacity="0.06" />
        </g>

        <g className="fsv7-guides-layer fsv7-guides-layer--2">
          <rect
            x="56"
            y="44"
            width="304"
            height="248"
            fill="var(--card)"
            stroke="url(#fsv7_guides_layer2)"
            strokeOpacity="0.55"
          />
          <line x1="80" y1="84" x2="336" y2="84" stroke="currentColor" strokeOpacity="0.2" />
          <line x1="80" y1="116" x2="300" y2="116" stroke="currentColor" strokeOpacity="0.14" />
          <line x1="80" y1="148" x2="316" y2="148" stroke="currentColor" strokeOpacity="0.1" />
        </g>

        <g className="fsv7-guides-layer fsv7-guides-layer--1 motion-safe:transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
          <rect
            x="40"
            y="32"
            width="304"
            height="248"
            fill="var(--card)"
            stroke="url(#fsv7_guides_layer1)"
          />
          <line x1="64" y1="72" x2="320" y2="72" stroke="currentColor" strokeOpacity="0.35" />
          <line x1="64" y1="104" x2="320" y2="104" stroke="currentColor" strokeOpacity="0.28" />
          <line x1="64" y1="136" x2="280" y2="136" stroke="currentColor" strokeOpacity="0.2" />

          <g className="fsv7-guides-thumb">
            <rect
              x="64"
              y="156"
              width="80"
              height="60"
              rx="4"
              fill="var(--card)"
              stroke="url(#fsv7_guides_panel)"
              strokeOpacity="0.45"
            />
            <path
              className="fsv7-guides-thumb__line"
              pathLength={1}
              d="M72 204 L84 188 L96 196 L108 180 L120 192 L132 204"
              stroke="currentColor"
              strokeOpacity="0.35"
              strokeWidth="1.5"
              fill="currentColor"
              fillOpacity="0.06"
            />
            <circle
              cx="108"
              cy="188"
              r="4"
              stroke="currentColor"
              strokeOpacity="0.45"
              fill="currentColor"
              fillOpacity="0.12"
            />
          </g>

          <g className="fsv7-guides-doc">
            <line x1="160" y1="168" x2="280" y2="168" stroke="currentColor" strokeOpacity="0.5" />
            <line x1="160" y1="184" x2="248" y2="184" stroke="currentColor" strokeOpacity="0.35" />
            <rect
              x="64"
              y="228"
              width="48"
              height="56"
              rx="3"
              fill="var(--card)"
              stroke="url(#fsv7_guides_panel)"
              strokeOpacity="0.35"
            />
            <line x1="72" y1="240" x2="104" y2="240" stroke="currentColor" strokeOpacity="0.35" />
            <line x1="72" y1="252" x2="96" y2="252" stroke="currentColor" strokeOpacity="0.22" />
            <line x1="72" y1="264" x2="108" y2="264" stroke="currentColor" strokeOpacity="0.18" />
            <line x1="124" y1="244" x2="240" y2="244" stroke="currentColor" strokeOpacity="0.4" />
            <line x1="124" y1="260" x2="208" y2="260" stroke="currentColor" strokeOpacity="0.28" />
            <line x1="124" y1="276" x2="192" y2="276" stroke="currentColor" strokeOpacity="0.18" />
          </g>

          <g className="fsv7-guides-badge">
            <rect
              x="248"
              y="48"
              width="88"
              height="18"
              rx="9"
              fill="currentColor"
              fillOpacity="0.04"
              stroke="currentColor"
              strokeOpacity="0.35"
            />
            <circle cx="258" cy="57" r="3.5" fill="#f59e0b" fillOpacity="0.9" />
            <line x1="268" y1="57" x2="324" y2="57" stroke="currentColor" strokeOpacity="0.4" />
          </g>
        </g>

        <defs>
          <linearGradient
            id="fsv7_guides_layer1"
            x1="192"
            y1="32"
            x2="192"
            y2="280"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" />
            <stop offset="0.8" stopColor="var(--foreground)" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="fsv7_guides_layer2"
            x1="208"
            y1="44"
            x2="208"
            y2="292"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" stopOpacity="0.7" />
            <stop offset="0.8" stopColor="var(--foreground)" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="fsv7_guides_layer3"
            x1="224"
            y1="56"
            x2="224"
            y2="304"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" stopOpacity="0.4" />
            <stop offset="0.8" stopColor="var(--foreground)" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="fsv7_guides_panel"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
            gradientUnits="objectBoundingBox"
          >
            <stop stopColor="var(--foreground)" />
            <stop offset="0.75" stopColor="var(--foreground)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </FeatureIllustration>
    </IllustrationSlot>
  )
}
