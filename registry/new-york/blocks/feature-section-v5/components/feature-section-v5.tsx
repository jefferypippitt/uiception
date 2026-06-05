import { GeistSans } from "geist/font/sans"

import FeatureGrid from "./feature-grid"

export default function FeatureSectionV5() {
  return (
    <section
      className={`${GeistSans.className} py-4 text-foreground md:py-6`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-4 text-center md:mb-14 lg:mb-16">
          <h2 className="text-4xl leading-[1.1] font-medium tracking-[-0.03em] lg:text-5xl">
            Less noise.{" "}
            <span className="font-semibold">More signal.</span>
          </h2>
          <p className="max-w-xl text-3.75 leading-relaxed text-muted-foreground">
            Focused tools built around how great teams actually work. Nothing
            unnecessary, everything intentional.
          </p>
        </div>
        <FeatureGrid />
      </div>
    </section>
  )
}
