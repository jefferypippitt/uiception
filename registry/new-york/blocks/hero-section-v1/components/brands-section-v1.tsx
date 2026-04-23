import { GeistSans } from "geist/font/sans"

import type { Brand } from "../lib/brands"
import { brands } from "../lib/brands"
import BrandLogo from "./brand-logo"
import { cn } from "@/lib/utils"

import "../styles/brands-section-v1.css"

function Marquee({ brands: list }: { brands: Brand[] }) {
  return (
    <div className="bs1-marquee-wrap min-w-0">
      <div className="bs1-fade bs1-fade-left" aria-hidden />
      <div className="bs1-fade bs1-fade-right" aria-hidden />

      <div className="bs1-track">
        <div className="bs1-set" role="list" aria-label="Brand logos">
          {list.map((brand) => (
            <div key={brand.name} role="listitem" className="bs1-slot flex shrink-0 items-center justify-center">
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
        <div className="bs1-set" aria-hidden>
          {list.map((brand) => (
            <div key={`dup-${brand.name}`} className="bs1-slot flex shrink-0 items-center justify-center">
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function BrandsSectionV1() {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:gap-10 lg:gap-14">
          <p
            className={cn(
              GeistSans.className,
              "max-w-[16rem] text-base font-medium leading-snug text-muted-foreground md:text-lg",
            )}
          >
            Trusted by the best leading brands:
          </p>
          <Marquee brands={brands} />
        </div>
      </div>
    </section>
  )
}
