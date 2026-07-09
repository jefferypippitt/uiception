"use client"

import { cn } from "@/lib/utils"

import type { FeatureIconId } from "../lib/features"
import GeoWireframe from "./geo-wireframe"

export default function FeaturePanel({
  activeIcon,
  className,
}: {
  activeIcon: FeatureIconId
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative h-80 w-full min-w-0 overflow-hidden rounded-lg sm:h-96 lg:h-full",
        className
      )}
      aria-live="polite"
    >
      <GeoWireframe icon={activeIcon} active className="size-full min-h-full" />
    </div>
  )
}
