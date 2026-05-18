import { HeroV7Root } from "./components/hero-v7-root"

import type { HeroV7Props } from "./lib/config"

import "./styles/hero-section-v7.css"

export default function HeroSectionV7(props: HeroV7Props) {
  return (
    <section className="hero-v7 pb-10 pt-10 md:pb-14 md:pt-14 lg:pb-16 lg:pt-16">
      <HeroV7Root {...props} />
    </section>
  )
}
