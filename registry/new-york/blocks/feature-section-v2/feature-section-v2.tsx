import FeatureShowcase from "./components/feature-showcase"

import "./styles/feature-section-v2.css"
import "./styles/fsv2-illustrations.css"

export default function FeatureSectionV2() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 flex flex-col items-center gap-4 text-center md:mb-14 lg:mb-16">
          <h2 className="text-4xl tracking-tighter lg:text-5xl">
            Everything your team needs
          </h2>
          <p className="max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            Help your team ship faster, stay in sync, and grow with less
            busywork standing in the way.
          </p>
        </div>
        <FeatureShowcase />
      </div>
    </section>
  )
}
