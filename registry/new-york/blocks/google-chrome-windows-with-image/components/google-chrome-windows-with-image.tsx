import { existsSync } from "node:fs"
import { join } from "node:path"

import { GoogleChromeWindowsWithImageRoot } from "./google-chrome-windows-with-image-root"

const blockImage = (filename: string) => {
  const relPath = `images/blocks/google-chrome-windows-with-image/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}

export default function GoogleChromeWindowsWithImage() {
  return (
    <GoogleChromeWindowsWithImageRoot screenSrc={blockImage("image.png")} />
  )
}
