import { existsSync } from "node:fs"
import { join } from "node:path"

import { GoogleChromeWithImageRoot } from "./google-chrome-with-image-root"

const blockImage = (filename: string) => {
  const relPath = `images/blocks/google-chrome-with-image/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}

export default function GoogleChromeWithImage() {
  return <GoogleChromeWithImageRoot screenSrc={blockImage("image.png")} />
}
