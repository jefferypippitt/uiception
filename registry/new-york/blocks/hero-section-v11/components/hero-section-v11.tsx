import Image from "next/image"
import Link from "next/link"

import { Displacement } from "@/components/canvasui/displacement"
import { Button } from "@/components/ui/button"
import { createBlockImage } from "@/lib/block-media"

const blockImage = createBlockImage("hero-section-v11")
const HERO_IMAGE = blockImage("image.jpg")

const NAV_LINKS = [
  { label: "Discover", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Log In", href: "#" },
] as const

export default function HeroSectionV11() {
  return (
    <section className="bg-background text-foreground">
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col px-6 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-10">
          <nav className="flex items-center justify-between gap-4">
            <Link
              href="#"
              className="text-base font-semibold tracking-tight text-foreground"
            >
              ACME
            </Link>
            <div className="flex items-center gap-5 sm:gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-base text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex flex-1 flex-col justify-center py-12 lg:py-16">
            <div className="max-w-lg">
              <h1 className="text-4xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                Your next escape, fully mapped.
              </h1>
              <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
                Pick a destination and a window. ACME builds the itinerary,
                secures lodging, and tucks every confirmation into a single trip
                hub.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button variant="default">Start Planning</Button>
                <Button variant="outline">See A Sample Trip</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-[50svh] w-full lg:min-h-svh">
          <Displacement
            className="absolute inset-0 size-full overflow-hidden"
            grid={40}
            cellAspect={1}
            radius={0.12}
            strength={0.12}
            threshold={400}
            scramble={0}
          >
            {/* Relative shell so next/image fill resolves inside html-in-canvas capture. */}
            <div className="relative size-full min-h-[50svh] lg:min-h-svh">
              <Image
                src={HERO_IMAGE}
                unoptimized
                alt="Scenic destination fully mapped for your next escape"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                preload={true}
              />
            </div>
          </Displacement>
        </div>
      </div>
    </section>
  )
}
