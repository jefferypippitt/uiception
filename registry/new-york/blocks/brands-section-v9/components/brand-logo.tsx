import type { Brand } from "../lib/brands"

export default function BrandLogo({ brand }: { brand: Brand }) {
  const Logo = brand.Logo

  return (
    <span className="inline-flex h-6 max-w-36 items-center justify-center md:h-7 md:max-w-40">
      <Logo
        className="h-full w-auto opacity-40 brightness-0 dark:invert"
        aria-label={brand.name}
      />
    </span>
  )
}
