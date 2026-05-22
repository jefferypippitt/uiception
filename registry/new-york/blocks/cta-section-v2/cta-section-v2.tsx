import { ArrowDownToLine } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function CtaSectionV2() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-5xl tracking-tight sm:text-6xl lg:text-7xl">
            Try uiception now.
          </h2>
          <Button
            variant="default"
            size="lg"
            className="h-12 rounded-full px-6 text-base"
          >
            Download for Windows
            <ArrowDownToLine className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
