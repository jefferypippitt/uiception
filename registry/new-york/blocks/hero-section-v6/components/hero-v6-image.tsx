import Image from "next/image"

const mediaOrigin =
  process.env.NEXT_PUBLIC_USE_LOCAL_BLOCK_MEDIA === "true"
    ? ""
    : "https://uiception.com"

const HERO_V6_IMAGE = `${mediaOrigin}/images/blocks/hero-section-v6/hero-section-v6.jpg`

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
