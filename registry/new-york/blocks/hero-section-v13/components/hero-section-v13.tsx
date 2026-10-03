import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { badge, cta, description, headline } from "../lib/config"

export default function HeroSectionV13() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge variant="secondary" className="text-sm">
            {badge}
          </Badge>

          <h1 className="text-3xl font-medium tracking-tighter sm:text-4xl lg:text-5xl lg:leading-[1.15]">
            {headline[0]}
            <br />
            {headline[1]}
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
            {description}
          </p>

          <Button asChild size="lg" className="rounded-full">
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
