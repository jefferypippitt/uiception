"use client"

import { cn } from "@/lib/utils"

import { useEventAnimation } from "./use-event-animation"
import TokenText from "./token-text"

import "./event-stream.css"

export default function EventStream({ className }: { className?: string }) {
  const { text, scrollRef } = useEventAnimation()

  return (
    <div
      className={cn(
        "es-root relative mx-auto w-full max-w-3xl min-w-0 overflow-hidden",
        className
      )}
      style={{ height: "18rem" }}
    >
      <div
        ref={scrollRef}
        className="flex h-full justify-center overflow-y-auto pt-4 pb-16 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <pre className="m-0 w-fit font-mono text-[11px] leading-[1.45] whitespace-pre text-muted-foreground">
          <TokenText text={text} />
          <span className="es-cursor ml-px inline-block h-[1em] w-1.5 bg-muted-foreground align-bottom" />
        </pre>
      </div>
    </div>
  )
}
