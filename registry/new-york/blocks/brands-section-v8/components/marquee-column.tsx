import type { Brand } from "../lib/brands"
import BrandLogo from "./brand-logo"

type MarqueeColumnProps = {
  brands: Brand[]
  direction: "up" | "down"
}

export default function MarqueeColumn({ brands, direction }: MarqueeColumnProps) {
  const trackClass = direction === "up" ? "bs8-col-up" : "bs8-col-down"

  return (
    <div className="relative flex-1 min-w-0 overflow-hidden h-72">
      <div
        className="pointer-events-none absolute top-0 left-0 z-10 h-16 w-full bg-linear-to-b from-background to-transparent motion-reduce:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-16 w-full bg-linear-to-t from-background to-transparent motion-reduce:hidden"
        aria-hidden
      />

      <div
        className={`${trackClass} flex h-max w-full flex-col will-change-transform`}
        role="list"
        aria-label="Brand integrations"
      >
        <div className="flex flex-col gap-10 pb-10">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex shrink-0 justify-center"
              role="listitem"
            >
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-10 pb-10" aria-hidden>
          {brands.map((brand) => (
            <div
              key={`dup-${brand.name}`}
              className="flex shrink-0 justify-center"
            >
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
