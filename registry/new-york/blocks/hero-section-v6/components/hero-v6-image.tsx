import Image from "next/image"

export function HeroV6Image() {
  return (
    <Image
      src="/images/blocks/hero-section-v6/hero-section-v6.jpg"
      alt="Payroll operations dashboard preview"
      fill
      className="object-contain"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1280px"
      priority
    />
  )
}
