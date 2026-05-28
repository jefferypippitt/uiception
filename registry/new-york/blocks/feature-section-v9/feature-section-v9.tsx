"use client"

import { CompassRose } from "@phosphor-icons/react"

import FeatureGrid from "./feature-grid"
import {
  featureSectionDescription,
  featureSectionEyebrow,
  featureSectionTitle,
} from "./features"

export default function FeatureSectionV9() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="flex max-w-3xl flex-col items-start gap-3 text-left">
          <p className="m-0 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
            <CompassRose aria-hidden className="size-3.5 shrink-0 text-foreground/75" weight="regular" />
            {featureSectionEyebrow}
          </p>
          <h2 className="m-0 font-serif text-4xl font-medium leading-[1.08] tracking-[-0.03em] text-balance sm:text-[2.625rem] lg:text-5xl lg:leading-[1.06]">
            {featureSectionTitle}
          </h2>
          <p className="m-0 mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
            {featureSectionDescription}
          </p>
        </header>

        <div className="pt-12 md:pt-14 lg:pt-16">
          <FeatureGrid />
        </div>
      </div>
    </section>
  )
}
