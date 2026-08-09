import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { RetroDither } from "@/components/canvasui/retro-dither"
import { Button } from "@/components/ui/button"

const HREF = "#"

export default function CtaSectionV6() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <RetroDither className="border-border overflow-hidden rounded-2xl border">
          <div className="bg-background flex flex-col items-center justify-center gap-6 px-6 py-16 text-center md:py-20 lg:py-24">
            <h2 className="max-w-2xl text-4xl tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Ready when you are
            </h2>
            <p className="text-muted-foreground max-w-md text-base sm:text-lg">
              Spin up a free workspace, import your first project, and ship
              something real before the week ends.
            </p>
            <Button size="lg" className="rounded-full px-6 text-base" asChild>
              <Link href={HREF}>
                Open a free workspace
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </RetroDither>
      </div>
    </section>
  )
}
