"use client"

import StepsGrid from "./steps-grid"

export default function HowItWorksSectionV2() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <StepsGrid
        title={
          <h2 className="text-4xl leading-tight font-light tracking-tight sm:text-5xl lg:text-6xl">
            How It Works
          </h2>
        }
      />
    </section>
  )
}
