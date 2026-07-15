import { GoogleChromeWindowsWithVideoRoot } from "./google-chrome-windows-with-video-root"
import { createBlockVideo } from "@/lib/block-media"

const blockVideo = createBlockVideo("google-chrome-windows-with-video")
export default function GoogleChromeWindowsWithVideo() {
  return (
    <GoogleChromeWindowsWithVideoRoot screenSrc={blockVideo("video.mp4")} />
  )
}
