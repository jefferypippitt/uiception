import { cn } from "@/lib/utils"

type MacStudioDisplayStandProps = {
  className?: string
}

export default function MacStudioDisplayStand({
  className,
}: MacStudioDisplayStandProps) {
  const clipId = "msd-stand-clip"

  return (
    <div
      className={cn(
        "msd-stand relative z-0 -mt-px flex w-[24%] max-w-52 min-w-28 flex-col items-stretch",
        className
      )}
      aria-hidden
    >
      <svg className="absolute size-0 overflow-hidden" aria-hidden>
        <defs>
          <clipPath
            id={clipId}
            clipPathUnits="objectBoundingBox"
          >
            <path d="M 0 0 L 0.32 0 A 0.18 0.24 0 0 0 0.68 0 L 1 0 L 1 1 L 0 1 Z" />
          </clipPath>
        </defs>
      </svg>

      <div
        className="msd-stand-arm relative h-24 w-full"
        style={{ clipPath: `url(#${clipId})` }}
      >
        <span className="msd-stand-arm-bezel" aria-hidden />
      </div>

      <div className="msd-stand-foot relative h-3 w-full rounded-b-sm" />
    </div>
  )
}
