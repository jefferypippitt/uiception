"use client"

import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react"

import {
  getPromptPrefix,
  getWelcomeLines,
  runCommand,
  type TerminalLine,
} from "../lib/commands"
import { TerminalLineView } from "./terminal-line"

import "../styles/terminal.css"

const MAX_HISTORY = 100

type HistoryEntry = {
  id: number
  kind: "output" | "input"
  lines: TerminalLine[]
}

function estimateCols(width: number): number {
  // 15px Geist Mono ≈ 9px/ch; subtract 32px for the 16px side padding
  const available = Math.max(0, width - 32)
  return Math.max(20, Math.floor(available / 9))
}

export function Terminal() {
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const idRef = useRef(0)

  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState("")
  const [booted, setBooted] = useState(false)

  const nextId = () => {
    idRef.current += 1
    return idRef.current
  }

  const scrollToBottom = useEffectEvent(() => {
    window.scrollTo(0, document.body.scrollHeight)
  })

  const boot = useEffectEvent(() => {
    const width = rootRef.current?.clientWidth ?? window.innerWidth
    const lines = getWelcomeLines(estimateCols(width))
    setEntries([{ id: nextId(), kind: "output", lines }])
    setBooted(true)
  })

  useEffect(() => {
    boot()
  }, [])

  useEffect(() => {
    if (!booted) return
    // Keep the welcome banner (jondoe title) pinned to the top on load and
    // after `clear`; only chase the bottom once there's command output.
    if (entries.length <= 1) return
    scrollToBottom()
  }, [entries, booted])

  useEffect(() => {
    if (!booted) return
    // Preview iframes that steal focus scroll the parent catalog to this
    // section. Only autofocus when this template is the top-level page.
    try {
      if (window.self !== window.top) return
    } catch {
      return
    }
    inputRef.current?.focus({ preventScroll: true })
  }, [booted])

  function focusInput() {
    inputRef.current?.focus({ preventScroll: true })
  }

  function resetScreen() {
    const width = rootRef.current?.clientWidth ?? window.innerWidth
    setEntries([
      {
        id: nextId(),
        kind: "output",
        lines: getWelcomeLines(estimateCols(width)),
      },
    ])
    setInput("")
    setHistoryIndex(null)
    setDraft("")
  }

  function submitCommand(raw: string) {
    const trimmed = raw.trim()
    const prompt = getPromptPrefix()

    if (!trimmed) {
      setEntries((prev) => [
        ...prev,
        {
          id: nextId(),
          kind: "input",
          lines: [
            {
              segments: [
                { type: "text", value: prompt, tone: "default" },
                { type: "text", value: "", tone: "default" },
              ],
            },
          ],
        },
      ])
      setInput("")
      setHistoryIndex(null)
      return
    }

    const echo: HistoryEntry = {
      id: nextId(),
      kind: "input",
      lines: [
        {
          segments: [
            { type: "text", value: prompt, tone: "default" },
            { type: "text", value: trimmed, tone: "default" },
          ],
        },
      ],
    }

    setCommandHistory((prev) => {
      const next = [...prev, trimmed]
      return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next
    })
    setHistoryIndex(null)
    setDraft("")
    setInput("")

    const result = runCommand(
      trimmed,
      estimateCols(rootRef.current?.clientWidth ?? window.innerWidth)
    )

    if (result.kind === "clear") {
      resetScreen()
      return
    }

    setEntries((prev) => [
      ...prev,
      echo,
      ...(result.lines.length > 0
        ? [{ id: nextId(), kind: "output" as const, lines: result.lines }]
        : []),
    ])
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    submitCommand(input)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "l" && event.ctrlKey) {
      event.preventDefault()
      resetScreen()
      return
    }

    if (event.key === "c" && event.ctrlKey) {
      event.preventDefault()
      setInput("")
      setHistoryIndex(null)
      setDraft("")
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (commandHistory.length === 0) return
      if (historyIndex === null) {
        setDraft(input)
        const index = commandHistory.length - 1
        setHistoryIndex(index)
        setInput(commandHistory[index] ?? "")
        return
      }
      if (historyIndex > 0) {
        const index = historyIndex - 1
        setHistoryIndex(index)
        setInput(commandHistory[index] ?? "")
      }
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (historyIndex === null) return
      if (historyIndex < commandHistory.length - 1) {
        const index = historyIndex + 1
        setHistoryIndex(index)
        setInput(commandHistory[index] ?? "")
        return
      }
      setHistoryIndex(null)
      setInput(draft)
    }
  }

  const prompt = getPromptPrefix()

  return (
    <div ref={rootRef} className="pt-root" onClick={focusInput}>
      <div className="pt-output">
        {entries.map((entry) => (
          <div key={entry.id}>
            {entry.lines.map((line, index) => (
              <TerminalLineView key={`${entry.id}-${index}`} line={line} />
            ))}
          </div>
        ))}

        <form
          onSubmit={onSubmit}
          className="pt-line flex items-baseline"
          aria-label="Terminal command"
        >
          <span className="shrink-0">{prompt}</span>
          <div className="relative min-w-0 flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => {
                setInput(event.target.value)
                setHistoryIndex(null)
              }}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              aria-label="Command"
              className="w-full bg-transparent text-[inherit] caret-transparent outline-none"
            />
            <span
              className="pt-cursor blink pointer-events-none absolute top-0"
              style={{ left: `${input.length}ch` }}
              aria-hidden
            />
          </div>
        </form>
      </div>
    </div>
  )
}
