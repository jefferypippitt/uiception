import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const PRIMARY_HREF = "#"
const SECONDARY_HREF = "#"

export default function CtaButtons() {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-3">
      <Button
        size="lg"
        className="hero-v8-cta hero-v8-cta--primary group relative w-full text-[16px] sm:w-auto"
        asChild
      >
        <Link href={PRIMARY_HREF} className="inline-flex items-center gap-0">
          <span>Start chatting</span>
          <span className="hero-v8-cta__dots" aria-hidden="true">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </Link>
      </Button>

      <Button
        variant="secondary"
        size="lg"
        className="hero-v8-cta hero-v8-cta--secondary group relative w-full overflow-hidden text-[16px] sm:w-auto"
        asChild
      >
        <Link
          href={SECONDARY_HREF}
          className="relative inline-flex items-center gap-2"
        >
          <span className="hero-v8-cta__sweep" aria-hidden="true" />
          <span className="hero-v8-cta__secondary-text">Learn more</span>
          <span className="hero-v8-cta__arrow-stack" aria-hidden="true">
            <ChevronRight
              size={14}
              className="hero-v8-cta__arrow hero-v8-cta__arrow--trail-2"
            />
            <ChevronRight
              size={15}
              className="hero-v8-cta__arrow hero-v8-cta__arrow--trail-1"
            />
            <ChevronRight
              size={16}
              className="hero-v8-cta__arrow hero-v8-cta__arrow--lead"
            />
          </span>
        </Link>
      </Button>
    </div>
  )
}
