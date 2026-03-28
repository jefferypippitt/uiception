"use client"

import * as React from "react"

export function useCopyToClipboard({ timeout = 2000 }: { timeout?: number } = {}) {
  const [isCopied, setIsCopied] = React.useState(false)

  const copyToClipboard = React.useCallback(
    (text: string) => {
      if (!navigator?.clipboard) return
      void navigator.clipboard.writeText(text).then(() => {
        setIsCopied(true)
        window.setTimeout(() => setIsCopied(false), timeout)
      })
    },
    [timeout]
  )

  return { copyToClipboard, isCopied }
}
