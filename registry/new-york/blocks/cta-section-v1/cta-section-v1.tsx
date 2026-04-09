import { GeistPixelCircle } from "geist/font/pixel"
import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { blockImageUrl } from "@/lib/block-image-url"

export default function CtaSectionV1() {
  return (
    <section className="pt-16 md:pt-20 lg:pt-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="overflow-hidden px-6 pb-6 md:px-8 md:pb-8 lg:px-10 lg:pb-10">
          <div className="flex flex-col gap-6">
            {/* Title row */}
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl">
                Get started in{" "}
                <span className={`${GeistPixelCircle.className} text-4xl text-lime-400 sm:text-5xl lg:text-6xl`}>
                  minutes
                </span>
              </h2>
            </div>

            {/* Description + CTA row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center">
              <p className="max-w-prose text-lg font-light leading-8 tracking-tight text-muted-foreground/90 sm:text-xl">
                Try out our playground, and start with our free tier to test
                models in your application.
              </p>
              <div className="flex flex-row flex-wrap gap-3 lg:justify-end">
                <Button size="lg" className="w-full text-base font-light sm:w-auto rounded-none">
                  Get A Demo
                  <ArrowUpRightIcon data-icon="inline-end" />
                </Button>
                <Button size="lg" variant="outline" className="w-full text-base font-light sm:w-auto rounded-none">
                  Sign Up For Free
                  <ArrowUpRightIcon data-icon="inline-end" />
                </Button>
              </div>
            </div>
          </div>

          <div className="relative mt-6 aspect-16/5 w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blockImageUrl(
                "https://uiception.com/images/blocks/cta-section-v1/cta-section-v1.png",
                "/images/blocks/cta-section-v1/cta-section-v1.png",
              )}
              alt=""
              aria-hidden={true}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
