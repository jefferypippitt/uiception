import Image from "next/image"

const mediaOrigin =
  process.env.NEXT_PUBLIC_USE_LOCAL_BLOCK_MEDIA === "true"
    ? ""
    : "https://uiception.com"

const HERO_V1_BG = `${mediaOrigin}/images/blocks/hero-section-v1/hero-section-v1-bg.png`

export function HeroV1Image() {
  return (
    <Image
      src={HERO_V1_BG}
      unoptimized
      alt=""
      fill
      className="pointer-events-none absolute inset-0 z-0 object-cover object-center"
      sizes="(max-width: 1024px) 100vw, 1152px"
      priority
      aria-hidden
    />
  )
}
