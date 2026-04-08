"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { TAB_OPTIONS, COMMANDS, type TabOption } from "../lib/config"

type Props = {
  activeTab: TabOption
  copied: boolean
  onTabChange: (tab: TabOption) => void
  onCopy: () => void
}

export default function CodeTabs({ activeTab, copied, onTabChange, onCopy }: Props) {
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
    <div className="cb-card">
      {/* Tab row */}
      <div className="cb-tabs">
        {TAB_OPTIONS.map((tab, i) => (
          <button
            key={tab}
            ref={(el) => { tabRefs.current[i] = el }}
            onClick={() => onTabChange(tab)}
            className={cn("cb-tab", activeTab === tab && "cb-tab--active")}
          >
            {tab}
          </button>
        ))}
        <div className="cb-indicator" style={{ left: indicator.left, width: indicator.width }} />
        <div className="cb-indicator-glow" style={{ left: indicator.left, width: indicator.width }} />
      </div>

      {/* Code row */}
      <div className="cb-code">
        <code key={activeTab} className="cb-cmd">
          <span className="cb-syntax-cmd">{pkgManager}</span>
          <span className="cb-syntax-action">{action}</span>
          <span className="cb-syntax-pkg">{pkgs.join(" ")}</span>
        </code>

        <button
          onClick={onCopy}
          className={cn("cb-copy-btn", copied && "cb-copy-btn--copied")}
          title="Copy command"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  )
}
