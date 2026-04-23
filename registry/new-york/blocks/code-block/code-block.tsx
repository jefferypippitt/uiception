"use client"

import { cn } from "@/lib/utils"

import CodeTabs from "./components/code-tabs"
import { useCodeBlock } from "./hooks/use-code-block"
import "./styles/code-block.css"

export default function CodeBlock({ className }: { className?: string }) {
  const { activeTab, setActiveTab, copied, handleCopy } = useCodeBlock()

  return (
    <div className={cn("cb-root mx-auto w-full min-w-0 max-w-3xl", className)}>
      <div className="cb-inner">
        <CodeTabs
          activeTab={activeTab}
          copied={copied}
          onTabChange={setActiveTab}
          onCopy={handleCopy}
        />
      </div>
    </div>
  )
}
