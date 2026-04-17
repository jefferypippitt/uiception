import { GeistMono } from "geist/font/mono"

import FeatureShowcase from "./components/feature-showcase"
import "./styles/feature-section-v3.css"

export default function FeatureSectionV3() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4">

        <h2 className="max-w-3xl text-3xl font-medium leading-tight tracking-tighter sm:text-4xl lg:text-5xl">
          Acme{" "}
          <span
            className="fsv3-highlight inline-flex whitespace-nowrap rounded-sm border border-amber-500/40 bg-amber-500/10 px-1 py-px align-baseline text-amber-600 dark:text-amber-400"
            style={{ animationDelay: "0s" }}
          >
            finds
            <sup className={`${GeistMono.className} fsv3-highlight__index ml-0.5 text-[0.34em] font-semibold text-amber-600/80 dark:text-amber-400/85`}>
              01
            </sup>
          </span>
          {" "}opportunities in your product,{" "}
          <span
            className="fsv3-highlight inline-flex whitespace-nowrap rounded-sm border border-purple-500/40 bg-purple-500/10 px-1 py-px align-baseline text-purple-600 dark:text-purple-400"
            style={{ animationDelay: "0.4s" }}
          >
            understands
            <sup className={`${GeistMono.className} fsv3-highlight__index ml-0.5 text-[0.34em] font-semibold text-purple-600/80 dark:text-purple-400/85`}>
              02
            </sup>
          </span>
          {" "}what&apos;s driving behavior, and delivers{" "}
          <span
            className="fsv3-highlight inline-flex whitespace-nowrap rounded-sm border border-green-500/40 bg-green-500/10 px-1 py-px align-baseline text-green-600 dark:text-green-400"
            style={{ animationDelay: "0.8s" }}
          >
            growth
            <sup className={`${GeistMono.className} fsv3-highlight__index ml-0.5 text-[0.34em] font-semibold text-green-600/80 dark:text-green-400/85`}>
              03
            </sup>
          </span>
          {" "}from insight to impact.
        </h2>

        <div className="mt-12 lg:mt-16">
          <FeatureShowcase />
        </div>

      </div>
    </section>
  )
}
