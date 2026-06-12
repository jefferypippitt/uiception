import type { Brand } from "../lib/brands"
import BrandPill from "./brand-pill"

type MarqueeRowProps = {
  brands: Brand[]
  direction: "left" | "right"
  offset?: boolean
}

function MarqueeTrack({
  brands,
  direction,
  ariaHidden = false,
}: {
  brands: Brand[]
  direction: "left" | "right"
  ariaHidden?: boolean
}) {
  return (
    <div
      className="flex shrink-0 items-center gap-2 px-1 md:gap-2.5"
      role={ariaHidden ? undefined : "list"}
      aria-label={ariaHidden ? undefined : "Brand integrations"}
      aria-hidden={ariaHidden || undefined}
    >
      {brands.map((brand) => (
        <div
          key={ariaHidden ? `dup-${brand.name}` : brand.name}
          role={ariaHidden ? undefined : "listitem"}
          className="flex shrink-0"
        >
          <BrandPill brand={brand} />
        </div>
      ))}
    </div>
  )
}

export default function MarqueeRow({
  brands,
  direction,
  offset = false,
}: MarqueeRowProps) {
  const trackClass =
    direction === "left" ? "bs7-track-left" : "bs7-track-right"

  return (
    <div className="relative w-full min-w-0 overflow-hidden">
      <div
        className="pointer-events-none absolute top-0 left-0 z-1 h-full w-16 bg-linear-to-r from-background to-transparent motion-reduce:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-0 right-0 z-1 h-full w-16 bg-linear-to-l from-background to-transparent motion-reduce:hidden"
        aria-hidden
      />

      <div
        className={`${trackClass} flex w-max flex-nowrap items-center py-1 will-change-transform backface-hidden${offset ? " translate-x-8 md:translate-x-12" : ""}`}
      >
        <MarqueeTrack brands={brands} direction={direction} />
        <MarqueeTrack brands={brands} direction={direction} ariaHidden />
      </div>
    </div>
  )
}
