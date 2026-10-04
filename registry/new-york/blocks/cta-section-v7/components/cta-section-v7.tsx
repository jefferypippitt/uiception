import Link from "next/link"

import { Button } from "@/components/ui/button"

import WindowsTerminal from "./windows-terminal"
import { ctaSectionV7Content } from "../lib/config"

export default function CtaSectionV7() {
  const { heading, description, primaryCta, secondaryCta } = ctaSectionV7Content

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <h2 className="text-3xl leading-[1.05] font-medium tracking-[-0.035em] text-balance text-foreground sm:text-4xl lg:text-5xl">
            {heading}
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
            {description}
          </p>
        </div>

        <WindowsTerminal className="mx-auto mt-10 max-w-2xl md:mt-12" />

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" variant="default" asChild className="rounded-full">
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild className="rounded-full">
            <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
