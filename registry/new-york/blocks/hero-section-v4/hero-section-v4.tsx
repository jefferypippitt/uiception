import { StatsSectionV1Content } from "../stats-section-v1/stats-section-v1"

import { HeroV4Root } from "./hero-v4-root"

import "./hero-section-v4.css"

export default function HeroSectionV4() {
  return (
    <section className="pt-10 pb-16 md:pt-14 md:pb-20 lg:pt-16 lg:pb-24">
      <HeroV4Root>
        <StatsSectionV1Content />
      </HeroV4Root>
    </section>
  )
}
