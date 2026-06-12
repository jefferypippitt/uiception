import MacStudioDisplay from "../../mac-studio-display/components/mac-studio-display"

const mediaOrigin = process.env.NEXT_PUBLIC_BASE_URL ?? "https://uiception.com"
const SCREEN_VIDEO = `${mediaOrigin}/videos/blocks/mac-studio-display-with-video/video.mp4`

export default function MacStudioDisplayWithVideo() {
  return (
    <MacStudioDisplay>
      <div className="relative size-full overflow-hidden">
        <video
          className="absolute top-1/2 left-1/2 h-[125%] w-full max-w-none -translate-x-1/2 -translate-y-1/2 border-none object-cover object-center"
          src={SCREEN_VIDEO}
          muted
          loop
          playsInline
          autoPlay
          aria-label="Screen content video demo"
        />
      </div>
    </MacStudioDisplay>
  )
}
