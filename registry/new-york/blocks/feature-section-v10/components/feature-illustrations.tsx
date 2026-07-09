"use client"

import type { FeatureIconId } from "../lib/features"
import GeoWireframe from "./geo-wireframe"

type IllustrationProps = {
  active?: boolean
  className?: string
}

function createIllustration(icon: FeatureIconId) {
  return function FeatureGeoIllustration({ active, className }: IllustrationProps) {
    return <GeoWireframe icon={icon} active={active} className={className} />
  }
}

export const FlowIllustration = createIllustration("flow")
export const BranchIllustration = createIllustration("branch")
export const SignalIllustration = createIllustration("signal")
export const SecureIllustration = createIllustration("secure")

export type { IllustrationProps }
