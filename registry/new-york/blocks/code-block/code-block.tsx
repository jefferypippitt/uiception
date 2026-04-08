"use client"

import CodeTabs from "./components/code-tabs"
import { useCodeBlock } from "./hooks/use-code-block"
import "./styles/code-block.css"

export default function CodeBlock() {
  const { activeTab, setActiveTab, copied, handleCopy } = useCodeBlock()

  return (
    <div className="cb-root">
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
