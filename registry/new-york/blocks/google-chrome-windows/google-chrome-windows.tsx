"use client"

import { useCallback } from "react"

import {
  ArrowClockwise,
  ArrowLeft,
  ArrowRight,
  PuzzlePiece,
  Star,
} from "@phosphor-icons/react"
import { MoreVertical, Plus, X } from "lucide-react"

import { cn } from "@/lib/utils"

import BrowserViewport, { type BrowserViewportProps } from "./browser-viewport"
import ChromeViewportDefault from "./chrome-viewport-default"
import GoogleGIcon from "./google-g-icon"
import OmniboxTypingText from "./omnibox-typing-text"
import ProfileAvatar from "./profile-avatar"
import WindowControls from "./window-controls"
import { useOmniboxTyping } from "./use-omnibox-typing"
import { useSimulatedPageLoad } from "./use-simulated-page-load"
import { chromeWindowsConfig } from "./config"

import "./google-chrome-windows.css"

const tabIconClass = "size-3.5 shrink-0 stroke-[2]"
const menuIconClass = "size-[18px] shrink-0 stroke-[1.75]"
const toolbarIconSize = 18

const toolbarIcon = {
  size: toolbarIconSize,
  weight: "regular" as const,
  className: "shrink-0",
}

function ToolbarSeparator() {
  return (
    <span
      className="mx-1.5 h-4.5 w-px shrink-0 self-center bg-(--gcw-toolbar-sep)"
      aria-hidden
    />
  )
}

type GoogleChromeWindowsProps = {
  className?: string
  omniboxTypingPrompts?: readonly string[]
  /** When false, omnibox stops after typing the first prompt once. */
  omniboxTypingLoop?: boolean
  /** Fired when omnibox typing completes (entering hold). */
  onOmniboxTypedComplete?: () => void
  /** Fired when omnibox text is cleared (entering between). */
  onOmniboxTypedCleared?: () => void
} & Omit<BrowserViewportProps, "className">

export default function GoogleChromeWindows({
  className,
  omniboxTypingPrompts = chromeWindowsConfig.omniboxTypingPrompts,
  omniboxTypingLoop = true,
  onOmniboxTypedComplete,
  onOmniboxTypedCleared,
  minHeight,
  aspectRatio,
  src,
  alt,
  videoSrc,
  poster,
  autoPlay,
  children,
}: GoogleChromeWindowsProps) {
  const hasCustomViewport = children != null
  const { phase, progress, startLoading } = useSimulatedPageLoad()

  const handleTypedComplete = useCallback(() => {
    if (!hasCustomViewport) startLoading()
    onOmniboxTypedComplete?.()
  }, [hasCustomViewport, startLoading, onOmniboxTypedComplete])

  const { displayText, showCursor, caretSolid, isActive } = useOmniboxTyping({
    prompts: omniboxTypingPrompts,
    loop: omniboxTypingLoop,
    onTypedComplete: handleTypedComplete,
    onTypedCleared: onOmniboxTypedCleared,
  })

  return (
    <div
      className={cn(
        "gcw-root mx-auto w-full max-w-6xl min-w-0 overflow-hidden rounded-sm border border-(--gcw-border) bg-(--gcw-chrome-bg) font-['Segoe_UI',system-ui,-apple-system,Roboto,'Helvetica_Neue',Arial,sans-serif] shadow-(--gcw-shadow) outline-none outline-1 -outline-offset-1 outline-(--gcw-ring)",
        className
      )}
      role="img"
      aria-label="Google Chrome on Windows browser window mockup"
    >
      <div className="flex min-h-11 items-stretch justify-between gap-1.5 bg-(--gcw-chrome-bg) pb-0 pl-1.5">
        <div className="flex min-w-0 flex-1 items-end gap-0.5 pt-1">
          <div className="grid w-[clamp(9.5rem,32vw,12rem)] max-w-48 min-w-38 shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-t-lg bg-(--gcw-tab-bg) px-1.5 py-1.5 pl-2.5 text-xs leading-[1.2] text-(--gcw-tab-fg)">
            <GoogleGIcon muted className="size-3.5" />
            <span className="min-w-0 truncate">
              {chromeWindowsConfig.tabTitle}
            </span>
            <button
              type="button"
              className="mr-0.5 flex size-5 items-center justify-center self-center justify-self-end rounded-full border-none bg-transparent p-0 text-(--gcw-tab-close) opacity-85 hover:opacity-100"
              tabIndex={-1}
              aria-hidden
            >
              <X className={tabIconClass} />
            </button>
          </div>
          <button
            type="button"
            className="mb-1.5 flex size-5 shrink-0 items-center justify-center border-none bg-transparent p-0 text-(--gcw-new-tab)"
            tabIndex={-1}
            aria-hidden
          >
            <Plus className={tabIconClass} />
          </button>
        </div>
        <WindowControls />
      </div>

      <div className="box-border flex min-h-10.5 items-center gap-2 border-b border-(--gcw-toolbar-border) bg-(--gcw-toolbar-bg) py-1.5 pr-2.5 pl-3">
        <div className="flex shrink-0 items-center gap-px">
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border-none bg-transparent p-0 text-(--gcw-nav-fg)"
            tabIndex={-1}
            aria-hidden
          >
            <ArrowLeft {...toolbarIcon} />
          </button>
          <button
            type="button"
            className="flex size-8 shrink-0 cursor-default items-center justify-center rounded-full border-none bg-transparent p-0 text-(--gcw-nav-disabled)"
            disabled
            tabIndex={-1}
            aria-hidden
          >
            <ArrowRight {...toolbarIcon} />
          </button>
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border-none bg-transparent p-0 text-(--gcw-nav-fg)"
            tabIndex={-1}
            aria-hidden
          >
            <ArrowClockwise {...toolbarIcon} />
          </button>
        </div>

        <div
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 rounded-full border border-(--gcw-omnibox-border) bg-(--gcw-omnibox-bg) py-1 pr-2 pl-2.5 transition-[box-shadow,border-color] duration-200 ease-out motion-reduce:transition-none",
            isActive &&
              "border-transparent shadow-[0_0_0_1px_var(--gcw-omnibox-focus-ring)]"
          )}
        >
          <GoogleGIcon className="size-4" />
          <OmniboxTypingText
            displayText={displayText}
            showCursor={showCursor}
            caretSolid={caretSolid}
          />
          <div className="flex shrink-0 items-center gap-0.5" aria-hidden>
            <button
              type="button"
              className="flex size-6.5 items-center justify-center rounded-full border-none bg-transparent p-0 text-(--gcw-omnibox-icon)"
              tabIndex={-1}
            >
              <Star {...toolbarIcon} />
            </button>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border-none bg-transparent p-0 text-(--gcw-toolbar-icon)"
            tabIndex={-1}
            aria-hidden
          >
            <PuzzlePiece {...toolbarIcon} />
          </button>
          <ToolbarSeparator />
          <ProfileAvatar />
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border-none bg-transparent p-0 text-(--gcw-toolbar-icon)"
            tabIndex={-1}
            aria-hidden
          >
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
        {children ?? (
          <ChromeViewportDefault phase={phase} progress={progress} />
        )}
      </BrowserViewport>
    </div>
  )
}
