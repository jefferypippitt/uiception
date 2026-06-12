"use client"

import { useCallback } from "react"

import GoogleChrome from "../../google-chrome/components/google-chrome"
import GoogleHomePreview from "../../google-chrome/components/google-home-preview"
import PageLoadingBar from "../../google-chrome/components/page-loading-bar"
import { useSimulatedPageLoad } from "../../google-chrome/hooks/use-simulated-page-load"

const mediaOrigin = process.env.NEXT_PUBLIC_BASE_URL ?? "https://uiception.com"
const SCREEN_VIDEO = `${mediaOrigin}/videos/blocks/google-chrome-with-video/video.mp4`

export default function GoogleChromeWithVideo() {
  const { phase, progress, startLoading } = useSimulatedPageLoad()

  const handleTypedComplete = useCallback(() => {
    startLoading()
  }, [startLoading])

  return (
    <GoogleChrome
      omniboxTypingLoop={false}
      onOmniboxTypedComplete={handleTypedComplete}
      aspectRatio="16/9"
      minHeight={0}
      className="max-w-4xl"
    >
      <div className="relative size-full">
        <PageLoadingBar progress={progress} visible={phase === "loading"} />
        {phase === "loaded" ? (
          <video
            className="absolute inset-0 block size-full border-none object-cover object-center"
            src={SCREEN_VIDEO}
            muted
            loop
            playsInline
            autoPlay
            aria-label="Screen content video demo"
          />
        ) : (
          <GoogleHomePreview className="absolute inset-0" />
        )}
      </div>
    </GoogleChrome>
  )
}
