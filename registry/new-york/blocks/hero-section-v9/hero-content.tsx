import CtaButtons from "./cta-buttons"
import ProductPreviewShell from "./product-preview-shell"

import type { HeroV9Props } from "./config"
import { resolveHeroV9Content, resolveHeroV9Preview } from "./config"

export default function HeroContent(props: HeroV9Props) {
  const content = resolveHeroV9Content(props)
  const preview = resolveHeroV9Preview(props.preview)

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="max-w-3xl text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.15]">
        {content.title}
      </h1>

      <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        {content.description}
      </p>

      <CtaButtons
        primaryCta={content.primaryCta}
        secondaryCta={content.secondaryCta}
      />

      <div className="w-full pt-2">
        <ProductPreviewShell preview={preview} />
      </div>
    </div>
  )
}
