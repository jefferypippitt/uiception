import FeatureGrid from "./components/feature-grid"

import "./styles/feature-section-v5.css"

export default function FeatureSectionV5() {
  return (
    <section className="fsv5-section pt-16 md:pt-20 lg:pt-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-4 text-center md:mb-14 lg:mb-16">
          <h2 className="fsv5-heading text-4xl tracking-tight lg:text-5xl">
            Less noise.{" "}
            <span className="fsv5-heading-accent">More signal.</span>
          </h2>
          <p className="max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            Focused tools built around how great teams actually work. Nothing
            unnecessary, everything intentional.
          </p>
        </div>
        <FeatureGrid />
      </div>
    </section>
  )
}
