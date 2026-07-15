import Image from "next/image"

type HeroV6ImageProps = {
  src: string
}

export function HeroV6Image({ src }: HeroV6ImageProps) {
  return (
    <Image
      src={src}
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
