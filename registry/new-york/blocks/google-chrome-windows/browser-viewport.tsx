import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

import { chromeWindowsConfig } from "./config"
import GoogleHomePreview from "./google-home-preview"

export type BrowserViewportProps = {
  className?: string
  minHeight?: string | number
  aspectRatio?: string
  src?: string
  alt?: string
  videoSrc?: string
  poster?: string
  autoPlay?: boolean
  children?: ReactNode
}

export default function BrowserViewport({
  className,
  minHeight = chromeWindowsConfig.defaultViewportMinHeight,
  aspectRatio,
  src,
  alt = "",
  videoSrc,
  poster,
  autoPlay = true,
  children,
}: BrowserViewportProps) {
  const style = {
    ...(aspectRatio ? { aspectRatio } : {}),
    minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
  } satisfies CSSProperties

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-(--gcw-viewport-bg)",
        className
      )}
      style={style}
    >
      {children ? (
        <div className="gcw-viewport-slot absolute inset-0 flex size-full overflow-hidden">
          {children}
        </div>
      ) : videoSrc ? (
        <video
          className="absolute inset-0 block size-full border-none object-cover object-center"
          src={videoSrc}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay={autoPlay}
        />
      ) : src ? (
        // eslint-disable-next-line @next/next/no-img-element -- registry block; consumers may swap for next/image
        <img
          className="absolute inset-0 block size-full border-none object-cover object-center"
          src={src}
          alt={alt}
        />
      ) : (
        <GoogleHomePreview className="absolute inset-0" />
      )}
    </div>
  )
}
