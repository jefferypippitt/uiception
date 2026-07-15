import { existsSync } from "node:fs"
import { join } from "node:path"

import { StatsSectionV1Content } from "../../stats-section-v1/components/stats-section-v1"

import { HeroV4Root } from "./hero-v4-root"

import "../styles/hero-section-v4.css"

const blockImage = (filename: string) => {
  const relPath = `images/blocks/hero-section-v4/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}

export default function HeroSectionV4() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <HeroV4Root bgSrc={blockImage("image.png")}>
        <StatsSectionV1Content />
      </HeroV4Root>
    </section>
  )
}
