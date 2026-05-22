import BrandsSectionV5 from "../brands-section-v5/brands-section-v5"

import { HeroV6Root } from "./hero-v6-root"

import { ensureUiceptionBlockMedia } from "@/lib/ensure-uiception-block-media"
import "./hero-section-v6.css"

export default async function HeroSectionV6() {
  await ensureUiceptionBlockMedia("hero-section-v6")
  return (
    <>
      <section className="pt-10 md:pt-14 lg:pt-16">
        <HeroV6Root />
      </section>
      <BrandsSectionV5 animated />
    </>
  )
}
