import Image from "next/image"

export function HeroV1Image() {
  return (
    <Image
      src="https://uiception.com/images/blocks/hero-section-v1/hero-section-v1-bg.png"
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
