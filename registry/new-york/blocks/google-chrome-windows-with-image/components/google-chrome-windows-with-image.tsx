import { GoogleChromeWindowsWithImageRoot } from "./google-chrome-windows-with-image-root"
import { createBlockImage } from "@/lib/block-media"

const blockImage = createBlockImage("google-chrome-windows-with-image")
export default function GoogleChromeWindowsWithImage() {
  return (
    <GoogleChromeWindowsWithImageRoot screenSrc={blockImage("image.png")} />
  )
}
