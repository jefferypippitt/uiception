"use client"

import {
  Code,
  Compass,
  Folders,
  Package,
  TerminalWindow,
  Wrench,
  type IconProps,
} from "@phosphor-icons/react"
import type { ComponentType } from "react"

import type { FeatureIconId } from "../lib/features"

const FEATURE_ICONS: Record<FeatureIconId, ComponentType<IconProps>> = {
  code: Code,
  terminal: TerminalWindow,
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

  return <Icon aria-hidden className={className} weight="regular" />
}
