import { ChevronRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

const HREF = "#"

export default function CtaSectionV5() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="bg-muted rounded-2xl px-6 py-16 flex flex-col items-center gap-6 text-center md:py-20 lg:py-24">
          <h2 className="text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            Let&apos;s talk
          </h2>
          <p className="max-w-sm text-base text-muted-foreground sm:text-lg">
            Book a free meeting and we will show how we can simplify your life
          </p>
          <Button size="lg" className="rounded-full px-6 text-base" asChild>
            <Link href={HREF}>
              Book a meeting
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
