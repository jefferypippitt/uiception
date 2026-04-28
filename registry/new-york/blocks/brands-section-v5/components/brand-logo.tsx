import type { Brand } from "../lib/brands"

export default function BrandLogo({ brand }: { brand: Brand }) {
  const Light = brand.light
  const Dark = brand.dark

  if (Dark) {
    return (
      <span className="inline-flex h-7 w-32 items-center justify-center md:h-8 md:w-36">
        <Light className="bs5-logo block h-full w-full dark:hidden" aria-label={brand.name} />
        <Dark className="bs5-logo hidden h-full w-full dark:block" aria-label={brand.name} />
      </span>
    )
  }

  return (
    <span className="inline-flex h-7 w-32 items-center justify-center md:h-8 md:w-36">
      <Light className="bs5-logo h-full w-full" aria-label={brand.name} />
    </span>
  )
}
