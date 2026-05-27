"use client"

import { useCallback, useState } from "react"

import GoogleChromeWindows from "../google-chrome-windows/google-chrome-windows"
import GoogleHomePreview from "../google-chrome-windows/google-home-preview"
import PageLoadingBar from "../google-chrome-windows/page-loading-bar"
import { useSimulatedPageLoad } from "../google-chrome-windows/use-simulated-page-load"

const mediaOrigin =
  process.env.NEXT_PUBLIC_USE_LOCAL_BLOCK_MEDIA === "true"
    ? ""
    : "https://uiception.com"

const SCREEN_VIDEO = `${mediaOrigin}/videos/blocks/macbook-pro-with-video/screen-demo.mp4`

const OMNIBOX_PROMPTS = ["vercel.com/home"] as const

export default function GoogleChromeWindowsWithVideo() {
  const [cycleKey, setCycleKey] = useState(0)
  const { phase, progress, startLoading, reset } = useSimulatedPageLoad()

  const handleTypedComplete = useCallback(() => {
    startLoading()
  }, [startLoading])

  const handleVideoEnded = useCallback(() => {
    reset()
    setCycleKey((k) => k + 1)
  }, [reset])

  return (
    <GoogleChromeWindows
      key={cycleKey}
      omniboxTypingPrompts={OMNIBOX_PROMPTS}
      omniboxTypingLoop={false}
      onOmniboxTypedComplete={handleTypedComplete}
    >
      <div className="relative size-full">
        <PageLoadingBar progress={progress} visible={phase === "loading"} />
        {phase === "loaded" ? (
          <video
            className="absolute inset-0 block size-full border-none object-cover object-center"
            src={SCREEN_VIDEO}
            muted
            playsInline
            autoPlay
            onEnded={handleVideoEnded}
            aria-label="Screen content video demo"
          />
        ) : (
          <GoogleHomePreview className="absolute inset-0" />
        )}
      </div>
    </GoogleChromeWindows>
  )
}
