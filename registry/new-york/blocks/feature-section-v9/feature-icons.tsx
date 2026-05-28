"use client"

import {
  Handshake,
  MagnifyingGlass,
  PencilSimple,
  ShieldCheck,
  type IconProps,
} from "@phosphor-icons/react"
import type { ComponentType } from "react"

import type { FeatureIconId } from "./features"

const FEATURE_ICONS: Record<FeatureIconId, ComponentType<IconProps>> = {
  "magnifying-glass": MagnifyingGlass,
  pencil: PencilSimple,
  handshake: Handshake,
  shield: ShieldCheck,
}

export function FeatureIcon({
  icon,
  className,
}: {
  icon: FeatureIconId
  className?: string
}) {
  const Icon = FEATURE_ICONS[icon]

  return (
    <Icon
      aria-hidden
      className={className}
      weight="regular"
    />
  )
}
