import MacbookPro from "../macbook-pro/macbook-pro"

const SCREEN_VIDEO =
  "https://uiception.com/videos/blocks/macbook-pro-with-video/screen-demo.mp4"

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
