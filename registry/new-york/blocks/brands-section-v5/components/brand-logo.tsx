import type { Brand } from "../lib/brands"

export default function BrandLogo({ brand }: { brand: Brand }) {
  const Light = brand.light
  const Dark = brand.dark

  if (Dark) {
    return (
      <span className="inline-flex h-7 w-32 items-center justify-center md:h-8 md:w-36">
        <Light
          className="block h-full w-full opacity-60 grayscale dark:hidden"
          aria-label={brand.name}
        />
        <Dark
          className="hidden h-full w-full opacity-60 grayscale dark:block"
          aria-label={brand.name}
        />
      </span>
    )
  }

  return (
    <span className="inline-flex h-7 w-32 items-center justify-center md:h-8 md:w-36">
      <Light
        className="h-full w-full opacity-60 grayscale"
        aria-label={brand.name}
      />
    </span>
  )
}
