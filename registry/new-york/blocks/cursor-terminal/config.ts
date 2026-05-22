export type LineColor = "green" | "cyan" | "dim"

export type Phase = "idle" | "typing" | "output" | "done"

export interface PromptState {
  dot: "blue" | "grey"
  showPrompt: boolean
  showPath: boolean
  typed: string
  cursor: boolean
  animateIn: boolean
}

export interface Line {
  id: number
  text: string
  color?: LineColor
  spinning?: boolean
  promptLine?: boolean
  dot?: "blue" | "grey"
}

export type OutputItem =
  | { type: "line"; text: string; color?: LineColor; delay: number }
  | { type: "spinner"; text: string; doneText?: string; delay: number; duration: number }

export const PROMPT = "PS C:\\projects\\uiception> "
export const COMMAND = 'npx shadcn@latest add "https://uiception.com/r/hero-section-v1.json"'
export const TYPE_SPEED = 38

export const ICON_SM = "size-3 shrink-0 stroke-[1.75]"
export const ICON_XS = "size-2.5 shrink-0 stroke-[1.75]"

export const PANEL_TABS = ["Problems", "Output", "Debug Console", "Terminal", "Ports", "GitLens"] as const

export const INIT_LINES: Line[] = []

export const OUTPUT_SEQUENCE: OutputItem[] = [
  { type: "spinner", text: "Checking registry.", delay: 280, duration: 1000 },
  {
    type: "spinner",
    text: "Installing dependencies.",
    delay: 160,
    duration: 2200,
    doneText: "Installed dependencies.",
  },
  { type: "line", text: "✓ Created 21 files:", color: "green", delay: 80 },
  { type: "line", text: "  - components/ui/button.tsx", color: "cyan", delay: 85 },
  { type: "line", text: "  - app/hero-section-v1/page.tsx", color: "cyan", delay: 80 },
  { type: "line", text: "  - app/hero-section-v1/hero-section-v1.tsx", color: "cyan", delay: 80 },
  { type: "line", text: "  - app/hero-section-v1/brands-section-v1.tsx", color: "cyan", delay: 80 },
  { type: "line", text: "  - app/hero-section-v1/mac-os-terminal.tsx", color: "cyan", delay: 80 },
  { type: "line", text: "  - public/images/blocks/hero-section-v1/hero-section-v1-bg.png", color: "cyan", delay: 80 },
  {
    type: "line",
    text: "  … +15 files (CSS, terminal TS/CSS, code segments, 12 brand SVGs)",
    color: "dim",
    delay: 90,
  },
  { type: "line", text: "", delay: 160 },
  { type: "line", text: "Success! Component installed successfully.", color: "green", delay: 100 },
  { type: "line", text: "You may now import and use the component.", color: "dim", delay: 80 },
]
