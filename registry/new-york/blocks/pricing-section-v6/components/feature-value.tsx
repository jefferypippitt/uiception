import { CheckIcon, XIcon } from "lucide-react"

import type { FeatureValue as FeatureValueType } from "../lib/pricing-plans"

type FeatureValueProps = {
  value: FeatureValueType
}

export default function FeatureValue({ value }: FeatureValueProps) {
  if (typeof value === "string") {
    return (
      <span className="text-xs font-medium text-foreground sm:text-sm">
        {value}
      </span>
    )
  }

  if (value) {
    return (
      <span className="inline-flex size-4 items-center justify-center rounded-full border border-emerald-600/50 text-emerald-600 dark:border-emerald-400/50 dark:text-emerald-400">
        <CheckIcon aria-hidden className="size-2.5" strokeWidth={3} />
        <span className="sr-only">Included</span>
      </span>
    )
  }

  return (
    <span className="inline-flex size-4 items-center justify-center rounded-full border border-red-500/50 text-red-500 dark:border-red-400/50 dark:text-red-400">
      <XIcon aria-hidden className="size-2.5" strokeWidth={3} />
      <span className="sr-only">Not included</span>
    </span>
  )
}
