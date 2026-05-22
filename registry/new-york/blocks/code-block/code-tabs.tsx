"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { TAB_OPTIONS, COMMANDS, type TabOption } from "./config"

import "./code-block.css"

type Props = {
  activeTab: TabOption
  copied: boolean
  onTabChange: (tab: TabOption) => void
  onCopy: () => void
}

export default function CodeTabs({
  activeTab,
  copied,
  onTabChange,
  onCopy,
}: Props) {
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0 })

  React.useLayoutEffect(() => {
    const idx = TAB_OPTIONS.indexOf(activeTab)
    const el = tabRefs.current[idx]
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
  }, [activeTab])

  const cmd = COMMANDS[activeTab]
  const [pkgManager, action, ...pkgs] = cmd.split(" ")

  return (
    <div className="overflow-hidden rounded-lg border border-[#eaeaea] bg-white dark:border-[#1a1a1a] dark:bg-black">
      <div className="relative flex items-center gap-3 border-b border-[#eaeaea] px-4 dark:border-[#1a1a1a]">
        {TAB_OPTIONS.map((tab, i) => (
          <button
            key={tab}
            ref={(el) => {
              tabRefs.current[i] = el
            }}
            onClick={() => onTabChange(tab)}
            className={cn(
              "cursor-pointer border-none bg-transparent py-2 text-sm font-medium text-[#a0a0a0] transition-colors duration-150 hover:text-[#171717] dark:hover:text-[#eeeeee]",
              activeTab === tab && "text-[#171717] dark:text-[#eeeeee]"
            )}
          >
            {tab}
          </button>
        ))}
        <div
          className="pointer-events-none absolute bottom-0 h-px bg-[#9a7b2d] transition-[left,width] duration-200 ease-out motion-reduce:transition-none dark:bg-[#cca649]"
          style={{ left: indicator.left, width: indicator.width }}
        />
        <div
          className="pointer-events-none absolute bottom-0 h-2 bg-[color-mix(in_srgb,#9a7b2d_25%,transparent)] blur-[3px] transition-[left,width] duration-200 ease-out motion-reduce:transition-none dark:bg-[color-mix(in_srgb,#cca649_25%,transparent)]"
          style={{ left: indicator.left, width: indicator.width }}
        />
      </div>

      <div className="flex items-center justify-between gap-4 overflow-x-auto bg-[#f5f5f5] px-4 py-2.5 font-mono text-sm dark:bg-[#1a1a1a]">
        <code
          key={activeTab}
          className="cblk-cmd inline-flex text-left whitespace-nowrap"
        >
          <span className="text-[#0070f3] dark:text-[#47a8ff]">
            {pkgManager}
          </span>
          <span className="ml-2 text-[#d6336c] dark:text-[#ff4d8d]">
            {action}
          </span>
          <span className="ml-2 text-[#067a3d] dark:text-[#00c45c]">
            {pkgs.join(" ")}
          </span>
        </code>

        <button
          onClick={onCopy}
          className={cn(
            "shrink-0 cursor-pointer rounded border-none bg-transparent p-1 text-[#6b7280] transition-colors duration-150 hover:bg-[#f0f0f0] hover:text-[#171717] dark:hover:bg-[#2a2a2a] dark:hover:text-[#eeeeee]",
            copied && "text-[#067a3d] dark:text-[#00c45c]"
          )}
          title="Copy command"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  )
}
