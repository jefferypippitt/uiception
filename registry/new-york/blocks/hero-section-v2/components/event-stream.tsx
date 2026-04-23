"use client"

import { cn } from "@/lib/utils"

import { useEventAnimation } from "../hooks/use-event-animation"
import TokenText from "./token-text"

import "../styles/event-stream.css"

export default function EventStream({ className }: { className?: string }) {
  const { text, scrollRef } = useEventAnimation()

  return (
    <div
      className={cn("es-root relative mx-auto w-full min-w-0 max-w-3xl overflow-hidden", className)}
      style={{ height: "22rem" }}
    >
      <div
        ref={scrollRef}
        className="es-body flex h-full justify-center overflow-y-auto pb-24 pt-4"
        style={{ scrollbarWidth: "none" }}
      >
        <pre className="es-text m-0 w-fit whitespace-pre font-mono text-[12px] leading-relaxed">
          <TokenText text={text} />
          <span className="es-cursor" />
        </pre>
      </div>
    </div>
  )
}
