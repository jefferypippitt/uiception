import FeatureGrid from "./components/feature-grid"

import "./styles/feature-section-v1.css"

export default function FeatureSectionV1() {
  return (
    <section className="bg-muted/35 py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 flex flex-col items-center text-center md:mb-14">
          <h2 className="max-w-xl text-2xl font-medium tracking-tighter sm:text-3xl lg:text-[2rem] lg:leading-[1.2]">
            Help that fits the way you live
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Support that meets your family where you are, without another
            dashboard to babysit.
          </p>
        </div>

        <FeatureGrid />
      </div>
    </section>
  )
}
