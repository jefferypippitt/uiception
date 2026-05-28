import FeatureShowcase from "./feature-showcase"

import "../styles/feature-section-v2.css"

export default function FeatureSectionV2() {
  return (
    <section className="py-10 md:py-14 lg:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6 flex flex-col items-center gap-2.5 text-center md:mb-8">
          <h2 className="text-4xl tracking-tighter lg:text-5xl">
            Everything your team needs
          </h2>
          <p className="max-w-xl text-3.75 leading-relaxed text-muted-foreground">
            See what is happening in real time, let automations handle the
            routine, and connect the tools you already use without any extra
            setup.
          </p>
        </div>
        <FeatureShowcase />
      </div>
    </section>
  )
}
