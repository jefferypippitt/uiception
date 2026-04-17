import FeatureShowcase from "./components/feature-showcase"

import "./styles/feature-section-v2.css"

export default function FeatureSectionV2() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 flex flex-col items-center gap-4 text-center md:mb-14 lg:mb-16">
          <h2 className="text-4xl tracking-tighter lg:text-5xl">
            Everything your team needs
          </h2>
          <p className="max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            See what is happening in real time, let automations handle the routine, and connect
            the tools you already use without any extra setup.
          </p>
        </div>
        <FeatureShowcase />
      </div>
    </section>
  )
}
