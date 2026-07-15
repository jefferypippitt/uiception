import { StatsSectionV1Content } from "../../stats-section-v1/components/stats-section-v1"
import { createBlockImage } from "@/lib/block-media"

const blockImage = createBlockImage("hero-section-v4")
import { HeroV4Root } from "./hero-v4-root"

import "../styles/hero-section-v4.css"


export default function HeroSectionV4() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <HeroV4Root bgSrc={blockImage("image.png")}>
        <StatsSectionV1Content />
      </HeroV4Root>
    </section>
  )
}
