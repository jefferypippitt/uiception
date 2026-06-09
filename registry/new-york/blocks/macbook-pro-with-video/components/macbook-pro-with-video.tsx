import MacbookPro from "../../macbook-pro/components/macbook-pro"

const mediaOrigin = process.env.NEXT_PUBLIC_BASE_URL ?? "https://uiception.com"
const SCREEN_VIDEO = `${mediaOrigin}/videos/blocks/macbook-pro-with-video/video.mp4`

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
