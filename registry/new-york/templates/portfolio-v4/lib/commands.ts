import { ASCII_ART, shouldShowAscii } from "./ascii"
import { portfolio } from "./portfolio"

export type LineTone = "default" | "dim" | "bold" | "cyan" | "error"

export type LineSegment =
  | { type: "text"; value: string; tone?: LineTone }
  | { type: "link"; value: string; href: string; tone?: LineTone }

export type TerminalLine = {
  segments: LineSegment[]
}

export type CommandResult =
  | { kind: "output"; lines: TerminalLine[] }
  | { kind: "clear" }

/** Shown on the welcome banner. */
const COMMON_COMMANDS = ["about", "work", "projects", "resume", "help"] as const

/** Discoverable via `ls` (and runnable) — not listed under Commands:. */
const EXTRA_COMMANDS = ["destinations", "events"] as const

const UTILITY_COMMANDS = ["ls", "clear"] as const

const COMMANDS = [
  ...COMMON_COMMANDS,
  ...EXTRA_COMMANDS,
  ...UTILITY_COMMANDS,
] as const

type CommandName = (typeof COMMANDS)[number]

/** Everything `ls` lists — like a home directory of portfolio entries. */
const LS_ENTRIES = [
  "about",
  "destinations",
  "events",
  "help",
  "projects",
  "resume",
  "work",
] as const

function text(value: string, tone: LineTone = "default"): TerminalLine {
  return { segments: [{ type: "text", value, tone }] }
}

function blank(): TerminalLine {
  return { segments: [{ type: "text", value: "", tone: "default" }] }
}

/** Equal gaps between names (navbar-style), wrapping when the row fills. */
function equalGapListing(names: readonly string[], cols: number): TerminalLine[] {
  const gap = "    "
  const gapLen = gap.length
  const lines: TerminalLine[] = []
  let row: string[] = []
  let rowLen = 0

  const flush = () => {
    if (row.length === 0) return
    const segments: LineSegment[] = []
    row.forEach((name, index) => {
      if (index > 0) {
        segments.push({ type: "text", value: gap, tone: "default" })
      }
      segments.push({ type: "text", value: name, tone: "cyan" })
    })
    lines.push({ segments })
    row = []
    rowLen = 0
  }

  for (const name of names) {
    const nextLen = row.length === 0 ? name.length : rowLen + gapLen + name.length
    if (row.length > 0 && nextLen > Math.max(cols, 24)) {
      flush()
    }
    row.push(name)
    rowLen = row.length === 1 ? name.length : rowLen + gapLen + name.length
  }
  flush()

  return lines
}

