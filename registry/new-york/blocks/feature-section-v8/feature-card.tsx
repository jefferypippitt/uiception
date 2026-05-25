import { cn } from "@/lib/utils"

import type { FeatureColumn } from "./config"
import { featurePreviewMinHeights } from "./config"
import FeaturePreviewSlot from "./feature-preview-slot"

export default function FeatureCard({
  column,
  index,
  className,
  live = false,
  subgrid = false,
}: {
  column: FeatureColumn
  index: number
  className?: string
  live?: boolean
  subgrid?: boolean
}) {
  const reversed = column.layout === "reversed"
  const previewSize = column.previewSize ?? "default"
  const previewMinHeight = featurePreviewMinHeights[previewSize]
  const swapAt = subgrid ? "md" : "lg"

  return (
    <li
      className={cn(
        "grid min-w-0 grid-rows-[auto_auto] border border-border",
        subgrid && "md:row-span-2 md:grid-rows-subgrid",
        index > 0 && "md:-ml-px",
        className
      )}
    >
      <div
        className={cn(
          "relative flex h-full min-h-0 flex-col border-border",
          previewMinHeight,
          reversed &&
            (swapAt === "md"
              ? "max-md:border-b md:row-start-2 md:border-t md:border-b-0"
              : "max-lg:border-b lg:row-start-2 lg:border-t lg:border-b-0"),
          !reversed && "border-b"
        )}
      >
        <FeaturePreviewSlot
          id={column.id}
          title={column.title}
          description={column.description}
          live={live}
          previewSize={previewSize}
        />
      </div>
      <div
        className={cn(
          "p-4 sm:p-5",
          reversed &&
            (swapAt === "md" ? "md:row-start-1" : "lg:row-start-1")
        )}
      >
        <h3 className="m-0 text-base font-medium tracking-[-0.02em] text-foreground sm:text-lg">
          {column.title}
        </h3>
        <p className="m-0 mt-2 text-[0.875rem] leading-[1.6] text-muted-foreground">
          {column.description}
        </p>
      </div>
    </li>
  )
}
