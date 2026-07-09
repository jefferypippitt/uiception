import { ArrowUpRightIcon } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

import { FeatureCardCorners } from "./feature-card-corners"
import { featureColumns } from "../lib/features"

export default function FeatureGrid() {
  return (
    <ul className="m-0 mt-6 grid list-none grid-cols-1 p-0 lg:mt-8 lg:grid-cols-3">
      {featureColumns.map(({ id, title, description, ctaLabel, ctaHref }, index) => (
        <li
          key={id}
          className={cn(
            "group relative flex flex-col gap-8 border border-border px-6 py-12 sm:px-8 sm:py-14 lg:gap-10 lg:px-10 lg:py-16",
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

          <div className="mt-auto flex justify-center pt-2">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-muted"
            >
              {ctaLabel}
              <ArrowUpRightIcon className="size-3.5 shrink-0" aria-hidden />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}
