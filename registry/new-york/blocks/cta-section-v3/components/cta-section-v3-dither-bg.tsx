"use client"

import { Dithering } from "@paper-design/shaders-react"

export function CtaSectionV3DitherBg() {
  return (
    <div className="cta-v3-dither-frame" aria-hidden>
      <Dithering
        className="absolute inset-0 size-full min-h-full"
        colorBack="#000000"
        colorFront="#ffffff"
        fit="cover"
        height={720}
        offsetX={-0.08}
        offsetY={-0.6}
        shape="warp"
        size={2}
        speed={0.1}
        type="2x2"
        width={1280}
      />
    </div>
  )
}
