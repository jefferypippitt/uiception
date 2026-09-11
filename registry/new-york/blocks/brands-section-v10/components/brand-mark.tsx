import type { Brand } from "../lib/brands"

export default function BrandMark({ brand }: { brand: Brand }) {
  const Light = brand.light
  const Dark = brand.dark

  return (
    <span className="inline-flex h-8 w-auto items-center md:h-9 lg:h-10">
      {Dark ? (
        <>
          <Light
            className="h-full w-auto dark:hidden"
            aria-label={brand.name}
          />
          <Dark
            className="hidden h-full w-auto dark:block"
            aria-label={brand.name}
          />
        </>
      ) : (
        <Light className="h-full w-auto" aria-label={brand.name} />
      )}
    </span>
  )
}
