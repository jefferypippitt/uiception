import { HeroV7Root } from "./hero-v7-root"

import type { HeroV7Props } from "../lib/config"

import "../styles/hero-section-v7.css"

export default function HeroSectionV7(props: HeroV7Props) {
  return (
    <section className="pt-10 pb-16 md:pt-14 md:pb-20 lg:pt-16 lg:pb-24">
      <HeroV7Root {...props} />
    </section>
  )
}
