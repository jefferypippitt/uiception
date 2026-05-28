import type { Brand } from "../lib/brands"

export default function BrandLogo({ brand }: { brand: Brand }) {
  const Light = brand.light
  const Dark = brand.dark

  if (Dark) {
    return (
      <span className="inline-flex h-12 w-12 items-center justify-center">
        <Light
          className="bs2-logo block h-full w-full dark:hidden"
          aria-label={brand.name}
        />
        <Dark
          className="bs2-logo hidden h-full w-full dark:block"
          aria-label={brand.name}
        />
      </span>
    )
  }

  return (
    <span className="inline-flex h-12 w-12 items-center justify-center">
      <Light className="bs2-logo h-full w-full" aria-label={brand.name} />
    </span>
  )
}
