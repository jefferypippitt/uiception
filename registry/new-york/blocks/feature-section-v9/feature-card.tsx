"use client"

import { FeatureIcon } from "./feature-icons"
import { FeatureSectionV9ShaderBg } from "./feature-section-v9-shader-bg"
import type { FeatureItem } from "./features"

export default function FeatureCard({ item }: { item: FeatureItem }) {
  const { index, title, description, icon, shader } = item

  return (
    <article
      className="flex w-full flex-1 flex-col text-left"
      data-feature-index={index}
    >
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-sm bg-black motion-reduce:bg-[color-mix(in_oklab,var(--muted)_72%,var(--background)_28%)]">
        <FeatureSectionV9ShaderBg {...shader} />
        <FeatureIcon
          icon={icon}
          className="relative z-10 size-9 text-white motion-reduce:text-foreground/80"
        />
      </div>
      <div className="flex flex-col gap-1.5 pt-4">
        <h3 className="m-0 text-base font-semibold leading-snug tracking-[-0.01em] text-foreground">
          {title}
        </h3>
        <p className="m-0 text-sm leading-[1.55] text-muted-foreground">
          {description}
        </p>
      </div>
    </article>
  )
}
