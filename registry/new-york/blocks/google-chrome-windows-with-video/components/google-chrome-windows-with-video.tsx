import { existsSync } from "node:fs"
import { join } from "node:path"

import { GoogleChromeWindowsWithVideoRoot } from "./google-chrome-windows-with-video-root"

const blockVideo = (filename: string) => {
  const relPath = `videos/blocks/google-chrome-windows-with-video/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}

export default function GoogleChromeWindowsWithVideo() {
  return (
    <GoogleChromeWindowsWithVideoRoot screenSrc={blockVideo("video.mp4")} />
  )
}
