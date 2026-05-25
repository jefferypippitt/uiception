import Image from "next/image"

export function HeroV6Image() {
  return (
    <Image
      src="https://uiception.com/images/blocks/hero-section-v6/hero-section-v6.jpg"
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
