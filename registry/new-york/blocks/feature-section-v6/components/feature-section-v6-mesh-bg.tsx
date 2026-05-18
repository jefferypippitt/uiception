"use client"

import { MeshGradient } from "@paper-design/shaders-react"

import {
  FSV6_MESH_COLORS,
  FSV6_MESH_SPEED,
  type FeatureShaderTheme,
} from "../lib/features"

type FeatureSectionV6MeshBgProps = FeatureShaderTheme

export function FeatureSectionV6MeshBg({
  swirl,
  rotation,
  distortion,
  scale,
  offsetX,
  offsetY,
  frame,
}: FeatureSectionV6MeshBgProps) {
  return (
    <div className="fsv6-mesh-frame" aria-hidden>
      <MeshGradient
        className="fsv6-mesh-canvas"
        colors={[...FSV6_MESH_COLORS]}
        distortion={distortion}
        fit="cover"
        frame={frame}
        grainMixer={0}
        grainOverlay={0}
        offsetX={offsetX}
        offsetY={offsetY}
        rotation={rotation}
        scale={scale}
        speed={FSV6_MESH_SPEED}
        swirl={swirl}
      />
    </div>
  )
}
