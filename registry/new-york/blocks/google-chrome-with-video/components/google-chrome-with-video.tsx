import { existsSync } from "node:fs"
import { join } from "node:path"

import { GoogleChromeWithVideoRoot } from "./google-chrome-with-video-root"

const blockVideo = (filename: string) => {
  const relPath = `videos/blocks/google-chrome-with-video/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}

export default function GoogleChromeWithVideo() {
  return <GoogleChromeWithVideoRoot screenSrc={blockVideo("video.mp4")} />
}
