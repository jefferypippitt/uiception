"use client"

import * as React from "react"

export function useCopyToClipboard({ timeout = 2000 }: { timeout?: number } = {}) {
  const [isCopied, setIsCopied] = React.useState(false)
  const [isCopying, setIsCopying] = React.useState(false)

  const copyToClipboard = React.useCallback(
    (text: string) => {
      if (!navigator?.clipboard) return
      setIsCopying(true)
      void navigator.clipboard
        .writeText(text)
        .then(() => {
          setIsCopied(true)
          window.setTimeout(() => setIsCopied(false), timeout)
        })
        .finally(() => {
          setIsCopying(false)
        })
    },
    [timeout]
  )

  return { copyToClipboard, isCopied, isCopying }
}
