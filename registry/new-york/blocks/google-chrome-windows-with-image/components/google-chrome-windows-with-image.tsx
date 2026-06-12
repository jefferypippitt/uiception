"use client"

import Image from "next/image"
import { useCallback } from "react"

import GoogleChromeWindows from "../../google-chrome-windows/components/google-chrome-windows"
import GoogleHomePreview from "../../google-chrome-windows/components/google-home-preview"
import PageLoadingBar from "../../google-chrome-windows/components/page-loading-bar"
import { useSimulatedPageLoad } from "../../google-chrome-windows/hooks/use-simulated-page-load"

const mediaOrigin = process.env.NEXT_PUBLIC_BASE_URL ?? "https://uiception.com"
const SCREEN_IMAGE = `${mediaOrigin}/images/blocks/google-chrome-windows-with-image/image.png`

const OMNIBOX_PROMPTS = ["vercel.com/home"] as const

export default function GoogleChromeWindowsWithImage() {
  const { phase, progress, startLoading } = useSimulatedPageLoad()

  const handleTypedComplete = useCallback(() => {
    startLoading()
  }, [startLoading])

  return (
    <GoogleChromeWindows
      omniboxTypingPrompts={OMNIBOX_PROMPTS}
      omniboxTypingLoop={false}
      onOmniboxTypedComplete={handleTypedComplete}
      aspectRatio="1075/719"
      minHeight={0}
      className="max-w-4xl"
    >
      <div className="relative size-full">
        <PageLoadingBar progress={progress} visible={phase === "loading"} />
        {phase === "loaded" ? (
          <div className="relative size-full">
            <Image
              src={SCREEN_IMAGE}
              alt="Browser screen content"
              unoptimized
              fill
              className="object-cover object-top"
              sizes="(max-width: 1152px) 100vw, 1152px"
              loading="eager"
            />
          </div>
        ) : (
          <GoogleHomePreview className="absolute inset-0" />
        )}
      </div>
    </GoogleChromeWindows>
  )
}
