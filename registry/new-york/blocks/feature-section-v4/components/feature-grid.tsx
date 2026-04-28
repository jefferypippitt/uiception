import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { featureSectionItems } from "../lib/features"
import "../styles/feature-grid.css"

type FeatureId = (typeof featureSectionItems)[number]["id"]

type FeatureGridProps = {
  imageById: Record<FeatureId, string>
}

export default function FeatureGrid({ imageById }: FeatureGridProps) {
  return (
    <ul className="fsv4-grid">
      {featureSectionItems.map(({ id, labelPrimary, labelSecondary, title, points }) => (
        <li key={id} className="fsv4-cell">
          <Card className="fsv4-card relative h-full w-full">
            {/* Card photo filter: edit here (e.g. grayscale, grayscale-[50%], grayscale-0). */}
            <Image
              alt=""
              aria-hidden={true}
              className="z-0 object-cover object-center grayscale"
              fill
              loading="lazy"
              sizes="(max-width: 1023px) 100vw, 33vw"
              src={imageById[id]}
            />
            <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-black via-black/80 to-black/10" />
            <div className="relative z-20 mt-auto flex flex-col">
              <CardHeader className="fsv4-card-header grid gap-2 px-[0.72rem] pb-3! pt-2! sm:px-4 sm:pb-3.5! sm:pt-2.5!">
                <div className="flex flex-wrap gap-1.5">
                  <Badge
                    className="h-auto rounded-md border border-[#cfcfcf] bg-[#f3f3f3] py-0.5 text-[0.68rem] font-semibold uppercase leading-none tracking-[0.03em] text-[#111] hover:bg-[#e8e8e8] dark:hover:bg-[#e8e8e8]"
                  >
                    {labelPrimary}
                  </Badge>
                  <Badge
                    className="h-auto rounded-md border border-[#cfcfcf] bg-[#f3f3f3] py-0.5 text-[0.68rem] font-semibold uppercase leading-none tracking-[0.03em] text-[#111] hover:bg-[#e8e8e8] dark:hover:bg-[#e8e8e8]"
                  >
                    {labelSecondary}
                  </Badge>
                </div>
                <CardTitle className="fsv4-card-title font-mono text-[#efefef]">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="fsv4-card-content px-[0.72rem] pb-4 pt-0 sm:px-4">
                <ul className="fsv4-points">
                  {points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  )
}
