import BrandsSectionV5 from "../../brands-section-v5/components/brands-section-v5"
import { createBlockImage } from "@/lib/block-media"

const blockImage = createBlockImage("hero-section-v6")
import { HeroV6Root } from "./hero-v6-root"

import "../styles/hero-section-v6.css"

const HERO_V6_IMAGE = blockImage("image.jpg")

export default function HeroSectionV6() {
  return (
    <>
      <section className="py-4 md:py-6 lg:py-8">
        <HeroV6Root imageSrc={HERO_V6_IMAGE} />
      </section>
      <BrandsSectionV5 animated />
    </>
  )
}
