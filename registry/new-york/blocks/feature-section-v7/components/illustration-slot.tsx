import type { ReactNode, Ref } from "react"

import { cn } from "@/lib/utils"

export const illustrationSlotClassName =
  "mx-auto flex w-full min-h-0 aspect-[440/326] max-w-[22rem] sm:max-w-[25rem] lg:max-w-full"

type IllustrationSlotProps = {
  children: ReactNode
  className?: string
  ref?: Ref<HTMLDivElement>
}

export function IllustrationSlot({ children, className, ref }: IllustrationSlotProps) {
  return (
    <div ref={ref} className={cn(illustrationSlotClassName, className)}>
      {children}
    </div>
  )
}
