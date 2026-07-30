import { createBlockVideo } from "@/lib/block-media"

import Iphone17ProMax from "../../iphone-17-pro-max/components/iphone-17-pro-max"

const blockVideo = createBlockVideo("iphone-17-pro-max-with-video")
const SCREEN_VIDEO = blockVideo("video.mp4")

export default function Iphone17ProMaxWithVideo() {
  return (
    <Iphone17ProMax statusBar={{ tint: "light" }}>
      <div className="relative size-full overflow-hidden">
        <video
          className="absolute inset-0 size-full max-w-none border-none object-cover object-center"
          src={SCREEN_VIDEO}
          muted
          loop
          playsInline
          autoPlay
          aria-label="Screen content video demo"
        />
      </div>
    </Iphone17ProMax>
  )
}
