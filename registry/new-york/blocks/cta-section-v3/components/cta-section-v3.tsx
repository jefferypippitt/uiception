import { Button } from "@/components/ui/button"

import { CtaSectionV3DitherBg } from "./cta-section-v3-dither-bg"

import "../styles/cta-section-v3.css"

export default function CtaSectionV3() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-none border border-border bg-black motion-reduce:bg-[color-mix(in_oklab,var(--muted)_78%,var(--background)_22%)]">
          <CtaSectionV3DitherBg />
          <div className="relative z-10 flex max-w-2xl flex-col items-start gap-5 px-6 py-8 text-left sm:gap-6 md:px-10 md:py-10 lg:px-12 lg:py-12">
            <h2 className="text-3xl font-normal tracking-tighter text-white motion-reduce:text-foreground sm:text-4xl">
              Ship agents from real code, not prototypes.
            </h2>
            <p className="max-w-md text-lg leading-relaxed font-normal text-zinc-300 motion-reduce:text-muted-foreground">
              Install in one sitting. Keep the same APIs when you push to
              production.
            </p>
            <div className="flex flex-row flex-wrap gap-3">
              <Button size="lg">Start Free</Button>
              <Button size="lg" variant="secondary">
                Read The Docs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
