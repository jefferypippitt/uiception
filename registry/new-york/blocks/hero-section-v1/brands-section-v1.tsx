"use client"

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

import "./brands-section-v1.css"

const brands = [
  { name: "Nvidia", fileBase: "Nvidia" },
  { name: "OpenAI", fileBase: "OpenAI" },
  { name: "Grok", fileBase: "Grok" },
  { name: "Perplexity AI", fileBase: "PerplexityAI" },
  { name: "Claude AI", fileBase: "ClaudeAI" },
  { name: "Gemini", fileBase: "Gemini" },
]

function BrandLogo({ brand }: { brand: (typeof brands)[number] }) {
  return (
    <span className="inline-flex">
      <Image
        src={`/svg/${brand.fileBase}_light.svg`}
        alt={brand.name}
        className="bs1-logo-img block h-8 w-auto max-w-[9.5rem] dark:hidden md:h-9 md:max-w-[11rem]"
        width={160}
        height={36}
        loading="eager"
        sizes="(max-width: 768px) 140px, 176px"
      />
      <Image
        src={`/svg/${brand.fileBase}_dark.svg`}
        alt={brand.name}
        className="bs1-logo-img hidden h-8 w-auto max-w-[9.5rem] dark:block md:h-9 md:max-w-[11rem]"
        width={160}
        height={36}
        loading="eager"
        sizes="(max-width: 768px) 140px, 176px"
      />
    </span>
  )
}

export default function BrandsSectionV1() {
  const setRef = useRef<HTMLDivElement>(null)
  const [shiftPx, setShiftPx] = useState<number | null>(null)

  useLayoutEffect(() => {
    const el = setRef.current
    if (!el) return

    let raf = 0

    const measure = () => {
      // offsetWidth matches layout box; duplicate .bs1-set should match this width exactly
      const w = el.offsetWidth
      if (w <= 0) return
      setShiftPx((prev) => (prev === w ? prev : w))
    }

    const scheduleMeasure = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }

    scheduleMeasure()

    const ro = new ResizeObserver(() => {
      scheduleMeasure()
    })
    ro.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:gap-10 lg:gap-14">
          <p className="max-w-[16rem] text-base font-medium leading-snug text-muted-foreground md:text-lg">
            Trusted by the best leading brands:
          </p>

          <div className="bs1-marquee-wrap min-w-0">
            <div className="bs1-fade bs1-fade-left" aria-hidden />
            <div className="bs1-fade bs1-fade-right" aria-hidden />

            <div
              className={cn("bs1-track", shiftPx != null && shiftPx > 0 && "bs1-track--run")}
              style={
                shiftPx != null && shiftPx > 0
                  ? ({ "--bs1-shift": `${shiftPx}px` } as CSSProperties)
                  : undefined
              }
            >
              <div ref={setRef} className="bs1-set" role="list" aria-label="Brand logos">
                {brands.map((brand) => (
                  <div key={brand.fileBase} role="listitem" className="bs1-slot flex shrink-0 items-center justify-center">
                    <BrandLogo brand={brand} />
                  </div>
                ))}
              </div>
              <div className="bs1-set" aria-hidden>
                {brands.map((brand) => (
                  <div key={`dup-${brand.fileBase}`} className="bs1-slot flex shrink-0 items-center justify-center">
                    <BrandLogo brand={brand} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
