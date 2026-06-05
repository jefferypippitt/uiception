import { HeroV7Root } from "./hero-v7-root"

import type { HeroV7Props } from "../lib/config"

import "../styles/hero-section-v7.css"

export default function HeroSectionV7(props: HeroV7Props) {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <HeroV7Root {...props} />
    </section>
  )
}
