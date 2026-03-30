import type { Brand } from "../lib/brands"
import BrandLogo from "./brand-logo"

export default function Marquee({ brands }: { brands: Brand[] }) {
  return (
    <div className="bs1-marquee-wrap min-w-0">
      <div className="bs1-fade bs1-fade-left" aria-hidden />
      <div className="bs1-fade bs1-fade-right" aria-hidden />

      <div className="bs1-track">
        <div className="bs1-set" role="list" aria-label="Brand logos">
          {brands.map((brand) => (
            <div key={brand.name} role="listitem" className="bs1-slot flex shrink-0 items-center justify-center">
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
        <div className="bs1-set" aria-hidden>
          {brands.map((brand) => (
            <div key={`dup-${brand.name}`} className="bs1-slot flex shrink-0 items-center justify-center">
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
