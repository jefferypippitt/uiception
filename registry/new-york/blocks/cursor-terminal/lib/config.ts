export type LineColor = "green" | "cyan" | "dim"

export type Phase = "idle" | "typing" | "output" | "done"

export interface PromptState {
  dot: "blue" | "grey"
  showPrompt: boolean
  showPath: boolean
  typed: string
  cursor: boolean
  animateIn: boolean
  pasteIn: boolean
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

export const PROMPT = "PS C:\\projects\\my-app> "
export const COMMAND = 'npx shadcn@latest add "https://uiception.com/r/hero-section-v1.json"'
/** Hold after paste before the command line commits. */
export const PASTE_SETTLE_MS = 580

export const ICON_SM = "size-3 shrink-0 stroke-[1.75]"
export const ICON_XS = "size-2.5 shrink-0 stroke-[1.75]"

export const PANEL_TABS = ["Problems", "Output", "Debug Console", "Terminal", "Ports", "GitLens"] as const

export const INIT_LINES: Line[] = []

export const OUTPUT_SEQUENCE: OutputItem[] = [
  { type: "spinner", text: "Checking registry.", delay: 420, duration: 1500 },
  {
    type: "spinner",
    text: "Installing dependencies.",
    delay: 240,
    duration: 3000,
    doneText: "Installed dependencies.",
  },
  { type: "line", text: "✓ Created 33 files:", color: "green", delay: 320 },
  { type: "line", text: "  - components/ui/button.tsx", color: "cyan", delay: 155 },
  { type: "line", text: "  - app/hero-section-v1/page.tsx", color: "cyan", delay: 145 },
  { type: "line", text: "  - app/hero-section-v1/components/hero-section-v1.tsx", color: "cyan", delay: 150 },
  { type: "line", text: "  - app/brands-section-v1/components/brands-section-v1.tsx", color: "cyan", delay: 142 },
  { type: "line", text: "  - app/mac-os-terminal/components/mac-os-terminal.tsx", color: "cyan", delay: 148 },
  { type: "line", text: "  - public/images/blocks/hero-section-v1/image.png.gitkeep", color: "cyan", delay: 152 },
  {
    type: "line",
    text: "  … +27 files (block-media, terminal TS/CSS, code segments, 11 brand SVGs)",
    color: "dim",
    delay: 190,
  },
  { type: "line", text: "", delay: 260 },
  { type: "line", text: "Success! Component installed successfully.", color: "green", delay: 300 },
  { type: "line", text: "You may now import and use the component.", color: "dim", delay: 180 },
]
