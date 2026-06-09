import Image from "next/image"

const mediaOrigin = process.env.NEXT_PUBLIC_BASE_URL ?? "https://uiception.com"
const HERO_V6_IMAGE = `${mediaOrigin}/images/blocks/hero-section-v6/image.jpg`

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
      preload={true}
    />
  )
}
