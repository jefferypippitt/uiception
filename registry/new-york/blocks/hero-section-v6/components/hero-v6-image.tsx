import Image from "next/image"

const HERO_V6_IMAGE = `https://uiception.com/images/blocks/hero-section-v6/image.jpg`

export function HeroV6Image() {
  return (
    <Image
      src={HERO_V6_IMAGE}
      unoptimized
      alt="Payroll operations dashboard preview"
      width={1280}
      height={720}
      className="size-full object-contain object-center"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1280px"
      priority
    />
  )
}
