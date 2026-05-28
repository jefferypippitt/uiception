"use client"

import { Warp } from "@paper-design/shaders-react"

import {
  FSV6_WARP,
  FSV6_WARP_COLORS,
  type FeatureShaderTheme,
} from "../lib/features"

type FeatureSectionV6MeshBgProps = FeatureShaderTheme

export function FeatureSectionV6MeshBg({
  offsetX,
  offsetY,
  frame,
}: FeatureSectionV6MeshBgProps) {
  return (
    <div className="fsv6-mesh-frame" aria-hidden>
      <Warp
        className="fsv6-mesh-canvas"
        colors={[...FSV6_WARP_COLORS]}
        distortion={FSV6_WARP.distortion}
        fit="cover"
        frame={frame}
        offsetX={offsetX}
        offsetY={offsetY}
        proportion={FSV6_WARP.proportion}
        rotation={FSV6_WARP.rotation}
        scale={FSV6_WARP.scale}
        shape={FSV6_WARP.shape}
        shapeScale={FSV6_WARP.shapeScale}
        softness={FSV6_WARP.softness}
        speed={FSV6_WARP.speed}
        swirl={FSV6_WARP.swirl}
        swirlIterations={FSV6_WARP.swirlIterations}
      />
    </div>
  )
}
