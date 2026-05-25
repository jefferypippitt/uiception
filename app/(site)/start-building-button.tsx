"use client"

import { useState } from "react"
import { Hammer } from "lucide-react"
import { Link } from "next-view-transitions"

import { Button } from "@/components/ui/button"

const LABEL = "Start Building"
const CHAR_DELAY_MS = 7
const TOTAL_MS = LABEL.length * CHAR_DELAY_MS

export function StartBuildingButton() {
  const [hovered, setHovered] = useState(false)

  return (
    <Button size="sm" className="relative overflow-hidden" asChild>
      <Link
        href="/blocks"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
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
              {char === " " ? " " : char}
            </span>
          ))}
        </span>

        <Hammer
          size={18}
          className="absolute inset-0 m-auto"
          style={{
            opacity: hovered ? 1 : 0,
            transition: hovered
              ? `opacity 0.15s ease ${TOTAL_MS}ms`
              : "opacity 0.1s ease 0ms",
            animation: hovered
              ? `hammer-nail 0.75s ease-in-out ${TOTAL_MS}ms infinite`
              : "none",
          }}
        />
      </Link>
    </Button>
  )
}
