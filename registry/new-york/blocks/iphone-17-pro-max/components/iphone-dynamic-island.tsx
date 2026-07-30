import { cn } from "@/lib/utils"

type IphoneDynamicIslandProps = {
  className?: string
}

export default function IphoneDynamicIsland({
  className,
}: IphoneDynamicIslandProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute top-7 left-[51%] z-6 flex h-5 w-[27%] max-w-24 min-w-19 -translate-x-1/2 -translate-y-1/2 items-center justify-end rounded-full bg-(--ip17-island) pr-1.5",
        className
      )}
      aria-hidden
    >
      <span className="ip17-camera relative block size-2 shrink-0 rounded-full" />
    </div>
  )
}
