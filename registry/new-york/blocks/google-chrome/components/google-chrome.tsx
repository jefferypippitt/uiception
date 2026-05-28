"use client"

import { useCallback } from "react"

import {
  ArrowLeft,
  ArrowRight,
  MoreVertical,
  Plus,
  RotateCw,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"

import AppsIcon from "./apps-icon"
import BrowserViewport, { type BrowserViewportProps } from "./browser-viewport"
import ChromeViewportDefault from "./chrome-viewport-default"
import OmniboxTypingText from "./omnibox-typing-text"
import ProfileAvatar from "./profile-avatar"
import TrafficLights from "./traffic-lights"
import { useOmniboxTyping } from "../hooks/use-omnibox-typing"
import { useSimulatedPageLoad } from "../hooks/use-simulated-page-load"
import { chromeConfig } from "../lib/config"

import "../styles/google-chrome.css"

const navIconClass = "size-[18px] shrink-0 stroke-[1.75]"
const menuIconClass = "size-[18px] shrink-0 stroke-[1.75]"
const tabIconClass = "size-3.5 shrink-0 stroke-[2]"

type GoogleChromeProps = {
  className?: string
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
  const { phase, progress, startLoading } = useSimulatedPageLoad()

  const handleTypedComplete = useCallback(() => {
    startLoading()
  }, [startLoading])

  const { displayText, showCursor, caretSolid, isActive } = useOmniboxTyping({
    prompts: omniboxTypingPrompts,
    onTypedComplete: handleTypedComplete,
  })

  return (
    <div
      className={cn(
        "gc-root mx-auto w-full max-w-6xl min-w-0 overflow-hidden rounded-md border border-(--gc-border) bg-(--gc-shell-bg) font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,sans-serif] shadow-(--gc-shadow) outline -outline-offset-1 outline-(--gc-ring)",
        className
      )}
      role="img"
      aria-label="Google Chrome browser window mockup"
    >
      <div className="grid min-h-11 grid-cols-[auto_minmax(0,1fr)] items-end gap-2.5 bg-(--gc-tabstrip-bg) pt-1.5 pr-2 pl-3.5">
        <TrafficLights />
        <div className="flex min-w-0 flex-1 items-end gap-0.5">
          <div className="grid w-[clamp(9.5rem,32vw,11.75rem)] max-w-47 min-w-38 shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-1.5 rounded-t-lg bg-(--gc-tab-bg) px-1.5 py-2 pl-3 text-3.25 leading-[1.2] text-(--gc-tab-fg)">
            <span className="min-w-0 truncate">{chromeConfig.tabTitle}</span>
            <button
              type="button"
              className="mr-0.5 flex size-5 shrink-0 items-center justify-center self-center justify-self-end rounded-full border-none bg-transparent p-0 text-(--gc-tab-close) opacity-85 hover:opacity-100"
              tabIndex={-1}
              aria-hidden
            >
              <X className={tabIconClass} />
            </button>
          </div>
          <button
            type="button"
            className="mb-2 flex size-5 shrink-0 items-center justify-center border-none bg-transparent p-0 text-(--gc-new-tab-btn)"
            tabIndex={-1}
            aria-hidden
          >
            <Plus className={tabIconClass} />
          </button>
        </div>
      </div>

      <div className="box-border flex min-h-10.5 items-center gap-2 border-b border-(--gc-toolbar-border) bg-(--gc-toolbar-bg) px-3.5 py-1.5">
        <div className="flex shrink-0 items-center gap-px">
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border-none bg-transparent p-0 text-(--gc-nav-fg)"
            tabIndex={-1}
            aria-hidden
          >
            <ArrowLeft className={navIconClass} />
          </button>
          <button
            type="button"
            className="flex size-8 shrink-0 cursor-default items-center justify-center rounded-full border-none bg-transparent p-0 text-(--gc-nav-disabled) disabled:text-(--gc-nav-disabled)"
            disabled
            tabIndex={-1}
            aria-hidden
          >
            <ArrowRight className={navIconClass} />
          </button>
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border-none bg-transparent p-0 text-(--gc-nav-fg)"
            tabIndex={-1}
            aria-hidden
          >
            <RotateCw className={navIconClass} />
          </button>
        </div>
        <div
          className={cn(
            "box-border flex min-h-[calc(0.8125rem*1.2+0.5rem)] min-w-0 flex-1 items-center rounded-full border border-transparent bg-(--gc-omnibox-bg) px-4.5 py-1 transition-[box-shadow,border-color] duration-200 ease-out motion-reduce:transition-none",
            isActive &&
              "border-transparent shadow-[0_0_0_1px_var(--gc-omnibox-focus-ring)]"
          )}
        >
          <OmniboxTypingText
            displayText={displayText}
            showCursor={showCursor}
            caretSolid={caretSolid}
          />
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <ProfileAvatar />
          <button
            type="button"
            className="flex items-center justify-center border-none bg-transparent p-1 text-(--gc-menu-fg)"
            tabIndex={-1}
            aria-hidden
          >
            <MoreVertical className={menuIconClass} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-(--gc-toolbar-border) bg-(--gc-bookmarks-bg) px-3.5 py-1.5 text-3.25 text-(--gc-bookmarks-fg)">
        <AppsIcon />
        <span>{chromeConfig.bookmarksAppsLabel}</span>
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
        {children ?? (
          <ChromeViewportDefault phase={phase} progress={progress} />
        )}
      </BrowserViewport>
    </div>
  )
}
