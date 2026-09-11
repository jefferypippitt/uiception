import { GeistSans } from "geist/font/sans"

import BrandMark from "./brand-mark"
import { brands } from "../lib/brands"
import { brandsSectionV10Content } from "../lib/config"

export default function BrandsSectionV10() {
  const { heading, prefix, suffix } = brandsSectionV10Content

  return (
    <section className={`${GeistSans.className} py-12 md:py-16 lg:py-20`}>
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 text-center md:gap-10">
        <h2 className="font-sans text-3xl tracking-tighter text-foreground sm:text-4xl lg:text-5xl">
          {heading} {prefix}
        </h2>
        <ul
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 md:gap-x-10 lg:gap-x-12"
          aria-label="Brand logos"
        >
          {brands.map((brand) => (
            <li key={brand.name} className="flex items-center">
              <BrandMark brand={brand} />
            </li>
          ))}
        </ul>
        <p className="font-sans text-3xl tracking-tighter text-muted-foreground sm:text-4xl lg:text-5xl">
          {suffix}
        </p>
      </div>
    </section>
  )
}
