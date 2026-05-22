"use client"

import Link from "next/link"
import { useState } from "react"
import { CirclePlay } from "lucide-react"

import { Button } from "@/components/ui/button"

const PRIMARY_HREF = "#"
const SECONDARY_HREF = "#"

const LABEL = "How we work"
const CHAR_DELAY_MS = 7
const TOTAL_MS = LABEL.length * CHAR_DELAY_MS

export default function CtaButtons() {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="flex flex-row flex-wrap justify-center gap-3">

      <Button size="lg" className="group relative overflow-hidden" asChild>
        <Link href={PRIMARY_HREF}>

          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:translate-y-full">
            Book a free call
          </span>

          <span className="absolute inset-0 flex -translate-y-full items-center justify-center transition-transform duration-300 ease-in-out group-hover:translate-y-0">
            Book a free call
          </span>

          <span className="invisible">Book a free call</span>
        </Link>
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="relative overflow-hidden"
        asChild
      >
        <Link
          href={SECONDARY_HREF}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >

          <span className="flex items-center gap-2">
            <span className="flex">
              {LABEL.split("").map((char, i) => (
                <span
                  key={i}
                  className="inline-block transition-opacity duration-75"
                  style={{
                    opacity: hovered ? 0 : 1,
                    transitionDelay: hovered
                      ? `${(LABEL.length - 1 - i) * CHAR_DELAY_MS}ms`
                      : "0ms",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
            <CirclePlay
              size={16}
              className="shrink-0 transition-opacity duration-75"
              style={{ opacity: hovered ? 0 : 1 }}
            />
          </span>

          <CirclePlay
            size={18}
            className="absolute inset-0 m-auto transition-all duration-260"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered
                ? "translateX(0px) scale(1.4)"
                : "translateX(14px) scale(0.55)",
              transitionDelay: hovered ? `${TOTAL_MS}ms` : "0ms",
              transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          />
        </Link>
      </Button>
    </div>
  )
}
