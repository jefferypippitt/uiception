import type { ComponentType } from "react"

import { ArrowUpRightIcon } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

import GuidesMemoriesIllustration from "./guides-memories-illustration"
import TripPlannerIllustration from "./trip-planner-illustration"
import { FeatureCardCorners } from "./feature-card-corners"
import SmartSearchIllustration from "./smart-search-illustration"
import { featureColumns, type FeatureIllustrationId } from "../lib/features"

const illustrationComponents: Record<FeatureIllustrationId, ComponentType> = {
  "trip-planner": TripPlannerIllustration,
  "smart-search": SmartSearchIllustration,
  "guides-memories": GuidesMemoriesIllustration,
}

export default function FeatureGrid() {
  return (
    <ul className="m-0 mt-6 grid list-none grid-cols-1 p-0 lg:mt-8 lg:grid-cols-3">
      {featureColumns.map(
        ({ id, title, description, ctaLabel, ctaHref, illustration }, index) => {
          const Illustration = illustrationComponents[illustration]

          return (
            <li
              key={id}
              className={cn(
                "group relative flex min-h-104 flex-col gap-6 border border-border px-6 py-12 sm:min-h-112 sm:px-8 sm:py-14 lg:min-h-120 lg:flex-col lg:gap-7 lg:px-10 lg:py-16",
                index > 0 && "-mt-px lg:mt-0 lg:-ml-px"
              )}
            >
              <FeatureCardCorners />

              <div>
                <h3 className="m-0 text-xl font-medium tracking-[-0.02em] text-foreground sm:text-[1.375rem]">
                  {title}
                </h3>
                <p className="m-0 mt-3 max-w-[36ch] text-[0.9375rem] leading-[1.65] text-muted-foreground">
                  {description}
                </p>
              </div>

              <div className="flex flex-1 flex-col">
                <div className="pointer-events-none flex w-full min-h-0 flex-1 items-end justify-center overflow-hidden">
                  <Illustration />
                </div>

                <div className="relative z-10 mt-auto flex justify-center pt-8">
                  <Link
                    href={ctaHref}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-muted"
                  >
                    {ctaLabel}
                    <ArrowUpRightIcon
                      className="size-3.5 shrink-0"
                      aria-hidden
                    />
                  </Link>
                </div>
              </div>
            </li>
          )
        }
      )}
    </ul>
  )
}
