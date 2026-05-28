import Link from "next/link"

import { Button } from "@/components/ui/button"

import type { HeroV9Cta } from "../lib/config"
import { heroV9Content } from "../lib/config"

const PRIMARY_HREF = "#"
const SECONDARY_HREF = "#"

export default function CtaButtons({
  primaryCta = heroV9Content.primaryCta,
  secondaryCta = heroV9Content.secondaryCta,
}: {
  primaryCta?: HeroV9Cta
  secondaryCta?: HeroV9Cta
}) {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-3">
      <Button className="w-full sm:w-auto" asChild>
        <Link href={PRIMARY_HREF}>{primaryCta.label}</Link>
      </Button>
      <Button
        variant="secondary"
        className="w-full sm:w-auto"
        asChild
      >
        <Link href={SECONDARY_HREF}>{secondaryCta.label}</Link>
      </Button>
    </div>
  )
}
