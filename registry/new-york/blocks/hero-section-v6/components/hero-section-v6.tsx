import { existsSync } from "node:fs"
import { join } from "node:path"

import BrandsSectionV5 from "../../brands-section-v5/components/brands-section-v5"

import { HeroV6Root } from "./hero-v6-root"

import "../styles/hero-section-v6.css"

const blockImage = (filename: string) => {
  const relPath = `images/blocks/hero-section-v6/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}
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
