import { useState } from "react"
import { COMMANDS, type TabOption } from "./config"

export function useCodeBlock() {
  const [activeTab, setActiveTab] = useState<TabOption>("npm")
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(COMMANDS[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return { activeTab, setActiveTab, copied, handleCopy }
}
