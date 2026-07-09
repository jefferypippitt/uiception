import { cn } from "@/lib/utils"

const arm =
  "absolute size-3 border-primary/40 motion-safe:transition-colors duration-200"

export function FeatureCardCorners({ active }: { active?: boolean }) {
  return (
    <>
      <span
        className={cn(arm, "top-0 left-0 -translate-x-px -translate-y-px border-t-[1.5px] border-l-[1.5px]", active && "border-primary")}
        aria-hidden
      />
      <span
        className={cn(arm, "top-0 right-0 translate-x-px -translate-y-px border-t-[1.5px] border-r-[1.5px]", active && "border-primary")}
        aria-hidden
      />
      <span
        className={cn(arm, "bottom-0 left-0 -translate-x-px translate-y-px border-b-[1.5px] border-l-[1.5px]", active && "border-primary")}
        aria-hidden
      />
      <span
        className={cn(arm, "right-0 bottom-0 translate-x-px translate-y-px border-r-[1.5px] border-b-[1.5px]", active && "border-primary")}
        aria-hidden
      />
    </>
  )
}
