import { cn } from "@/lib/utils"

/** iOS battery fill states: yellow Low Power Mode, red low, green charging. */
export type IphoneBatteryState = "normal" | "low-power" | "low" | "charging"

export type IphoneStatusBarProps = {
  className?: string
  time?: string
  signalBars?: 1 | 2 | 3 | 4
  batteryLevel?: number
  batteryState?: IphoneBatteryState
  tint?: "dark" | "light"
}

/** Every glyph renders at this exact height so the row reads as one size. */
const GLYPH_HEIGHT = 12

/** `normal` inherits the row tint; the rest use scoped iOS system colors. */
const BATTERY_FILL: Record<IphoneBatteryState, string> = {
  normal: "currentColor",
  "low-power": "var(--ip17-battery-low-power)",
  low: "var(--ip17-battery-low)",
  charging: "var(--ip17-battery-charging)",
}

function SignalBarsIcon({ bars }: { bars: 1 | 2 | 3 | 4 }) {
  const barHeights = [5, 7.25, 9.5, 12] as const

  return (
    <svg
      viewBox="0 0 16.5 12"
      width="16.5"
      height={GLYPH_HEIGHT}
      fill="currentColor"
      aria-hidden
    >
      {barHeights.map((height, index) => (
        <rect
          key={height}
          x={index * 4.5}
          y={12 - height}
          width="3"
          height={height}
          rx="1"
          opacity={index < bars ? 1 : 0.3}
        />
      ))}
    </svg>
  )
}

function WifiIcon() {
  return (
    <svg
      viewBox="0 0 16 12"
      width="16"
      height={GLYPH_HEIGHT}
      fill="none"
      aria-hidden
    >
      <path
        d="M0.8 4.9a9.6 9.6 0 0 1 14.4 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M4.5 8.4a5 5 0 0 1 7 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="8" cy="10.6" r="1.4" fill="currentColor" />
    </svg>
  )
}

function BatteryIcon({
  level,
  state,
}: {
  level: number
  state: IphoneBatteryState
}) {
  const clamped = Math.min(100, Math.max(0, level))
  const fillWidth = (clamped / 100) * 18

  return (
    <svg
      viewBox="0 0 25 12"
      width="25"
      height={GLYPH_HEIGHT}
      fill="none"
      aria-hidden
    >
      <rect
        x="0.5"
        y="0.5"
        width="21"
        height="11"
        rx="3.2"
        stroke="currentColor"
        strokeOpacity="0.4"
      />
      <path
        d="M22.8 4.2a1.8 1.8 0 0 1 0 3.6Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
      <rect
        x="2"
        y="2"
        width={fillWidth}
        height="8"
        rx="2"
        fill={BATTERY_FILL[state]}
      />
      {state === "charging" ? (
        <path
          d="M11.9 2.4 8.2 7.1h2.2l-.9 2.9 3.7-4.9h-2.3z"
          fill="var(--ip17-bezel)"
          fillOpacity="0.85"
        />
      ) : null}
    </svg>
  )
}

export default function IphoneStatusBar({
  className,
  time = "08:00",
  signalBars = 4,
  batteryLevel = 100,
  batteryState = "normal",
  tint = "dark",
}: IphoneStatusBarProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 top-3.5 z-6 flex h-7 items-center justify-between px-5",
        tint === "dark" ? "text-black" : "text-white",
        className
      )}
      aria-hidden
    >
      <span className="text-[0.8125rem] leading-none font-semibold tracking-tight">
        {time}
      </span>
      <div className="flex items-center gap-1.5">
        <SignalBarsIcon bars={signalBars} />
        <WifiIcon />
        <BatteryIcon level={batteryLevel} state={batteryState} />
      </div>
    </div>
  )
}
