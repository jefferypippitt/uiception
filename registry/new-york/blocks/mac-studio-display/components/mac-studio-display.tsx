import { cn } from "@/lib/utils"

import MacStudioDisplayStand from "./mac-studio-display-stand"
import StudioDisplayScreen, {
  type StudioDisplayScreenProps,
} from "./studio-display-screen"

import "../styles/mac-studio-display.css"

type MacStudioDisplayProps = {
  className?: string
} & Omit<StudioDisplayScreenProps, "className">

export default function MacStudioDisplay({
  className,
  minHeight,
  aspectRatio = "16 / 9",
  children,
}: MacStudioDisplayProps) {
  return (
    <div
      className={cn(
        "msd-root mx-auto flex w-full max-w-3xl min-w-0 flex-col items-center drop-shadow-(--msd-shell-shadow)",
        className
      )}
      role="img"
      aria-label="Mac Studio Display device frame mockup"
    >
      <div className="relative z-1 w-full">
        <div className="msd-frame rounded-xl p-1 pb-0.5">
          <div className="relative overflow-hidden rounded-[0.625rem] bg-transparent">
            <span
              className="msd-camera absolute top-0.5 left-1/2 z-2 block size-1.5 -translate-x-1/2 rounded-full"
              aria-hidden
            />
            <StudioDisplayScreen minHeight={minHeight} aspectRatio={aspectRatio}>
              {children}
            </StudioDisplayScreen>
          </div>
        </div>
      </div>

      <MacStudioDisplayStand />
    </div>
  )
}
