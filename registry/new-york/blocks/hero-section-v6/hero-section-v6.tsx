import BrandsSectionV5 from "../brands-section-v5/brands-section-v5"

import { HeroV6Root } from "./components/hero-v6-root"

import "./styles/hero-section-v6.css"

export default function HeroSectionV6() {
  return (
    <>
      <section className="hero-v6 pb-0 pt-10 md:pb-0 md:pt-14 lg:pb-0 lg:pt-16">
        <HeroV6Root />
      </section>
      <BrandsSectionV5 animated />
    </>
  )
}
