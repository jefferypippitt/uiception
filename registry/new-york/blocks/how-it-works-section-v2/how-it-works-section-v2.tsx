"use client"

import StepsGrid from "./components/steps-grid"
import "./styles/how-it-works-section-v2.css"

export default function HowItWorksSectionV2() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <StepsGrid
        title={
          <h2
            className="text-4xl font-light tracking-tight leading-tight sm:text-5xl lg:text-6xl"
          >
            How It Works
          </h2>
        }
      />
    </section>
  )
}
