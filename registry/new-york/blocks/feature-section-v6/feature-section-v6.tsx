import FeatureGrid from "./components/feature-grid"

import "./styles/feature-section-v6.css"

export default function FeatureSectionV6() {
  return (
    <section className="fsv6-section pt-16 md:pt-20 lg:pt-24">
      <div className="mx-auto max-w-6xl px-4">
        <header className="fsv6-intro mb-12 md:mb-14 lg:mb-16">
          <p className="fsv6-eyebrow">Capabilities</p>
          <h2 className="fsv6-heading">Momentum, built in</h2>
          <p className="fsv6-lead">
            Four essentials that keep work moving with less overhead, clearer
            priorities, and room to grow without slowing down.
          </p>
        </header>
        <FeatureGrid />
      </div>
    </section>
  )
}
