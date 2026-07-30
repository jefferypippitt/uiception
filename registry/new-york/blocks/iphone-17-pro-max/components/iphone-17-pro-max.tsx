import { cn } from "@/lib/utils"

import IphoneDynamicIsland from "./iphone-dynamic-island"
import IphoneScreen, { type IphoneScreenProps } from "./iphone-screen"
import IphoneStatusBar, {
  type IphoneStatusBarProps,
} from "./iphone-status-bar"

import "../styles/iphone-17-pro-max.css"

type Iphone17ProMaxProps = {
  className?: string
  statusBar?: Omit<IphoneStatusBarProps, "className">
} & Omit<IphoneScreenProps, "className">

export default function Iphone17ProMax({
  className,
  minHeight,
  aspectRatio = "1320 / 2740",
  statusBar,
  children,
}: Iphone17ProMaxProps) {
  return (
    <div
      className={cn(
        "ip17-root relative mx-auto w-full max-w-[18rem] min-w-0 drop-shadow-(--ip17-shell-shadow)",
        className
      )}
      role="img"
      aria-label="iPhone 17 Pro Max device frame mockup"
    >
      {/* Left side buttons: Action + Volume Up/Down */}
      <span
        className="ip17-button absolute top-[14%] -left-0.5 z-0 h-7 w-0.75 rounded-l-sm"
        aria-hidden
      />
      <span
        className="ip17-button absolute top-[22%] -left-0.5 z-0 h-11 w-0.75 rounded-l-sm"
        aria-hidden
      />
      <span
        className="ip17-button absolute top-[32%] -left-0.5 z-0 h-11 w-0.75 rounded-l-sm"
        aria-hidden
      />

      {/* Right side button: Power */}
      <span
        className="ip17-button absolute top-[26%] -right-0.5 z-0 h-16 w-0.75 rounded-r-sm"
        aria-hidden
      />

      {/*
        Media fills the shell first; silver rail + black lip are overlays on top.
        That way corners cannot show a light gap between content and frame.
      */}
      <div className="ip17-shell relative z-1 overflow-hidden rounded-[3rem]">
        <IphoneScreen minHeight={minHeight} aspectRatio={aspectRatio}>
          {children}
        </IphoneScreen>
        <div className="ip17-rail-overlay" aria-hidden />
        <div className="ip17-bezel-overlay" aria-hidden />
        <IphoneDynamicIsland />
        <IphoneStatusBar {...statusBar} />
      </div>
    </div>
  )
}
