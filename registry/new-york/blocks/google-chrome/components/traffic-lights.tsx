import { ArrowsOutSimple, Minus, X } from "@phosphor-icons/react"

const lightIcon = {
  size: 8,
  weight: "bold" as const,
  className: "gc-light-icon shrink-0 text-black/55",
}

export default function TrafficLights() {
  return (
    <div
      className="gc-traffic-lights flex items-center gap-2 self-center pb-[0.15rem]"
      aria-hidden
    >
      <button
        type="button"
        tabIndex={-1}
        className="gc-light flex size-2.75 shrink-0 cursor-default items-center justify-center rounded-full border-none bg-[#ff5f57] p-0 shadow-[inset_0_0_0_0.5px_rgb(0_0_0/0.18),0_0.5px_0_rgb(255_255_255/0.35)] transition-[filter] duration-120 ease-out"
        aria-label="Close"
      >
        <X {...lightIcon} />
      </button>
      <button
        type="button"
        tabIndex={-1}
        className="gc-light flex size-2.75 shrink-0 cursor-default items-center justify-center rounded-full border-none bg-[#febc2e] p-0 shadow-[inset_0_0_0_0.5px_rgb(0_0_0/0.18),0_0.5px_0_rgb(255_255_255/0.35)] transition-[filter] duration-120 ease-out"
        aria-label="Minimize"
      >
        <Minus {...lightIcon} />
      </button>
      <button
        type="button"
        tabIndex={-1}
        className="gc-light flex size-2.75 shrink-0 cursor-default items-center justify-center rounded-full border-none bg-[#28c840] p-0 shadow-[inset_0_0_0_0.5px_rgb(0_0_0/0.18),0_0.5px_0_rgb(255_255_255/0.35)] transition-[filter] duration-120 ease-out"
        aria-label="Maximize"
      >
        <ArrowsOutSimple {...lightIcon} />
      </button>
    </div>
  )
}
