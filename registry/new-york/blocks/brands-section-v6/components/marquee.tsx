import type { Brand } from "../lib/brands"
import BrandLogo from "./brand-logo"

export default function Marquee({ brands }: { brands: Brand[] }) {
  return (
    <div className="bs6-marquee-wrap w-full min-w-0">
      <div className="bs6-fade bs6-fade-left" aria-hidden />
      <div className="bs6-fade bs6-fade-right" aria-hidden />

      <div className="bs6-track">
        <div className="bs6-set" role="list" aria-label="Brand logos">
          {brands.map((brand) => (
            <div key={brand.name} role="listitem" className="bs6-slot flex shrink-0 items-center justify-center">
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
        <div className="bs6-set" aria-hidden>
          {brands.map((brand) => (
            <div key={`dup-${brand.name}`} className="bs6-slot flex shrink-0 items-center justify-center">
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
