"use client"

import {
  Code,
  Compass,
  Folders,
  Package,
  SquareTerminal,
  Wrench,
  type LucideIcon,
} from "lucide-react"

import type { FeatureIconId } from "../lib/features"

const FEATURE_ICONS: Record<FeatureIconId, LucideIcon> = {
  code: Code,
  terminal: SquareTerminal,
  folders: Folders,
  wrench: Wrench,
  package: Package,
  compass: Compass,
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
