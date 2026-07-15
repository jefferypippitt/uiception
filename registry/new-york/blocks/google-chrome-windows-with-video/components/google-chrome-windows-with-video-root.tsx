"use client"

import { useCallback, useState } from "react"

import GoogleChromeWindows from "../../google-chrome-windows/components/google-chrome-windows"
import GoogleHomePreview from "../../google-chrome-windows/components/google-home-preview"
import PageLoadingBar from "../../google-chrome-windows/components/page-loading-bar"
import { useSimulatedPageLoad } from "../../google-chrome-windows/hooks/use-simulated-page-load"


const OMNIBOX_PROMPTS = ["vercel.com/home"] as const

export function GoogleChromeWindowsWithVideoRoot({ screenSrc }: { screenSrc: string }) {
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
      aspectRatio="16/9"
      minHeight={0}
      className="max-w-4xl"
    >
      <div className="relative size-full">
        <PageLoadingBar progress={progress} visible={phase === "loading"} />
        {phase === "loaded" ? (
          <video
            className="absolute inset-0 block size-full border-none object-cover object-center"
            src={screenSrc}
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
