import { GeistSans } from "geist/font/sans"

import FeatureGrid from "./feature-grid"

export default function FeatureSectionV6() {
  return (
    <section className={`${GeistSans.className} py-4 md:py-6 lg:py-8`}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-2xl text-3xl tracking-tighter sm:text-4xl lg:text-5xl lg:leading-[1.15]">
            Stay ahead as things get more{" "}
            <span className="text-muted-foreground">complex</span>
          </h2>
     
          <p className="max-w-xl text-base leading-7 tracking-tight text-muted-foreground sm:text-lg sm:leading-8">
            As demands grow, the platform remains quick, intuitive, and seamlessly integrated.
          </p>
     
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-8 md:pt-10 lg:pt-12">
        <FeatureGrid />
      </div>
    </section>
  )
}
