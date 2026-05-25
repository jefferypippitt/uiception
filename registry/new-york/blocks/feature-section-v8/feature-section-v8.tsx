import FeatureGrid from "./feature-grid"
import { featureSectionContent } from "./config"

import "./feature-section-v8.css"

export default function FeatureSectionV8() {
  return (
    <section className="py-12 text-foreground md:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-8 max-w-3xl text-center md:mb-10 lg:mb-12">
          <h2 className="text-4xl leading-[1.1] font-medium tracking-[-0.03em] lg:text-5xl">
            {featureSectionContent.title}
          </h2>
        </div>
        <FeatureGrid />
      </div>
    </section>
  )
}
