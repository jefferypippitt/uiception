import type { Brand } from "../lib/brands"
import BrandLogo from "./brand-logo"

export default function Marquee({ brands }: { brands: Brand[] }) {
  return (
    <div className="bs5-marquee-wrap">
      <div className="bs5-track">
        <div className="bs5-set" role="list" aria-label="Brand logos">
          {brands.map((brand) => (
            <div key={brand.name} role="listitem" className="bs5-slot">
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
        <div className="bs5-set" aria-hidden>
          {brands.map((brand) => (
            <div key={`dup-${brand.name}`} className="bs5-slot">
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
