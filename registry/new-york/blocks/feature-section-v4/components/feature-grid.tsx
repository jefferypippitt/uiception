import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { featureSectionItems } from "../lib/features"
import "../styles/feature-grid.css"

type FeatureId = (typeof featureSectionItems)[number]["id"]

type FeatureGridProps = {
  imageById: Record<FeatureId, string>
}

export default function FeatureGrid({ imageById }: FeatureGridProps) {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:gap-3.4 lg:grid-cols-3 lg:gap-3.6">
      {featureSectionItems.map(
        ({ id, labelPrimary, labelSecondary, title, points }) => (
          <li key={id} className="min-w-0">
            <Card className="relative flex h-full min-h-68 w-full flex-col gap-0 p-0 sm:min-h-80 lg:min-h-88">

              <Image
                alt=""
                aria-hidden={true}
                className="z-0 object-cover object-center grayscale"
                fill
                loading="lazy"
                sizes="(max-width: 1023px) 100vw, 33vw"
                src={imageById[id]}
                unoptimized
              />
              <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-black via-black/80 to-black/10" />
              <div className="relative z-20 mt-auto flex flex-col">
                <CardHeader className="grid gap-2 rounded-none bg-transparent px-2.88 pt-2! pb-3! sm:px-4 sm:pt-2.5! sm:pb-3.5!">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge className="h-auto rounded-md border border-[#cfcfcf] bg-[#f3f3f3] py-0.5 text-2.72 leading-none font-semibold tracking-[0.03em] text-[#111] uppercase hover:bg-[#e8e8e8] dark:hover:bg-[#e8e8e8]">
                      {labelPrimary}
                    </Badge>
                    <Badge className="h-auto rounded-md border border-[#cfcfcf] bg-[#f3f3f3] py-0.5 text-2.72 leading-none font-semibold tracking-[0.03em] text-[#111] uppercase hover:bg-[#e8e8e8] dark:hover:bg-[#e8e8e8]">
                      {labelSecondary}
                    </Badge>
                  </div>
                  <CardTitle className="m-0 min-h-[calc(1.03rem*1.28*2)] font-mono text-4.12 leading-[1.28] font-semibold tracking-[-0.015em] text-[#efefef] uppercase">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2.88 pt-0 pb-4 sm:px-4">
                  <ul className="fsv4-points m-0 grid list-none gap-0.88 p-0 font-mono text-2.92 leading-normal tracking-[0.025em] text-[#c8cccc] uppercase">
                    {points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </CardContent>
              </div>
            </Card>
          </li>
        )
      )}
    </ul>
  )
}
