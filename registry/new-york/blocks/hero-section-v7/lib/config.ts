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

export const heroV7Content: HeroV7Content = {
  title: "Find your next delivery app partner for your business",
  description:
    "Take the order, prep the food, send it out on DoorDash or Uber Eats.",
  primaryCta: { label: "Get started", href: "#" },
  secondaryCta: { label: "View docs", href: "#" },
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
