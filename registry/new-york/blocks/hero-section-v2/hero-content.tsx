"use client"

import { useHeroAnimation } from "./use-hero-animation"
import EventStream from "../event-stream/event-stream"
import BrandsSectionV2 from "../brands-section-v2/brands-section-v2"

const WORD_INITIAL: React.CSSProperties = {
  opacity: 0,
  transform: "translateY(24px)",
  display: "inline-block",
}

function Word({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <span
      style={WORD_INITIAL}
      className={`word${className ? ` ${className}` : ""}`}
    >
      {children}
    </span>
  )
}

export default function HeroContent() {
  const { titleRef, descRef, streamRef, brandsRef } = useHeroAnimation()

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="flex flex-col gap-6">
          <h1
            ref={titleRef}
            className="text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl"
          >
            <Word>Every</Word> <Word>event,</Word>{" "}
            <Word className="font-normal italic">delivered</Word>{" "}
            <Word className="font-normal italic">instantly</Word>
          </h1>
          <p
            ref={descRef}
            style={{ opacity: 0 }}
            className="text-lg leading-relaxed font-light"
          >
            Connect your services with a reliable event pipeline. Orders,
            payments, and shipments stream in real time, exactly when you need
            them.
          </p>

        </div>

        <div ref={streamRef} style={{ opacity: 0 }}>
          <EventStream />
        </div>
      </div>

      <section ref={brandsRef} style={{ opacity: 0 }}>
        <BrandsSectionV2 />
      </section>
    </>
  )
}
