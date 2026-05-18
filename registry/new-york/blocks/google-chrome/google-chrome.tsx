"use client"

import {
  ArrowLeft,
  ArrowRight,
  MoreVertical,
  Plus,
  RotateCw,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"

import AppsIcon from "./components/apps-icon"
import BrowserViewport, {
  type BrowserViewportProps,
} from "./components/browser-viewport"
import OmniboxTypingText from "./components/omnibox-typing-text"
import ProfileAvatar from "./components/profile-avatar"
import TrafficLights from "./components/traffic-lights"
import { useOmniboxTyping } from "./hooks/use-omnibox-typing"
import { chromeConfig } from "./lib/config"

import "./styles/google-chrome.css"

const navIconClass = "size-[18px] shrink-0 stroke-[1.75]"
const menuIconClass = "size-[18px] shrink-0 stroke-[1.75]"
const tabIconClass = "size-3.5 shrink-0 stroke-[2]"

type GoogleChromeProps = {
  className?: string
  /** Override typewriter phrases in the omnibox (e.g. your product name or demo URLs) */
  omniboxTypingPrompts?: readonly string[]
} & Omit<BrowserViewportProps, "className">

export default function GoogleChrome({
  className,
  omniboxTypingPrompts = chromeConfig.omniboxTypingPrompts,
  minHeight,
  aspectRatio,
  src,
  alt,
  videoSrc,
  poster,
  autoPlay,
  children,
}: GoogleChromeProps) {
  const { displayText, showCursor, caretSolid, isActive } = useOmniboxTyping({
    prompts: omniboxTypingPrompts,
  })

  return (
    <div
      className={cn(
        "gc-root gc-shell mx-auto w-full min-w-0 max-w-6xl overflow-hidden rounded-md",
        className,
      )}
      role="img"
      aria-label="Google Chrome browser window mockup"
    >
      <div className="gc-tabstrip">
        <TrafficLights />
        <div className="gc-tabs">
          <div className="gc-tab gc-tab-active">
            <span className="gc-tab-title">{chromeConfig.tabTitle}</span>
            <button type="button" className="gc-tab-close" tabIndex={-1} aria-hidden>
              <X className={tabIconClass} />
            </button>
          </div>
          <button type="button" className="gc-new-tab" tabIndex={-1} aria-hidden>
            <Plus className={tabIconClass} />
          </button>
        </div>
      </div>

      <div className="gc-toolbar">
        <div className="gc-nav">
          <button type="button" className="gc-nav-btn" tabIndex={-1} aria-hidden>
            <ArrowLeft className={navIconClass} />
          </button>
          <button type="button" className="gc-nav-btn" disabled tabIndex={-1} aria-hidden>
            <ArrowRight className={navIconClass} />
          </button>
          <button type="button" className="gc-nav-btn" tabIndex={-1} aria-hidden>
            <RotateCw className={navIconClass} />
          </button>
        </div>
        <div className={cn("gc-omnibox", isActive && "gc-omnibox--active")}>
          <OmniboxTypingText
            displayText={displayText}
            showCursor={showCursor}
            caretSolid={caretSolid}
          />
        </div>
        <div className="gc-toolbar-actions">
          <ProfileAvatar />
          <button type="button" className="gc-menu-btn" tabIndex={-1} aria-hidden>
            <MoreVertical className={menuIconClass} />
          </button>
        </div>
      </div>

      <div className="gc-bookmarks">
        <AppsIcon />
        <span className="gc-bookmarks-label">{chromeConfig.bookmarksAppsLabel}</span>
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
