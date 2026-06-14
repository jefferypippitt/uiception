import type { Brand } from "../lib/brands"

export default function BrandLogo({ brand }: { brand: Brand }) {
  const Light = brand.light
  const Dark = brand.dark

  if (Dark) {
    return (
      <span className="inline-flex size-10 shrink-0 items-center justify-center text-foreground">
        <Light
          className="block size-full dark:hidden"
          aria-label={brand.name}
        />
        <Dark
          className="hidden size-full dark:block"
          aria-label={brand.name}
        />
      </span>
    )
  }

  return (
    <span className="inline-flex size-10 shrink-0 items-center justify-center text-foreground">
      <Light className="size-full" aria-label={brand.name} />
    </span>
  )
}
