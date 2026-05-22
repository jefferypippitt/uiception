"use client"

import { cn } from "@/lib/utils"

import { FeatureIllustration } from "./feature-illustration"
import { featureIllustrationViewBoxes } from "./features"
import { IllustrationSlot } from "./illustration-slot"
import { useInViewOnce } from "./use-in-view-once"

export default function SmartSearchIllustration() {
  const { ref, active } = useInViewOnce()

  return (
    <IllustrationSlot ref={ref}>
      <FeatureIllustration
        viewBox={featureIllustrationViewBoxes["smart-search"]}
        svgClassName={cn("fsv7-search-chart", active && "fsv7-search-chart--active")}
      >
        <g className="fsv7-search-frame">
          <rect
            x="24"
            y="28"
            width="440"
            height="326"
            rx="2"
            fill="var(--card)"
            stroke="url(#fsv7_search_frame)"
          />
          <line x1="24" y1="68" x2="464" y2="68" stroke="currentColor" strokeOpacity="0.35" />
          <circle cx="44" cy="48" r="4" stroke="currentColor" strokeOpacity="0.5" />
          <circle cx="58" cy="48" r="4" stroke="currentColor" strokeOpacity="0.35" />
          <circle cx="72" cy="48" r="4" stroke="currentColor" strokeOpacity="0.2" />
          <rect
            x="366"
            y="40"
            width="68"
            height="18"
            rx="9"
            stroke="currentColor"
            strokeOpacity="0.35"
            fill="currentColor"
            fillOpacity="0.04"
          />
          <line x1="384" y1="49" x2="416" y2="49" stroke="currentColor" strokeOpacity="0.4" />
        </g>

        <g className="fsv7-search-sidebar">
          <rect
            x="40"
            y="84"
            width="64"
            height="24"
            rx="4"
            fill="currentColor"
            fillOpacity="0.05"
            stroke="currentColor"
            strokeOpacity="0.4"
          />
          <line x1="48" y1="96" x2="92" y2="96" stroke="currentColor" strokeOpacity="0.55" />
          <line x1="48" y1="120" x2="84" y2="120" stroke="currentColor" strokeOpacity="0.35" />
          <line x1="48" y1="140" x2="76" y2="140" stroke="currentColor" strokeOpacity="0.22" />
          <line x1="44" y1="108" x2="100" y2="108" stroke="currentColor" strokeOpacity="0.12" />
        </g>

        <g className="fsv7-search-prompt">
          <rect
            x="120"
            y="84"
            width="328"
            height="32"
            rx="6"
            stroke="currentColor"
            strokeOpacity="0.35"
            fill="currentColor"
            fillOpacity="0.03"
          />
          <circle cx="136" cy="100" r="6" stroke="currentColor" strokeOpacity="0.3" />
          <line x1="152" y1="100" x2="280" y2="100" stroke="currentColor" strokeOpacity="0.45" />
          <rect x="120" y="124" width="96" height="22" rx="4" stroke="currentColor" strokeOpacity="0.2" />
          <rect x="224" y="124" width="96" height="22" rx="4" stroke="currentColor" strokeOpacity="0.2" />
          <rect x="328" y="124" width="120" height="22" rx="4" stroke="currentColor" strokeOpacity="0.15" />
          <line x1="128" y1="135" x2="156" y2="135" stroke="currentColor" strokeOpacity="0.4" />
          <line x1="232" y1="135" x2="260" y2="135" stroke="currentColor" strokeOpacity="0.4" />
          <line x1="336" y1="135" x2="396" y2="135" stroke="currentColor" strokeOpacity="0.28" />
        </g>

        <g className="fsv7-search-output motion-safe:transition-transform duration-200 ease-out group-hover:translate-x-0.5">
          <rect
            x="120"
            y="160"
            width="328"
            height="48"
            rx="4"
            stroke="currentColor"
            strokeOpacity="0.45"
            fill="currentColor"
            fillOpacity="0.04"
          />
          <path
            d="M136 180 L146 180 L150 176 L158 184 L150 192 L146 188 L136 188 Z"
            stroke="currentColor"
            strokeOpacity="0.45"
            fill="currentColor"
            fillOpacity="0.08"
          />
          <line x1="168" y1="176" x2="280" y2="176" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="168" y1="190" x2="248" y2="190" stroke="currentColor" strokeOpacity="0.28" />
          <line x1="400" y1="184" x2="432" y2="184" stroke="currentColor" strokeOpacity="0.45" />

          <rect
            x="120"
            y="216"
            width="328"
            height="48"
            rx="4"
            stroke="currentColor"
            strokeOpacity="0.28"
            fill="currentColor"
            fillOpacity="0.03"
          />
          <path
            d="M136 236 L146 236 L150 232 L158 240 L150 248 L146 244 L136 244 Z"
            stroke="currentColor"
            strokeOpacity="0.3"
            fill="currentColor"
            fillOpacity="0.05"
          />
          <line x1="168" y1="232" x2="276" y2="232" stroke="currentColor" strokeOpacity="0.35" />
          <line x1="168" y1="246" x2="232" y2="246" stroke="currentColor" strokeOpacity="0.2" />
          <line x1="400" y1="240" x2="432" y2="240" stroke="currentColor" strokeOpacity="0.3" />

          <rect
            x="120"
            y="276"
            width="136"
            height="20"
            rx="4"
            stroke="#22c55e"
            strokeOpacity="0.45"
            fill="#22c55e"
            fillOpacity="0.08"
          />
          <circle cx="130" cy="286" r="3" fill="#22c55e" />
          <line x1="140" y1="286" x2="220" y2="286" stroke="currentColor" strokeOpacity="0.45" />
        </g>

        <rect
          className="fsv7-search-cursor"
          x="288"
          y="92"
          width="2"
          height="14"
          fill="currentColor"
          fillOpacity="0.7"
        />

        <defs>
          <linearGradient
            id="fsv7_search_frame"
            x1="244"
            y1="28"
            x2="244"
            y2="354"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" />
            <stop offset="0.8" stopColor="var(--card)" />
          </linearGradient>
        </defs>
      </FeatureIllustration>
    </IllustrationSlot>
  )
}
