import HeroContent from "./hero-content"

import type { HeroV9Props } from "./config"

import "./hero-section-v9.css"

export default function HeroSectionV9(props: HeroV9Props) {
  return (
    <section className="pt-10 pb-16 md:pt-14 md:pb-20 lg:pt-16 lg:pb-24">
      <div className="mx-auto max-w-6xl px-4">
        <HeroContent {...props} />
      </div>
    </section>
  )
}
