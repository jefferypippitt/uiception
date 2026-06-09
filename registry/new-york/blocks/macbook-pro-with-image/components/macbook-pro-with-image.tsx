import Image from "next/image"

import MacbookPro from "../../macbook-pro/components/macbook-pro"

const mediaOrigin = process.env.NEXT_PUBLIC_BASE_URL ?? "https://uiception.com"
const SCREEN_WALLPAPER = `${mediaOrigin}/images/blocks/macbook-pro-with-image/image.png`

export default function MacbookProWithImage() {
  return (
    <MacbookPro>
      <div className="relative size-full">
        <Image
          src={SCREEN_WALLPAPER}
          alt="macOS Monterey default dark wallpaper"
          unoptimized
          fill
          className="object-cover object-center"
          sizes="(max-width: 896px) 100vw, 896px"
          loading="eager"
        />
      </div>
    </MacbookPro>
  )
}
