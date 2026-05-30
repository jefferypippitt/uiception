import Image from "next/image"

import MacbookPro from "../../macbook-pro/components/macbook-pro"

const SCREEN_WALLPAPER = `https://uiception.com/images/blocks/macbook-pro-with-image/macos-monterey-wallpaper.png`

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
          priority
        />
      </div>
    </MacbookPro>
  )
}
