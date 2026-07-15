import MacbookPro from "../../macbook-pro/components/macbook-pro"
import { createBlockVideo } from "@/lib/block-media"

const blockVideo = createBlockVideo("macbook-pro-with-video")

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
