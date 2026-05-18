"use client"

import {
  ArrowClockwise,
  ArrowLeft,
  ArrowRight,
  PuzzlePiece,
  Star,
} from "@phosphor-icons/react"
import { MoreVertical, Plus, X } from "lucide-react"

import { cn } from "@/lib/utils"

import BrowserViewport, {
  type BrowserViewportProps,
} from "./components/browser-viewport"
import GoogleGIcon from "./components/google-g-icon"
import OmniboxTypingText from "./components/omnibox-typing-text"
import ProfileAvatar from "./components/profile-avatar"
import WindowControls from "./components/window-controls"
import { useOmniboxTyping } from "./hooks/use-omnibox-typing"
import { chromeWindowsConfig } from "./lib/config"

import "./styles/google-chrome-windows.css"

const tabIconClass = "size-3.5 shrink-0 stroke-[2]"
const menuIconClass = "size-[18px] shrink-0 stroke-[1.75]"
const toolbarIconSize = 18

const toolbarIcon = {
  size: toolbarIconSize,
  weight: "regular" as const,
  className: "gcw-toolbar-glyph",
}

function ToolbarSeparator() {
  return <span className="gcw-toolbar-sep" aria-hidden />
}

type GoogleChromeWindowsProps = {
  className?: string
  /** Override typewriter phrases in the omnibox (e.g. your product name or demo URLs) */
  omniboxTypingPrompts?: readonly string[]
} & Omit<BrowserViewportProps, "className">

export default function GoogleChromeWindows({
  className,
  omniboxTypingPrompts = chromeWindowsConfig.omniboxTypingPrompts,
  minHeight,
  aspectRatio,
  src,
  alt,
  videoSrc,
  poster,
  autoPlay,
  children,
}: GoogleChromeWindowsProps) {
  const { displayText, showCursor, caretSolid, isActive } = useOmniboxTyping({
    prompts: omniboxTypingPrompts,
  })

  return (
    <div
      className={cn(
        "gcw-root gcw-shell mx-auto w-full min-w-0 max-w-6xl overflow-hidden rounded-sm",
        className,
      )}
      role="img"
      aria-label="Google Chrome on Windows browser window mockup"
    >
      <div className="gcw-titlebar">
        <div className="gcw-tabs">
          <div className="gcw-tab gcw-tab-active">
            <GoogleGIcon muted className="gcw-tab-favicon" />
            <span className="gcw-tab-title">{chromeWindowsConfig.tabTitle}</span>
            <button type="button" className="gcw-tab-close" tabIndex={-1} aria-hidden>
              <X className={tabIconClass} />
            </button>
          </div>
          <button type="button" className="gcw-new-tab" tabIndex={-1} aria-hidden>
            <Plus className={tabIconClass} />
          </button>
        </div>
        <WindowControls />
      </div>

      <div className="gcw-toolbar">
        <div className="gcw-nav">
          <button type="button" className="gcw-toolbar-btn" tabIndex={-1} aria-hidden>
            <ArrowLeft {...toolbarIcon} />
          </button>
          <button type="button" className="gcw-toolbar-btn" disabled tabIndex={-1} aria-hidden>
            <ArrowRight {...toolbarIcon} />
          </button>
          <button type="button" className="gcw-toolbar-btn" tabIndex={-1} aria-hidden>
            <ArrowClockwise {...toolbarIcon} />
          </button>
        </div>

        <div className={cn("gcw-omnibox", isActive && "gcw-omnibox--active")}>
          <GoogleGIcon />
          <OmniboxTypingText
            displayText={displayText}
            showCursor={showCursor}
            caretSolid={caretSolid}
          />
          <div className="gcw-omnibox-actions" aria-hidden>
            <button type="button" className="gcw-toolbar-btn gcw-omnibox-btn" tabIndex={-1}>
              <Star {...toolbarIcon} />
            </button>
          </div>
        </div>

        <div className="gcw-toolbar-actions">
          <button type="button" className="gcw-toolbar-btn" tabIndex={-1} aria-hidden>
            <PuzzlePiece {...toolbarIcon} />
          </button>
          <ToolbarSeparator />
          <ProfileAvatar />
          <button type="button" className="gcw-toolbar-btn" tabIndex={-1} aria-hidden>
            <MoreVertical className={menuIconClass} />
          </button>
        </div>
      </div>

      <BrowserViewport
        minHeight={minHeight}
        aspectRatio={aspectRatio}
        src={src}
        alt={alt}
        videoSrc={videoSrc}
        poster={poster}
        autoPlay={autoPlay}
      >
        {children}
      </BrowserViewport>
    </div>
  )
}
