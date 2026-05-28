"use client"

import { cn } from "@/lib/utils"

import { FeatureIllustration } from "./feature-illustration"
import { featureIllustrationViewBoxes } from "../lib/features"
import { IllustrationSlot } from "./illustration-slot"
import { useInViewOnce } from "../lib/use-in-view-once"

export default function TripPlannerIllustration() {
  const { ref, active } = useInViewOnce()

  return (
    <IllustrationSlot ref={ref}>
      <FeatureIllustration
        viewBox={featureIllustrationViewBoxes["trip-planner"]}
        svgClassName={cn("fsv7-planner-chart", active && "fsv7-planner-chart--active")}
      >
        <g className="fsv7-planner-frame">
          <rect
            x="24"
            y="28"
            width="440"
            height="326"
            rx="2"
            fill="var(--card)"
            stroke="url(#fsv7_planner_frame)"
          />
          <line x1="24" y1="68" x2="464" y2="68" stroke="currentColor" strokeOpacity="0.35" />
          <circle cx="44" cy="48" r="4" stroke="currentColor" strokeOpacity="0.5" />
          <circle cx="58" cy="48" r="4" stroke="currentColor" strokeOpacity="0.35" />
          <circle cx="72" cy="48" r="4" stroke="currentColor" strokeOpacity="0.2" />
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
        </g>

        <g className="fsv7-planner-nav fsv7-planner-nav--1">
          <rect
            x="40"
            y="84"
            width="56"
            height="22"
            rx="4"
            fill="currentColor"
            fillOpacity="0.04"
            stroke="currentColor"
            strokeOpacity="0.45"
          />
          <line x1="48" y1="95" x2="84" y2="95" stroke="currentColor" strokeOpacity="0.55" />
        </g>
        <g className="fsv7-planner-nav fsv7-planner-nav--2">
          <rect x="40" y="114" width="56" height="22" rx="4" stroke="currentColor" strokeOpacity="0.28" />
          <line x1="48" y1="125" x2="76" y2="125" stroke="currentColor" strokeOpacity="0.35" />
        </g>
        <g className="fsv7-planner-nav fsv7-planner-nav--3">
          <rect x="40" y="144" width="56" height="22" rx="4" stroke="currentColor" strokeOpacity="0.15" />
          <line x1="48" y1="155" x2="72" y2="155" stroke="currentColor" strokeOpacity="0.22" />
        </g>

        <g className="fsv7-planner-tile fsv7-planner-tile--1 motion-safe:transition-transform duration-200 ease-out group-hover:scale-[0.99]">
          <rect
            x="112"
            y="84"
            width="176"
            height="108"
            rx="4"
            fill="var(--card)"
            stroke="url(#fsv7_planner_panel)"
          />
          <line x1="128" y1="104" x2="220" y2="104" stroke="currentColor" strokeOpacity="0.55" />
          <rect
            x="128"
            y="116"
            width="64"
            height="44"
            rx="3"
            stroke="currentColor"
            strokeOpacity="0.2"
            fill="currentColor"
            fillOpacity="0.03"
          />
          <path
            d="M140 148 L152 132 L164 140 L176 128 L188 148"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M136 176 Q168 152 208 164 T264 176"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            fill="none"
          />
          <circle cx="136" cy="176" r="4" fill="currentColor" fillOpacity="0.5" />
          <circle cx="208" cy="164" r="4" fill="currentColor" fillOpacity="0.4" />
          <circle cx="264" cy="176" r="4" fill="currentColor" fillOpacity="0.55" />
          <rect x="128" y="184" width="32" height="12" rx="6" stroke="currentColor" strokeOpacity="0.35" />
          <rect x="168" y="184" width="32" height="12" rx="6" stroke="currentColor" strokeOpacity="0.2" />
        </g>

        <g className="fsv7-planner-tile fsv7-planner-tile--2">
          <rect
            x="300"
            y="84"
            width="148"
            height="48"
            rx="4"
            fill="var(--card)"
            stroke="url(#fsv7_planner_panel)"
            strokeOpacity="0.45"
          />
          <path
            d="M316 104 L326 104 L330 100 L338 108 L330 116 L326 112 L316 112 Z"
            stroke="currentColor"
            strokeOpacity="0.45"
            fill="currentColor"
            fillOpacity="0.08"
          />
          <line x1="344" y1="100" x2="420" y2="100" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="344" y1="114" x2="396" y2="114" stroke="currentColor" strokeOpacity="0.28" />
        </g>

        <g className="fsv7-planner-tile fsv7-planner-tile--3">
          <rect
            x="300"
            y="140"
            width="72"
            height="52"
            rx="4"
            fill="var(--card)"
            stroke="url(#fsv7_planner_panel)"
            strokeOpacity="0.35"
          />
          <rect x="312" y="152" width="24" height="16" rx="2" stroke="currentColor" strokeOpacity="0.35" />
          <line x1="312" y1="176" x2="356" y2="176" stroke="currentColor" strokeOpacity="0.35" />
          <line x1="312" y1="184" x2="344" y2="184" stroke="currentColor" strokeOpacity="0.2" />
        </g>

        <g className="fsv7-planner-tile fsv7-planner-tile--4">
          <rect
            x="380"
            y="140"
            width="68"
            height="52"
            rx="4"
            fill="var(--card)"
            stroke="url(#fsv7_planner_panel)"
            strokeOpacity="0.3"
          />
          <circle
            cx="414"
            cy="166"
            r="5"
            stroke="currentColor"
            strokeOpacity="0.5"
            fill="currentColor"
            fillOpacity="0.1"
          />
          <line x1="392" y1="178" x2="436" y2="178" stroke="currentColor" strokeOpacity="0.3" />
        </g>

        <g className="fsv7-planner-tile fsv7-planner-tile--5">
          <rect
            x="112"
            y="204"
            width="336"
            height="96"
            rx="4"
            fill="var(--card)"
            stroke="url(#fsv7_planner_panel)"
          />
          <line x1="128" y1="224" x2="176" y2="224" stroke="currentColor" strokeOpacity="0.4" />
          <line x1="148" y1="252" x2="420" y2="252" stroke="currentColor" strokeOpacity="0.2" />
          <circle
            cx="148"
            cy="252"
            r="5"
            fill="currentColor"
            fillOpacity="0.12"
            stroke="currentColor"
            strokeOpacity="0.45"
          />
          <circle
            cx="244"
            cy="252"
            r="5"
            fill="currentColor"
            fillOpacity="0.1"
            stroke="currentColor"
            strokeOpacity="0.35"
          />
          <circle
            cx="360"
            cy="252"
            r="5"
            fill="currentColor"
            fillOpacity="0.14"
            stroke="currentColor"
            strokeOpacity="0.5"
          />
          <path
            d="M153 252 H239"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="1"
            strokeDasharray="3 2"
          />
          <path
            d="M249 252 H355"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="1"
            strokeDasharray="3 2"
          />
          <rect x="128" y="268" width="80" height="20" rx="3" stroke="currentColor" strokeOpacity="0.2" />
          <rect x="216" y="268" width="80" height="20" rx="3" stroke="currentColor" strokeOpacity="0.15" />
        </g>

        <defs>
          <linearGradient
            id="fsv7_planner_frame"
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
            id="fsv7_planner_panel"
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
