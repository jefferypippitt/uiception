import { existsSync } from "node:fs"
import { join } from "node:path"

import { GeistSans } from "geist/font/sans"

import CtaButtons from "./cta-buttons"
import HeroV8BrandCarousel from "./hero-v8-brand-carousel"
import { HeroV8Scene } from "./hero-v8-scene"
import { HERO_V8_TRUST_LABEL } from "../lib/carousel-timing"

import "../styles/hero-section-v8.css"

const blockImage = (filename: string) => {
  const relPath = `images/blocks/hero-section-v8/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}

const AI_ASSISTANT_PROMPTS = [
  "Explain how large language models actually work.",
  "Help me brainstorm taglines for a productivity app.",
  "What should I know before my first trip to Japan?",
  "Summarize this article in three bullet points.",
  "Write a short story that starts at a desert oasis.",
  "Compare spaced repetition vs. active recall for studying.",
] as const

export default function HeroSectionV8() {
  return (
    <section
      className={`${GeistSans.className} py-4 hyphens-none md:py-6 [&_.scb-caret]:font-[inherit] [&_.scb-input]:font-[inherit] [&_.scb-root]:font-[inherit] [&_.scb-text]:font-[inherit]`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="max-w-[18ch] text-3xl tracking-tighter sm:text-4xl lg:text-5xl lg:leading-[1.15]">
            Ask anything. Get answers instantly.
          </h1>

          <p className="max-w-xl text-base leading-7 tracking-tight text-muted-foreground sm:text-lg sm:leading-8">
            Drop a question into the prompt and explore ideas with an AI
            assistant built for curious minds, without ever leaving the
            conversation.
          </p>

          <CtaButtons />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-4">
        <HeroV8Scene
          prompts={AI_ASSISTANT_PROMPTS}
          bgSrc={blockImage("image.png")}
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-6">
        <div className="w-full overflow-hidden rounded-lg text-center">
          <p className="m-0 bg-background px-3 py-3 text-center text-[0.625rem] font-medium tracking-[0.12em] text-foreground uppercase sm:px-4 sm:py-3.5 sm:text-2.75 sm:tracking-[0.14em]">
            {HERO_V8_TRUST_LABEL}
          </p>
          <HeroV8BrandCarousel />
        </div>
      </div>
    </section>
  )
}
