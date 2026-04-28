import FeatureGrid from "./components/feature-grid"

export default function FeatureSectionV4() {
  
  const featureImageById = {
    "cognitive-ai": "/images/blocks/feature-section-v4/feature-section-v4-brain.png",
    "global-reach": "/images/blocks/feature-section-v4/feature-section-v4-planet.png",
    "limitless-growth": "/images/blocks/feature-section-v4/feature-section-v4-hand.png",
  } as const

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 grid gap-3 lg:mb-11 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-end lg:gap-10">
          <h2 className="max-w-[16ch] text-[clamp(1.75rem,3.4vw,2.75rem)] font-medium uppercase leading-[1.06] tracking-[-0.02em]">
            Built for What&apos;s Possible
          </h2>
          <p className="max-w-[42ch] text-[0.9375rem] font-normal leading-[1.72] text-muted-foreground lg:pb-1">
            When you are building what comes next, you need tools that learn from
            real use, work across regions, and grow with every goal you add.
          </p>
        </div>
        <FeatureGrid imageById={featureImageById} />
      </div>
    </section>
  )
}
