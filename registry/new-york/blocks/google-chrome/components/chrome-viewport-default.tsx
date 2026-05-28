import GoogleHomePreview from "./google-home-preview"
import PageLoadingBar from "./page-loading-bar"
import type { PageLoadPhase } from "../hooks/use-simulated-page-load"

type ChromeViewportDefaultProps = {
  progress: number
  phase: PageLoadPhase
}

export default function ChromeViewportDefault({
  progress,
  phase,
}: ChromeViewportDefaultProps) {
  return (
    <div className="relative size-full">
      <PageLoadingBar progress={progress} visible={phase === "loading"} />
      <GoogleHomePreview className="absolute inset-0" />
    </div>
  )
}
