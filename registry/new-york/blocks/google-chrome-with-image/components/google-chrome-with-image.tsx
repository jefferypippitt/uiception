import { GoogleChromeWithImageRoot } from "./google-chrome-with-image-root"
import { createBlockImage } from "@/lib/block-media"

const blockImage = createBlockImage("google-chrome-with-image")
export default function GoogleChromeWithImage() {
  return <GoogleChromeWithImageRoot screenSrc={blockImage("image.png")} />
}
