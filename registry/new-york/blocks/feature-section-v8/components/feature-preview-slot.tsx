"use client"

import { cn } from "@/lib/utils"

import { buildFeaturePreview } from "../lib/build-feature-preview"
import ProductPreviewFeature from "./product-preview-feature"
import { featurePreviewMinHeights, type FeaturePreviewSize } from "../lib/config"

import "../styles/feature-section-v8.css"

export default function FeaturePreviewSlot({
  id,
  title,
  description,
  live = false,
  previewSize = "default",
  className,
}: {
  id: string
  title: string
  description: string
  live?: boolean
  previewSize?: FeaturePreviewSize
  className?: string
}) {
  const spec = buildFeaturePreview({ id, title, description, size: "mini" })

  return (
    <div
      className={cn(
        "fsv8-dot-pattern relative h-full min-h-0 overflow-hidden",
        featurePreviewMinHeights[previewSize],
        className
      )}
    >
      <div className="absolute inset-0 flex min-w-0 items-stretch p-4 sm:p-5">
        <ProductPreviewFeature
          className="min-h-0 min-w-0 flex-1"
          spec={spec}
          title={title}
          description={description}
          instanceId={id}
          live={live}
        />
      </div>
    </div>
  )
}
