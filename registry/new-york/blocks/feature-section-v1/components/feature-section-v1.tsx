import { GeistPixelCircle } from "geist/font/pixel"

import FeatureGrid from "./feature-grid"

export default function FeatureSectionV1() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 flex max-w-160 flex-col gap-4 md:mb-14 lg:mb-16">
          <h2 className="text-4xl tracking-tighter lg:text-5xl">
            The platform built for <br />
            <span className={`${GeistPixelCircle.className}`}>
              modern teams
            </span>
          </h2>
          <p className="max-w-xl text-3.75 leading-relaxed text-muted-foreground">
            Give your team the tools to move fast, stay aligned, and grow
            without the friction.
          </p>
        </div>
        <FeatureGrid />
      </div>
    </section>
  )
}
