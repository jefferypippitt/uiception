import { StatsSectionV1Content } from "../stats-section-v1/stats-section-v1"

import { HeroV4Root } from "./components/hero-v4-root"

import "./styles/hero-section-v4.css"

export default function HeroSectionV4() {
  return (
    <section className="hero-v4 py-16 md:py-20 lg:py-24">
      <HeroV4Root>
        <StatsSectionV1Content />
      </HeroV4Root>
    </section>
  )
}
