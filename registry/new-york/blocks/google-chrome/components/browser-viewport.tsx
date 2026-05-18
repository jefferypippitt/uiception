import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

export type BrowserViewportProps = {
  className?: string
  /** Minimum height when the viewport is empty (default `32rem`) */
  minHeight?: string | number
  /** e.g. `"16 / 9"` — keeps the content area proportional when set */
  aspectRatio?: string
  /** Image URL — scaled to cover the viewport */
  src?: string
  alt?: string
  /** Video URL — scaled to cover the viewport (muted, looped, inline for demos) */
  videoSrc?: string
  poster?: string
  /** Autoplay video when `videoSrc` is set (default `true`) */
  autoPlay?: boolean
  children?: ReactNode
}

export default function BrowserViewport({
  className,
  minHeight = "32rem",
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

  const mediaClass = "gc-viewport-media"

  return (
    <div className={cn("gc-viewport", className)} style={style}>
      {children ? (
        <div className="gc-viewport-slot">{children}</div>
      ) : videoSrc ? (
        <video
          className={mediaClass}
          src={videoSrc}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay={autoPlay}
        />
      ) : src ? (
        // eslint-disable-next-line @next/next/no-img-element -- registry block; consumers may swap for next/image
        <img className={mediaClass} src={src} alt={alt} />
      ) : null}
    </div>
  )
}
