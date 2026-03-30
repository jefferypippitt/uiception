export type LineColor = "green" | "cyan" | "dim"

export type Phase = "idle" | "typing" | "output" | "typingCode" | "done"

export interface Line {
  id: number
  text: string
  color?: LineColor
  spinning?: boolean
}

export type OutputItem =
  | { type: "line"; text: string; color?: LineColor; delay: number }
  | { type: "spinner"; text: string; doneText: string; delay: number; duration: number }

export const PROMPT = "user@macbook app % "
export const COMMAND = "pnpm i ai"
export const TYPE_SPEED = 38
export const TYPE_CODE_MS = 11
export const TYPE_CODE_NEWLINE_MS = 48

export const INIT_LINES: Line[] = []

export const OUTPUT_SEQUENCE: OutputItem[] = [
  {
    type: "spinner",
    text: "Resolving dependencies…",
    doneText: "Resolved dependencies",
    delay: 240,
    duration: 900,
  },
  {
    type: "spinner",
    text: "Downloading + installing ai…",
    doneText: "Downloaded and installed ai",
    delay: 140,
    duration: 1400,
  },
]
