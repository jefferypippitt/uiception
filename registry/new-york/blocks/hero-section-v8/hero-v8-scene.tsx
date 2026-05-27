"use client"

import Image from "next/image"

import SimpleChatbot from "../simple-chatbot/simple-chatbot"

const mediaOrigin =
  process.env.NEXT_PUBLIC_USE_LOCAL_BLOCK_MEDIA === "true"
    ? ""
    : "https://uiception.com"

const HERO_V8_BG = `${mediaOrigin}/images/blocks/hero-section-v8/hero-section-v8-bg.png`

type HeroV8SceneProps = {
  prompts?: readonly string[]
}

export function HeroV8Scene({ prompts }: HeroV8SceneProps) {
  return (
    <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-lg max-sm:mt-3.5 sm:mt-[clamp(1rem,1.5vw,1.5rem)]">
      <Image
        src={HERO_V8_BG}
        alt="Pixel art desert landscape with a winding river"
        unoptimized
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1280px"
        priority
      />
      <div className="pointer-events-none absolute inset-0 z-1 flex items-center justify-center p-4 sm:p-8 [&_.scb-page]:p-0 [&_.scb-root]:pointer-events-auto [&_.scb-root]:w-full [&_.scb-root]:max-w-xl">
        <SimpleChatbot prompts={prompts} />
      </div>
    </div>
  )
}
