export type HeroV7Cta = {
  label: string
  href: string
}

export type HeroV7Content = {
  title: string
  description: string
  primaryCta: HeroV7Cta
  secondaryCta: HeroV7Cta
}

/** Edit these defaults after installing the block, or pass overrides to `<HeroSectionV7 />`. */
export const heroV7Content: HeroV7Content = {
  title: "Ship integrations without rewiring your stack",
  description:
    "One layer to ingest, transform, and deliver events to the tools you already run.",
  primaryCta: { label: "Get started", href: "/signup" },
  secondaryCta: { label: "View docs", href: "/docs" },
}

export type HeroV7Props = Partial<HeroV7Content>

export function resolveHeroV7Content(overrides?: HeroV7Props): HeroV7Content {
  return {
    title: overrides?.title ?? heroV7Content.title,
    description: overrides?.description ?? heroV7Content.description,
    primaryCta: overrides?.primaryCta ?? heroV7Content.primaryCta,
    secondaryCta: overrides?.secondaryCta ?? heroV7Content.secondaryCta,
  }
}
