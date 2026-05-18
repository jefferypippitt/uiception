import { cn } from "@/lib/utils"

import MacbookScreen, {
  type MacbookScreenProps,
} from "./components/macbook-screen"

import "./styles/macbook-pro.css"

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
      className={cn("mbp-root mbp-shell mx-auto w-full min-w-0 max-w-4xl", className)}
      role="img"
      aria-label="MacBook Pro device frame mockup"
    >
      <div className="mbp-lid">
        <div className="mbp-lid-frame">
          <div className="mbp-bezel">
            <div className="mbp-notch" aria-hidden>
              <span className="mbp-camera" />
            </div>
            <MacbookScreen
              minHeight={minHeight}
              aspectRatio={aspectRatio}
            >
              {children}
            </MacbookScreen>
          </div>
        </div>
      </div>

      <div className="mbp-hinge" aria-hidden />

      <div className="mbp-base" aria-hidden>
        <div className="mbp-scoop" />
      </div>
    </div>
  )
}
