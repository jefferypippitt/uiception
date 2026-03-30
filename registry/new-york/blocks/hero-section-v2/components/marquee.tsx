import type { Brand } from "../lib/brands"
import BrandLogo from "./brand-logo"

export default function Marquee({ brands }: { brands: Brand[] }) {
  return (
    <div className="bs2-marquee-wrap">
      <div className="bs2-fade bs2-fade-left" aria-hidden />
      <div className="bs2-fade bs2-fade-right" aria-hidden />

      <div className="bs2-track">
        <div className="bs2-set" role="list" aria-label="Brand logos">
          {brands.map((brand) => (
            <div key={brand.name} role="listitem" className="bs2-slot">
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
        <div className="bs2-set" aria-hidden>
          {brands.map((brand) => (
            <div key={`dup-${brand.name}`} className="bs2-slot">
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
