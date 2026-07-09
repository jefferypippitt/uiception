import { featureSectionItems } from "../lib/features"

import { FeatureSectionV6MeshBg } from "./feature-section-v6-mesh-bg"

import "../styles/feature-grid.css"

export default function FeatureGrid() {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
      {featureSectionItems.map(({ id, title, description, shader }) => (
        <li key={id} className="flex min-w-0">
          <div className="fsv6-card relative flex w-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-[#0a0a0a] text-foreground motion-reduce:bg-[color-mix(in_oklab,var(--muted)_78%,var(--background)_22%)] lg:min-h-54">
            <FeatureSectionV6MeshBg {...shader} />
            <div
              className="fsv6-card-scrim pointer-events-none absolute inset-0 z-1 motion-reduce:hidden"
              aria-hidden
            />
            <div className="relative z-10 flex flex-col gap-3 p-[1.35rem] md:gap-3.5 md:p-6 lg:min-h-0 lg:flex-1">
              <h3 className="m-0 text-xl leading-[1.1] font-semibold tracking-[-0.03em] text-white motion-reduce:text-foreground/90 sm:text-[1.375rem]">
                {title}
              </h3>
              <p className="m-0 max-w-[32ch] text-pretty text-[0.9375rem] leading-[1.65] tracking-[-0.012em] text-white/68 motion-reduce:text-muted-foreground md:text-base md:leading-[1.6] lg:mt-auto">
                {description}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
