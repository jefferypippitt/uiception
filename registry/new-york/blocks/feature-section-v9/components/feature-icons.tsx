"use client"

import {
  Handshake,
  Pencil,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"

import type { FeatureIconId } from "../lib/features"

const FEATURE_ICONS: Record<FeatureIconId, LucideIcon> = {
  "magnifying-glass": Search,
  pencil: Pencil,
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

  return <Icon aria-hidden className={className} />
}