function parseInput(raw: string): { name: string; args: string[] } {
  const parts = raw.trim().split(/\s+/).filter(Boolean)
  const head = parts[0] ?? ""
  return {
    name: head.replace(/^\//, "").toLowerCase(),
    args: parts.slice(1),
  }
}

function isCommandName(value: string): value is CommandName {
  return (COMMANDS as readonly string[]).includes(value)
}

export function getWelcomeLines(cols: number): TerminalLine[] {
  const lines: TerminalLine[] = [blank()]

  if (shouldShowAscii(cols)) {
    for (const row of ASCII_ART) {
      lines.push(text(row))
    }
  } else {
    lines.push(text(portfolio.name, "bold"))
    lines.push(text("======="))
  }

  lines.push(blank())
  lines.push(text(portfolio.tagline, "bold"))
  lines.push(blank())

  const commonSegments: LineSegment[] = [
    { type: "text", value: "Commands: ", tone: "dim" },
  ]
  COMMON_COMMANDS.forEach((cmd, index) => {
    commonSegments.push({ type: "text", value: cmd, tone: "cyan" })
    if (index < COMMON_COMMANDS.length - 1) {
      commonSegments.push({ type: "text", value: ", ", tone: "dim" })
    }
  })
  lines.push({ segments: commonSegments })

  lines.push({
    segments: [
      { type: "text", value: "Try: ", tone: "dim" },
      { type: "text", value: "ls", tone: "cyan" },
    ],
  })
  lines.push(blank())

  return lines
}

function aboutLines(): TerminalLine[] {
  const lines: TerminalLine[] = [
    text(`${portfolio.name} — ${portfolio.title}`, "bold"),
    text(portfolio.location, "dim"),
    blank(),
    text(portfolio.about.summary),
    blank(),
  ]

  for (const paragraph of portfolio.about.details) {
    lines.push(text(paragraph))
  }

  lines.push(blank())
  lines.push(text("Hobbies", "bold"))
  for (const hobby of portfolio.about.hobbies) {
    lines.push(text(`  · ${hobby}`, "dim"))
  }

  lines.push(blank())
  lines.push({
    segments: [
      { type: "text", value: "Find me on ", tone: "default" },
      ...portfolio.socials.flatMap((social, index) => {
        const parts: LineSegment[] = [
          { type: "link", value: social.label, href: social.href, tone: "cyan" },
        ]
        if (index < portfolio.socials.length - 1) {
          parts.push({ type: "text", value: ", ", tone: "default" })
        }
        return parts
      }),
      { type: "text", value: ", or ", tone: "default" },
      {
        type: "link",
        value: portfolio.email,
        href: `mailto:${portfolio.email}`,
        tone: "cyan",
      },
      { type: "text", value: ".", tone: "default" },
    ],
  })

  return lines
}

function renderJob(job: (typeof portfolio.experience)[number]): TerminalLine[] {
  return [
    {
      segments: [
        { type: "text", value: job.role, tone: "bold" },
        { type: "text", value: " · ", tone: "dim" },
        { type: "link", value: job.company, href: job.href, tone: "cyan" },
      ],
    },
    text(job.dates, "dim"),
    text(job.description),
  ]
}

function workLines(): TerminalLine[] {
  const lines: TerminalLine[] = [text("Work", "bold"), blank()]

  portfolio.experience.forEach((job, index) => {
    lines.push(...renderJob(job))
    if (index < portfolio.experience.length - 1) {
      lines.push(blank())
    }
  })

  lines.push(blank())
  lines.push(text("Internships", "bold"))
  lines.push(blank())

  portfolio.internships.forEach((job, index) => {
    lines.push(...renderJob(job))
    if (index < portfolio.internships.length - 1) {
      lines.push(blank())
    }
  })

  return lines
}

function projectsLines(): TerminalLine[] {
  const lines: TerminalLine[] = [text("Projects", "bold"), blank()]

  portfolio.projects.forEach((project, index) => {
    const number = String(index + 1).padStart(2, "0")
    lines.push({
      segments: [
        { type: "text", value: `${number}  `, tone: "dim" },
        { type: "link", value: project.name, href: project.href, tone: "cyan" },
      ],
    })
    lines.push(text(`    ${project.description}`, "dim"))
    if (index < portfolio.projects.length - 1) {
      lines.push(blank())
    }
  })

  return lines
}

function resumeLines(): TerminalLine[] {
  const lines: TerminalLine[] = [
    text(`${portfolio.name}`, "bold"),
    text(`${portfolio.title} · ${portfolio.location}`, "dim"),
    {
      segments: [
        {
          type: "link",
          value: portfolio.email,
          href: `mailto:${portfolio.email}`,
          tone: "cyan",
        },
      ],
    },
    blank(),
    text(portfolio.about.summary),
    blank(),
    text("Experience", "bold"),
    blank(),
  ]

  for (const job of portfolio.experience) {
    lines.push({
      segments: [
        { type: "text", value: `${job.role}, `, tone: "default" },
        { type: "link", value: job.company, href: job.href, tone: "cyan" },
      ],
    })
    lines.push(text(`  ${job.dates}`, "dim"))
    lines.push(text(`  ${job.description}`, "dim"))
    lines.push(blank())
  }

  lines.push(text("Internships", "bold"))
  lines.push(blank())

  for (const job of portfolio.internships) {
    lines.push({
      segments: [
        { type: "text", value: `${job.role}, `, tone: "default" },
        { type: "link", value: job.company, href: job.href, tone: "cyan" },
      ],
    })
    lines.push(text(`  ${job.dates}`, "dim"))
    lines.push(text(`  ${job.description}`, "dim"))
    lines.push(blank())
  }

  lines.push(text("Skills", "bold"))
  lines.push(blank())

  for (const group of portfolio.skills) {
    lines.push({
      segments: [
        { type: "text", value: group.label, tone: "cyan" },
        { type: "text", value: ` — ${group.description}`, tone: "dim" },
      ],
    })
    lines.push(text(`  ${group.items.join(", ")}`))
    lines.push(blank())
  }

  lines.push(text("Education", "bold"))
  lines.push(blank())

  for (const school of portfolio.education) {
    lines.push({
      segments: [
        { type: "link", value: school.school, href: school.href, tone: "cyan" },
        { type: "text", value: ` — ${school.detail}`, tone: "default" },
      ],
    })
    lines.push(text(`  ${school.dates}`, "dim"))
    lines.push(blank())
  }

  lines.push(text("Certificates", "bold"))
  lines.push(blank())

  for (const cert of portfolio.certificates) {
    lines.push({
      segments: [
        { type: "link", value: cert.name, href: cert.href, tone: "cyan" },
      ],
    })
    lines.push(text(`  ${cert.issuer} · ${cert.year}`, "dim"))
    lines.push(blank())
  }

  if (lines.at(-1)?.segments.every((s) => s.type === "text" && s.value === "")) {
    lines.pop()
  }

  return lines
}

function destinationsLines(): TerminalLine[] {
  const lines: TerminalLine[] = [text("Destinations", "bold"), blank()]

  portfolio.destinations.forEach((spot, index) => {
    lines.push({
      segments: [
        { type: "text", value: spot.place, tone: "cyan" },
        { type: "text", value: `  ${spot.year}`, tone: "dim" },
      ],
    })
    lines.push(text(`  ${spot.note}`))
    if (index < portfolio.destinations.length - 1) {
      lines.push(blank())
    }
  })

  return lines
}

function eventsLines(): TerminalLine[] {
  const lines: TerminalLine[] = [text("Events", "bold"), blank()]

  portfolio.events.forEach((event, index) => {
    lines.push(text(event.name, "cyan"))
    lines.push(text(`  ${event.where}`, "dim"))
    if (index < portfolio.events.length - 1) {
      lines.push(blank())
    }
  })

  return lines
}

function helpLines(): TerminalLine[] {
  return [
    text("Available commands", "bold"),
    blank(),
    {
      segments: [
        { type: "text", value: "  about         ", tone: "cyan" },
        { type: "text", value: "Who I am, hobbies, links", tone: "dim" },
      ],
    },
    {
      segments: [
        { type: "text", value: "  work          ", tone: "cyan" },
        { type: "text", value: "Jobs — title, company, what I did", tone: "dim" },
      ],
    },
    {
      segments: [
        { type: "text", value: "  projects      ", tone: "cyan" },
        { type: "text", value: "Things I've shipped on the side", tone: "dim" },
      ],
    },
    {
      segments: [
        { type: "text", value: "  resume        ", tone: "cyan" },
        { type: "text", value: "Full résumé — experience, skills, school, certs", tone: "dim" },
      ],
    },
    {
      segments: [
        { type: "text", value: "  ls            ", tone: "cyan" },
        { type: "text", value: "List everything in this portfolio", tone: "dim" },
      ],
    },
    {
      segments: [
        { type: "text", value: "  help          ", tone: "cyan" },
        { type: "text", value: "Show this list", tone: "dim" },
      ],
    },
    {
      segments: [
        { type: "text", value: "  clear         ", tone: "cyan" },
        { type: "text", value: "Clear the screen (or Ctrl+L)", tone: "dim" },
      ],
    },
    blank(),
    text("Also on disk (try ls):", "dim"),
    {
      segments: [
        { type: "text", value: "  destinations  ", tone: "cyan" },
        { type: "text", value: "Places I've been", tone: "dim" },
      ],
    },
    {
      segments: [
        { type: "text", value: "  events        ", tone: "cyan" },
        { type: "text", value: "Conferences & meetups", tone: "dim" },
      ],
    },
  ]
}

export function runCommand(raw: string, cols = 80): CommandResult {
  const { name } = parseInput(raw)

  if (!name) {
    return { kind: "output", lines: [] }
  }

  if (!isCommandName(name)) {
    return {
      kind: "output",
      lines: [
        text(`bash: ${name}: command not found`, "error"),
        {
          segments: [
            { type: "text", value: "Type ", tone: "dim" },
            { type: "text", value: "ls", tone: "cyan" },
            { type: "text", value: " or ", tone: "dim" },
            { type: "text", value: "help", tone: "cyan" },
            { type: "text", value: ".", tone: "dim" },
          ],
        },
      ],
    }
  }

  switch (name) {
    case "clear":
      return { kind: "clear" }
    case "ls":
      return { kind: "output", lines: equalGapListing(LS_ENTRIES, cols) }
    case "about":
      return { kind: "output", lines: aboutLines() }
    case "work":
      return { kind: "output", lines: workLines() }
    case "projects":
      return { kind: "output", lines: projectsLines() }
    case "resume":
      return { kind: "output", lines: resumeLines() }
    case "destinations":
      return { kind: "output", lines: destinationsLines() }
    case "events":
      return { kind: "output", lines: eventsLines() }
    case "help":
      return { kind: "output", lines: helpLines() }
    default: {
      const _exhaustive: never = name
      return _exhaustive
    }
  }
}

export function getPromptPrefix(): string {
  return "$ "
}
