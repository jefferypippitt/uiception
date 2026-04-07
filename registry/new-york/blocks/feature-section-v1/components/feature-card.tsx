import Image from "next/image"

import { cn } from "@/lib/utils"
import type { Feature } from "../lib/features"

type Props = {
  feature: Feature
  index: number
  isVisible: boolean
}

export default function FeatureCard({ feature, index, isVisible }: Props) {
  const Icon = feature.icon
  const isWide = feature.layout === "wide"

  return (
    <article
      className={cn(
        "fsv1-card group relative overflow-hidden rounded-2xl border bg-card shadow-sm",
        isWide ? "lg:col-span-2" : "lg:col-span-1",
      )}
      data-visible={isVisible}
      data-layout={feature.layout}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {isWide && feature.imageSrc ? (
        <div className="flex h-full min-h-0 flex-col gap-5 p-5 lg:flex-row lg:items-stretch">
          <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-xl lg:aspect-auto lg:w-1/2 lg:min-h-[220px]">
            <Image
              src={feature.imageSrc}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={index === 0}
            />
          </div>
          <div className="flex flex-col justify-center gap-3 lg:w-1/2 lg:py-1">
            <div className="fsv1-icon-wrap flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <Icon className="fsv1-icon size-[18px]" strokeWidth={1.75} />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-base font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col gap-4 p-6">
          <div className="fsv1-icon-wrap flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <Icon className="fsv1-icon size-[18px]" strokeWidth={1.75} />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-base font-semibold tracking-tight">
              {feature.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </div>
        </div>
      )}
    </article>
  )
}
