import HeroContent from "./hero-content"

import type { HeroV9Props } from "../lib/config"

import "../styles/hero-section-v9.css"

export default function HeroSectionV9(props: HeroV9Props) {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <HeroContent {...props} />
      </div>
    </section>
  )
}
