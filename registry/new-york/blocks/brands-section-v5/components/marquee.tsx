import type { Brand } from "../lib/brands"
import BrandLogo from "./brand-logo"

export default function Marquee({ brands }: { brands: Brand[] }) {
  return (
    <div className="bs5-marquee-wrap relative flex min-w-0 flex-1 items-stretch overflow-hidden">
      <div className="bs5-track flex min-h-full w-max flex-nowrap items-stretch will-change-transform backface-hidden">
        <div
          className="flex min-h-full shrink-0 items-stretch"
          role="list"
          aria-label="Brand logos"
        >
          {brands.map((brand) => (
            <div
              key={brand.name}
              role="listitem"
              className="bs5-slot relative flex items-center justify-center self-stretch px-6 py-6 after:absolute after:top-0 after:right-0 after:bottom-0 after:w-px after:bg-border md:px-8"
            >
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
        <div className="flex min-h-full shrink-0 items-stretch" aria-hidden>
          {brands.map((brand) => (
            <div
              key={`dup-${brand.name}`}
              className="bs5-slot relative flex items-center justify-center self-stretch px-6 py-6 after:absolute after:top-0 after:right-0 after:bottom-0 after:w-px after:bg-border md:px-8"
            >
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
