"use client"

import { ParticleObject } from "@/components/canvasui/particle-object"

import { useCssColor } from "../hooks/use-css-color"

export function ParticlePanel({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  const color = useCssColor("--foreground")

  return (
    <ParticleObject
      className={className}
      src={src}
      color={color}
      orbit={false}
      scale={5.4}
      cameraDistance={4.2}
      yOffset={-0.3}
      floatIntensity={0}
      rotationIntensity={0}
    />
  )
}
