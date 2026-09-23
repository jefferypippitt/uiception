import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { createBlockImage } from "@/lib/block-media"
import { Button } from "@/components/ui/button"

import { caseStudy, metrics } from "../lib/config"

const blockImage = createBlockImage("case-study-section-v1")

const study = {
  title: caseStudy.title,
  summary: caseStudy.summary,
  src: blockImage(caseStudy.imageFile),
  alt: caseStudy.alt,
  href: caseStudy.href,
  linkLabel: caseStudy.linkLabel,
}

export default function CaseStudySectionV1() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-12 md:gap-12">
        <div className="flex flex-col md:col-span-5 md:justify-center">
          <h2 className="text-3xl leading-[1.15] font-medium tracking-tight text-foreground md:text-4xl">
            {study.title}
          </h2>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
            {study.summary}
          </p>

          <dl className="mt-8 divide-y divide-border border-y border-border">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="flex items-baseline justify-between gap-6 py-3"
              >
                <dt className="text-sm text-muted-foreground">
                  {metric.label}
                </dt>
                <dd className="text-xl font-medium tracking-tight text-foreground tabular-nums">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-4">
            <Button variant="link" asChild className="px-0">
              <Link href={study.href}>
                {study.linkLabel}
                <ArrowRightIcon />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted md:col-span-7 md:aspect-auto md:min-h-128">
          <Image
            src={study.src}
            alt={study.alt}
            fill
            unoptimized
            priority
            sizes="(max-width: 768px) 100vw, 680px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
