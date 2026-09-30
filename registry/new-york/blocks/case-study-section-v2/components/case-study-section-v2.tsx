import Image from "next/image"

import { createBlockImage } from "@/lib/block-media"

import { caseStudy, metrics } from "../lib/config"
import { MetricChart } from "./metric-chart"

const blockImage = createBlockImage("case-study-section-v2")

export default function CaseStudySectionV2() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="max-w-2xl text-3xl leading-[1.15] font-medium tracking-tight text-foreground md:text-4xl">
          {caseStudy.title}
        </h2>

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted md:col-span-7 md:aspect-auto md:min-h-96">
            <Image
              src={blockImage(caseStudy.imageFile)}
              alt={caseStudy.alt}
              fill
              unoptimized
              priority
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col md:col-span-5 md:justify-center">
            <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
              {caseStudy.summary}
            </p>

            <dl className="mt-8 divide-y divide-border">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="flex items-center justify-between gap-6 py-4"
                >
                  <div className="flex min-w-0 flex-col-reverse gap-0.5">
                    <dt className="text-sm text-muted-foreground">
                      {metric.label}
                    </dt>
                    <dd className="text-xl font-medium tracking-tight text-foreground tabular-nums">
                      {metric.value}
                    </dd>
                  </div>
                  <div
                    aria-hidden
                    className="aspect-[160/56] w-32 shrink-0 lg:w-40"
                  >
                    <MetricChart chart={metric.chart} />
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
