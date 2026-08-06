import { GeistSans } from "geist/font/sans"

import { createBlockImage } from "@/lib/block-media"

import { sectionTitle } from "../lib/features"
import FeatureGrid from "./feature-grid"
import { ParticlePanel } from "./particle-panel"

const blockImage = createBlockImage("feature-section-v11")
const PANEL_IMAGE = blockImage("image.png")

export default function FeatureSectionV11() {
  return (
    <section className="bg-background py-4 text-foreground md:py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] lg:gap-10 xl:gap-12">
          <div className="relative h-full min-h-96 sm:min-h-112">
            <ParticlePanel
              className="absolute inset-0 size-full"
              src={PANEL_IMAGE}
            />
          </div>

          <div className="flex min-h-0 flex-col justify-center lg:py-2">
            <h2
              className={`${GeistSans.className} whitespace-nowrap text-[clamp(1.25rem,2.4vw,2rem)] leading-none font-medium tracking-tight text-foreground`}
            >
              {sectionTitle}
            </h2>
            <FeatureGrid />
          </div>
        </div>
      </div>
    </section>
  )
}
