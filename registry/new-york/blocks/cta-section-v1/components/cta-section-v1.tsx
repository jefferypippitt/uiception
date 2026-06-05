import { GeistPixelCircle } from "geist/font/pixel"
import { ArrowUpRightIcon } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

const CTA_IMAGE = `https://uiception.com/images/blocks/cta-section-v1/image.png`

export default function CtaSectionV1() {
  return (
    <div className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="overflow-hidden px-6 pb-6 md:px-8 md:pb-8 lg:px-10 lg:pb-10">
          <div className="flex flex-col gap-6">

            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl">
                Get started in{" "}
                <span
                  className={`${GeistPixelCircle.className} text-4xl text-lime-400 sm:text-5xl lg:text-6xl`}
                >
                  minutes
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center">
              <p className="max-w-prose text-lg leading-8 font-light tracking-tight text-muted-foreground/90 sm:text-xl">
                Try out our playground, and start with our free tier to test
                models in your application.
              </p>
              <div className="flex flex-row flex-wrap gap-3 lg:justify-end">
                <Button
                  size="lg"
                  className="w-full rounded-none text-base font-light sm:w-auto"
                >
                  Get A Demo
                  <ArrowUpRightIcon data-icon="inline-end" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-none text-base font-light sm:w-auto"
                >
                  Sign Up For Free
                  <ArrowUpRightIcon data-icon="inline-end" />
                </Button>
              </div>
            </div>
          </div>

          <div className="relative mt-6 aspect-16/5 w-full overflow-hidden">
            <Image
              src={CTA_IMAGE}
              unoptimized
              alt=""
              aria-hidden
              fill
              loading="eager"
              sizes="(max-width: 1280px) 100vw, 1152px"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
