import type { CompanyLogo } from "../lib/testimonials-content"

export default function CompanyLogo({ logo }: { logo: CompanyLogo }) {
  const Light = logo.light
  const Dark = logo.dark

  if (Dark) {
    return (
      <span className="inline-flex h-5 max-w-24 shrink-0 items-center justify-end md:h-6">
        <Light
          className="block h-full w-auto max-w-full dark:hidden"
          aria-label={logo.name}
        />
        <Dark
          className="hidden h-full w-auto max-w-full dark:block"
          aria-label={logo.name}
        />
      </span>
    )
  }

  return (
    <span className="inline-flex h-5 max-w-24 shrink-0 items-center justify-end md:h-6">
      <Light className="h-full w-auto max-w-full" aria-label={logo.name} />
    </span>
  )
}
