import type { Brand } from "./brands"
import BrandLogo from "./brand-logo"

export default function Marquee({ brands }: { brands: Brand[] }) {
  return (
    <div className="relative overflow-hidden border border-border">
      <div
        className="pointer-events-none absolute top-0 left-0 z-1 h-full w-35 bg-linear-to-r from-background to-transparent motion-reduce:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-0 right-0 z-1 h-full w-35 bg-linear-to-l from-background to-transparent motion-reduce:hidden"
        aria-hidden
      />

      <div className="bs2-track flex min-h-full w-max flex-nowrap items-stretch will-change-transform backface-hidden">
        <div
          className="flex shrink-0 items-stretch"
          role="list"
          aria-label="Database brand logos"
        >
          {brands.map((brand) => (
            <div
              key={brand.name}
              role="listitem"
              className="flex w-32 items-center justify-center border-r border-border py-3 md:w-40 md:py-4"
            >
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
        <div className="flex shrink-0 items-stretch" aria-hidden>
          {brands.map((brand) => (
            <div
              key={`dup-${brand.name}`}
              className="flex w-32 items-center justify-center border-r border-border py-3 md:w-40 md:py-4"
            >
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
