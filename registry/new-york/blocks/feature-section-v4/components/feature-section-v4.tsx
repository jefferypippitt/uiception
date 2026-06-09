import FeatureGrid from "./feature-grid"

const mediaOrigin = process.env.NEXT_PUBLIC_BASE_URL ?? "https://uiception.com"
const featureImage = (filename: string) =>
  `${mediaOrigin}/images/blocks/feature-section-v4/${filename}`

export default function FeatureSectionV4() {
  const featureImageById = {
    "cognitive-ai": featureImage("image-1.png"),
    "global-reach": featureImage("image-2.png"),
    "limitless-growth": featureImage("image-3.png"),
  } as const

  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 grid gap-3 lg:mb-11 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-end lg:gap-10">
          <h2 className="max-w-[16ch] text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.06] font-medium tracking-[-0.02em] uppercase">
            Built for What&apos;s Possible
          </h2>
          <p className="max-w-[42ch] text-3.75 leading-[1.72] font-normal text-muted-foreground lg:pb-1">
            When you are building what comes next, you need tools that learn
            from real use, work across regions, and grow with every goal you
            add.
          </p>
        </div>
        <FeatureGrid imageById={featureImageById} />
      </div>
    </section>
  )
}
