import MacbookPro from "../macbook-pro/macbook-pro"

const mediaOrigin =
  process.env.NEXT_PUBLIC_USE_LOCAL_BLOCK_MEDIA === "true"
    ? ""
    : "https://uiception.com"

const SCREEN_VIDEO = `${mediaOrigin}/videos/blocks/macbook-pro-with-video/screen-demo.mp4`

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
