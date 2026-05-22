import Image from "next/image"

import { ensureUiceptionBlockMedia } from "@/lib/ensure-uiception-block-media"
import MacbookPro from "../macbook-pro/macbook-pro"

const SCREEN_WALLPAPER =
  "/images/blocks/macbook-pro-with-image/macos-monterey-wallpaper.png"

export default async function MacbookProWithImage() {
  await ensureUiceptionBlockMedia("macbook-pro-with-image")
  return (
    <MacbookPro>
      <div className="relative size-full">
        <Image
          src={SCREEN_WALLPAPER}
          alt="macOS Monterey default dark wallpaper"
          fill
          className="object-cover object-center"
          sizes="(max-width: 896px) 100vw, 896px"
          priority
        />
      </div>
    </MacbookPro>
  )
}
