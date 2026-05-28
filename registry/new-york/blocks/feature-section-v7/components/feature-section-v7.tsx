import FeatureGrid from "./feature-grid"

import "../styles/feature-section-v7.css"

export default function FeatureSectionV7() {
  return (
    <section className="w-full bg-background py-20 text-foreground md:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <h2 className="max-w-[22ch] text-4xl font-medium leading-[1.1] tracking-[-0.03em] text-foreground lg:text-5xl">
          Plan travel without spreadsheet chaos
        </h2>
        <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          Review fares, shape daily itineraries, and keep your companions aligned
          from inspiration to boarding.
        </p>
        <FeatureGrid />
      </div>
    </section>
  )
}
