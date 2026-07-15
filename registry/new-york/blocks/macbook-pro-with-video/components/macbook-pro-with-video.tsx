import { existsSync } from "node:fs"
import { join } from "node:path"

import MacbookPro from "../../macbook-pro/components/macbook-pro"

const blockVideo = (filename: string) => {
  const relPath = `videos/blocks/macbook-pro-with-video/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}
const SCREEN_VIDEO = blockVideo("video.mp4")

export default function MacbookProWithVideo() {
  return (
    <MacbookPro>
      <video
        className="absolute inset-0 block size-full border-none object-cover object-center"
        src={SCREEN_VIDEO}
        muted
        loop
        playsInline
        autoPlay
        aria-label="Screen content video demo"
      />
    </MacbookPro>
  )
}
