import type { Brand } from "../lib/brands"
import BrandLogo from "./brand-logo"

export default function Marquee({ brands }: { brands: Brand[] }) {
  return (
    <div className="relative w-full min-w-0 overflow-hidden">
      <div
        className="pointer-events-none absolute top-0 left-0 z-1 h-full w-16 bg-linear-to-r from-background to-transparent motion-reduce:hidden md:w-24"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-0 right-0 z-1 h-full w-16 bg-linear-to-l from-background to-transparent motion-reduce:hidden md:w-24"
        aria-hidden
      />

      <div className="bs9-track flex w-max flex-nowrap items-center will-change-transform backface-hidden">
        <div
          className="flex shrink-0 items-center gap-12 px-6 md:gap-16 md:px-8"
          role="list"
          aria-label="Brand logos"
        >
          {brands.map((brand) => (
            <div
              key={brand.name}
              role="listitem"
              className="flex shrink-0 items-center justify-center"
            >
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
        <div
          className="flex shrink-0 items-center gap-12 px-6 md:gap-16 md:px-8"
          aria-hidden
        >
          {brands.map((brand) => (
            <div
              key={`dup-${brand.name}`}
              className="flex shrink-0 items-center justify-center"
            >
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
