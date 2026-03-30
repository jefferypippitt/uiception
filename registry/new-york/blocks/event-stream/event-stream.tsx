"use client"

import { useEventAnimation } from "./hooks/use-event-animation"
import TokenText from "./components/token-text"

import "./styles/event-stream.css"

export default function EventStream() {
  const { text, scrollRef } = useEventAnimation()

  return (
    <div className="es-root relative w-full overflow-hidden" style={{ height: "18rem" }}>
      <div
        ref={scrollRef}
        className="es-body flex h-full justify-center overflow-y-auto pb-16 pt-4"
        style={{ scrollbarWidth: "none" }}
      >
        <pre className="es-text m-0 w-fit whitespace-pre font-mono text-[13px] leading-relaxed">
          <TokenText text={text} />
          <span className="es-cursor" />
        </pre>
      </div>
    </div>
  )
}
