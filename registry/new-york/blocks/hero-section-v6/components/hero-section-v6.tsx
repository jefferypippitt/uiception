import BrandsSectionV5 from "../../brands-section-v5/components/brands-section-v5"

import { HeroV6Root } from "./hero-v6-root"

import "../styles/hero-section-v6.css"

export default function HeroSectionV6() {
  return (
    <>
      <section className="py-4 md:py-6 lg:py-8">
        <HeroV6Root />
      </section>
      <BrandsSectionV5 animated />
    </>
  )
}
