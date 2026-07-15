import { GoogleChromeWithVideoRoot } from "./google-chrome-with-video-root"
import { createBlockVideo } from "@/lib/block-media"

const blockVideo = createBlockVideo("google-chrome-with-video")
export default function GoogleChromeWithVideo() {
  return <GoogleChromeWithVideoRoot screenSrc={blockVideo("video.mp4")} />
}
