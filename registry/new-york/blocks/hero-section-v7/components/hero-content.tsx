import type { HeroV7Props } from "../lib/config"
import { resolveHeroV7Content } from "../lib/config"
import BrandsSectionV6 from "./brands-section-v6"
import CtaButtons from "./cta-buttons"
import PipelineDemo from "./pipeline-demo"

export default function HeroContent(props: HeroV7Props) {
  const content = resolveHeroV7Content(props)

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="max-w-3xl font-serif text-3xl tracking-tighter sm:text-4xl lg:text-5xl lg:leading-[1.15]">
        {content.title}
      </h1>

      <p className="max-w-lg font-mono text-base leading-7 tracking-tight text-muted-foreground sm:text-lg sm:leading-8">
        {content.description}
      </p>

      <CtaButtons
        primaryCta={content.primaryCta}
        secondaryCta={content.secondaryCta}
      />

      <PipelineDemo />

      <BrandsSectionV6 />
    </div>
  )
}
