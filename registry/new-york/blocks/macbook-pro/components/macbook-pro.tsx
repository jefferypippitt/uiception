import { cn } from "@/lib/utils"

import MacbookScreen, { type MacbookScreenProps } from "./macbook-screen"

import "../styles/macbook-pro.css"

type MacbookProProps = {
  className?: string
} & Omit<MacbookScreenProps, "className">

export default function MacbookPro({
  className,
  minHeight,
  aspectRatio = "16 / 10",
  children,
}: MacbookProProps) {
  return (
    <div
      className={cn(
        "mbp-root mx-auto flex w-full max-w-4xl min-w-0 flex-col items-center drop-shadow-(--mbp-shell-shadow)",
        className
      )}
      role="img"
      aria-label="MacBook Pro device frame mockup"
    >
      <div className="relative z-1 w-full">
        <div className="mbp-lid-frame rounded-t-xl p-1.5">
          <div className="relative overflow-hidden rounded-t-lg bg-transparent">
            <div
              className="absolute top-0 left-1/2 z-2 flex h-5 w-[13%] max-w-30 min-w-18 -translate-x-1/2 items-end justify-center rounded-b-lg bg-(--mbp-notch) pb-0.5"
              aria-hidden
            >
              <span className="mbp-camera relative block size-1.75 shrink-0 rounded-full" />
            </div>
            <MacbookScreen minHeight={minHeight} aspectRatio={aspectRatio}>
              {children}
            </MacbookScreen>
          </div>
        </div>
      </div>

      <div className="mbp-hinge -my-px h-0.5 w-full shrink-0" aria-hidden />

      <div
        className="mbp-base relative z-0 h-8 w-[104%] rounded-b-[0.875rem]"
        aria-hidden
      >
        <div className="mbp-scoop absolute top-1 left-[calc(50%+4px)] z-0 h-2 w-[28%] max-w-40 min-w-20 -translate-x-1/2 -translate-y-1/2 rounded-b-lg" />
      </div>
    </div>
  )
}
