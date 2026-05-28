"use client"

import { cn } from "@/lib/utils"

import CodeTabs from "./code-tabs"
import { useCodeBlock } from "../hooks/use-code-block"
import "../styles/code-block.css"

export default function CodeBlock({ className }: { className?: string }) {
  const { activeTab, setActiveTab, copied, handleCopy } = useCodeBlock()

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-3xl min-w-0 justify-center px-3.5 py-[18px]",
        className
      )}
    >
      <div className="w-full max-w-[680px]">
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
