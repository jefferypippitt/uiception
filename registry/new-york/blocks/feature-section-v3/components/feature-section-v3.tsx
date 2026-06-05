import { GeistMono } from "geist/font/mono"

import FeatureShowcase from "./feature-showcase"
import "../styles/feature-section-v3.css"

export default function FeatureSectionV3() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="max-w-3xl text-3xl leading-tight font-medium tracking-tighter sm:text-4xl lg:text-5xl">
          Acme{" "}
          <span
            className="fsv3-highlight inline-flex rounded-sm border border-border bg-muted/50 px-1 py-px align-baseline whitespace-nowrap text-foreground"
            style={{ animationDelay: "0s" }}
          >
            finds
            <sup
              className={`${GeistMono.className} fsv3-highlight__index ml-0.5 text-[0.34em] font-semibold text-muted-foreground`}
            >
              01
            </sup>
          </span>{" "}
          opportunities in your product,{" "}
          <span
            className="fsv3-highlight inline-flex rounded-sm border border-border bg-muted/50 px-1 py-px align-baseline whitespace-nowrap text-foreground"
            style={{ animationDelay: "0.4s" }}
          >
            understands
            <sup
              className={`${GeistMono.className} fsv3-highlight__index ml-0.5 text-[0.34em] font-semibold text-muted-foreground`}
            >
              02
            </sup>
          </span>{" "}
          what&apos;s driving behavior, and delivers{" "}
          <span
            className="fsv3-highlight inline-flex rounded-sm border border-border bg-muted/50 px-1 py-px align-baseline whitespace-nowrap text-foreground"
            style={{ animationDelay: "0.8s" }}
          >
            growth
            <sup
              className={`${GeistMono.className} fsv3-highlight__index ml-0.5 text-[0.34em] font-semibold text-muted-foreground`}
            >
              03
            </sup>
          </span>{" "}
          from insight to impact.
        </h2>

        <div className="mt-12 lg:mt-16">
          <FeatureShowcase />
        </div>
      </div>
    </section>
  )
}
