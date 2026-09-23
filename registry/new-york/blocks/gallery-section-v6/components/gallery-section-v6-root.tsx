"use client"

import Image from "next/image"
import Link from "next/link"

import { usePhotoCarousel } from "../hooks/use-photo-carousel"
import type { GalleryItem } from "../lib/config"

type GallerySectionV6RootProps = {
  items: GalleryItem[]
}

export function GallerySectionV6Root({ items }: GallerySectionV6RootProps) {
  const { stageRef, activeIndex, filterId, goTo, onCardClick } =
    usePhotoCarousel(items.length)

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Gallery"
      className="relative overflow-hidden"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault()
          goTo(activeIndex + 1)
        } else if (event.key === "ArrowLeft") {
          event.preventDefault()
          goTo(activeIndex - 1)
        }
      }}
    >
      <div
        ref={stageRef}
        className="relative h-[26rem] cursor-grab touch-none select-none overflow-hidden data-[dragging=true]:cursor-grabbing sm:h-[32rem] lg:h-[36rem]"
      >
        <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
          <filter
            id={filterId}
            x="-40%"
            y="0%"
            width="180%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="0 0"
              edgeMode="duplicate"
            />
          </filter>
        </svg>

        {items.map((item, index) => (
          <article
            key={item.id}
            data-gsv6-card
            data-index={index}
            className="absolute left-1/2 top-1/2 overflow-hidden bg-muted opacity-0 will-change-transform @container"
          >
            <div data-gsv6-photo className="absolute inset-0">
              <Image
                src={item.imageSrc}
                alt={item.alt}
                fill
                unoptimized
                draggable={false}
                priority={index === 0 || index === items.length - 1}
                sizes="(max-width: 768px) 70vw, 365px"
                className="object-cover"
              />
            </div>
            <div
              data-gsv6-scrim
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.28)_38%,transparent_68%)] opacity-0"
            />
            <div
              data-gsv6-caption
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end gap-[6cqi] p-[8.8cqi] text-center opacity-0"
            >
              <h2 className="text-[7.7cqi] font-semibold leading-[1.15] tracking-[-0.02em] text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.35)]">
                {item.title}
              </h2>
              <p className="max-w-[86%] text-[3.6cqi] leading-[1.4] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.35)]">
                {item.description}
              </p>
              <Link
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                data-gsv6-cta
                tabIndex={activeIndex === index ? 0 : -1}
                className="pointer-events-auto inline-flex items-center justify-center rounded-full bg-white px-[8.2cqi] py-[3.3cqi] text-[3.6cqi] font-medium text-black shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
              >
                {item.cta}
              </Link>
            </div>
            <button
              type="button"
              data-gsv6-hit
              aria-label={`Show ${item.title}`}
              aria-current={activeIndex === index ? "true" : undefined}
              tabIndex={activeIndex === index ? -1 : 0}
              className="absolute inset-0"
              onClick={() => onCardClick(index)}
            />
          </article>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-[90] flex items-center justify-center gap-2">
        {items.map((item, index) => {
          const selected = activeIndex === index
          return (
            <button
              key={item.id}
              type="button"
              data-gsv6-dot
              aria-label={`Go to slide ${index + 1}`}
              aria-current={selected ? "true" : undefined}
              className={`pointer-events-auto h-[7px] rounded-full bg-foreground transition-[width,opacity] duration-1000 ease-in-out ${
                selected ? "w-[18px] opacity-100" : "w-[7px] opacity-[0.28]"
              }`}
              onClick={() => goTo(index)}
            />
          )
        })}
      </div>
    </section>
  )
}
