/** Color scheme slots used by the commands (see styles/cta-section-v7.css). */
export type Tone = "fg" | "cyan" | "bright-yellow"

export type Segment = { text: string; tone?: Tone }

export type Session = {
  id: string
  /** Tab label. */
  title: string
  /** Shell prompt; shown but not copied. */
  prompt: string
  /** The install command, split into highlighted tokens. */
  command: Segment[]
}

export const sessions: Session[] = [
  {
    id: "powershell",
    title: "PowerShell",
    prompt: ">",
    // PSReadLine defaults: commands bright yellow, strings dark cyan. The
    // registry name is quoted because PowerShell reads a leading @ as splatting.
    command: [
      { text: "npx", tone: "bright-yellow" },
      { text: " shadcn@latest add " },
      { text: "\"@uiception/cta-section-v7\"", tone: "cyan" },
    ],
  },
  {
    id: "wsl",
    title: "WSL",
    prompt: "$",
    // Same token colors as the PowerShell tab, the way a highlighting shell
    // (zsh-syntax-highlighting, fish) would color it. No quotes needed in bash.
    command: [
      { text: "pnpm", tone: "bright-yellow" },
      { text: " dlx shadcn@latest add " },
      { text: "@uiception/cta-section-v7", tone: "cyan" },
    ],
  },
]

export const commandText = (session: Session) =>
  session.command.map((segment) => segment.text).join("")
