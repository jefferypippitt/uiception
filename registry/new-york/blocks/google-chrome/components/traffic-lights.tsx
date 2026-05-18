import { ArrowsOutSimple, Minus, X } from "@phosphor-icons/react"

const lightIcon = {
  size: 8,
  weight: "bold" as const,
  className: "gc-light-icon",
}

export default function TrafficLights() {
  return (
    <div className="gc-traffic-lights" aria-hidden>
      <button
        type="button"
        tabIndex={-1}
        className="gc-light gc-light-close"
        aria-label="Close"
      >
        <X {...lightIcon} />
      </button>
      <button
        type="button"
        tabIndex={-1}
        className="gc-light gc-light-minimize"
        aria-label="Minimize"
      >
        <Minus {...lightIcon} />
      </button>
      <button
        type="button"
        tabIndex={-1}
        className="gc-light gc-light-maximize"
        aria-label="Maximize"
      >
        <ArrowsOutSimple {...lightIcon} />
      </button>
    </div>
  )
}
