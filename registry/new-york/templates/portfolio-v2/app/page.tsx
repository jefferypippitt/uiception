import Link from "next/link"

import { Button } from "@/components/ui/button"

import { ThemeToggle } from "../components/theme-toggle"
import { CopyEmail } from "../components/copy-email"
import { Avatar } from "../components/avatar"
import { getNotes } from "../lib/notes"

const projects = [
  {
    number: "01",
    name: "Panfry",
    href: "https://github.com/",
    description: "A small recipe box for the meals I actually cook on repeat",
  },
  {
    number: "02",
    name: "Longmile",
    href: "https://github.com/",
    description: "Tracks my slow, patient return to running after a bad knee",
  },
  {
    number: "03",
    name: "Spinebox",
    href: "https://github.com/",
    description: "A shelf for the books I have actually finished this year",
  },
  {
    number: "04",
    name: "Coinwell",
    href: "https://github.com/",
    description: "A simple, honest look at where my money actually goes",
  },
] as const

const experience = [
  {
    role: "Senior Full Stack Engineer",
    company: "Cortexa Labs",
    dates: "2024 to Present",
  },
  {
    role: "Full Stack Engineer",
    company: "Latentworks",
    dates: "2021 to 2024",
  },
  {
    role: "Software Engineer",
    company: "Synapse Foundry",
    dates: "2018 to 2021",
  },
  {
    role: "Junior Developer",
    company: "NeuralArc",
    dates: "2015 to 2018",
  },
] as const

export default function HomePage() {
  const notes = getNotes()

  return (
    <div className="flex flex-1 flex-col">
      {/* Top — 2 columns */}
      <header className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start md:gap-16 lg:gap-20">
        <div className="flex items-center gap-4">
          <Avatar />
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Jon Doe
            </h1>
            <p className="text-sm text-muted-foreground">Fullstack Developer</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 text-[0.9375rem] leading-relaxed text-muted-foreground">
          <p className="font-medium text-foreground">Hey, I&apos;m Jon.</p>
          <p>
            I work as a fullstack developer, building for AI infrastructure
            startups and teams shipping real tools with real users. I keep my
            stack simple, I ship in pieces I can trust, and I leave software
            that stays easy to maintain.
          </p>
          <p>
            Find me on{" "}
            <Button
              variant="link"
              asChild
              className="h-auto p-0 text-[0.9375rem]"
            >
              <a href="https://x.com/" target="_blank" rel="noreferrer">
                X
              </a>
            </Button>
            ,{" "}
            <Button
              variant="link"
              asChild
              className="h-auto p-0 text-[0.9375rem]"
            >
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </Button>
            , or{" "}
            <Button
              variant="link"
              asChild
              className="h-auto p-0 text-[0.9375rem]"
            >
              <a href="https://github.com/" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </Button>
            . Or shoot me an <CopyEmail />.
          </p>
        </div>
      </header>

      <div className="min-h-12 flex-1 md:min-h-16" aria-hidden />

      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3 md:gap-12 lg:gap-16">
        <section className="flex flex-col gap-5">
          <h2 className="text-xs font-medium tracking-tight text-muted-foreground">
            Notes
          </h2>
          <ul className="flex flex-col">
            {notes.map((note) => (
              <li
                key={note.slug}
                className="border-b border-dotted border-border/60 py-3 first:pt-0 last:border-b-0"
              >
                <Link
                  href={`/notes/${note.slug}`}
                  className="group flex flex-col gap-1"
                >
                  <span className="text-[0.9375rem] font-medium text-foreground transition-opacity group-hover:opacity-70">
                    {note.title}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {note.date.slice(0, 4)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <Link
              href="/notes"
              className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-foreground"
            >
              More
              <span
                aria-hidden
                className="text-muted-foreground transition-colors group-hover:text-foreground"
              >
                ↗
              </span>
            </Link>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <h2 className="text-xs font-medium tracking-tight text-muted-foreground">
            Projects
          </h2>
          <ul className="flex flex-col">
            {projects.map((project) => (
              <li
                key={project.name}
                className="border-b border-dotted border-border/60 py-3 first:pt-0 last:border-b-0"
              >
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-1"
                >
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {project.number}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-foreground">
                    {project.name}
                    <span
                      aria-hidden
                      className="text-muted-foreground transition-colors group-hover:text-foreground"
                    >
                      ↗
                    </span>
                  </span>
                  <span className="col-start-2 text-xs text-muted-foreground">
                    {project.description}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-5 sm:col-span-2 md:col-span-1">
          <h2 className="text-xs font-medium tracking-tight text-muted-foreground">
            Experience
          </h2>
          <ul className="flex flex-col">
            {experience.map((job) => (
              <li
                key={`${job.company}-${job.dates}`}
                className="border-b border-dotted border-border/60 py-3 first:pt-0 last:border-b-0"
              >
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col gap-1"
                >
                  <span className="text-[0.9375rem] font-medium text-foreground transition-opacity group-hover:opacity-70">
                    {job.role}, {job.company}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {job.dates}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-foreground"
            >
              LinkedIn
              <span
                aria-hidden
                className="text-muted-foreground transition-colors group-hover:text-foreground"
              >
                ↗
              </span>
            </a>
          </div>
        </section>
      </div>

      <div className="flex justify-end pt-12 md:pt-16">
        <ThemeToggle />
      </div>
    </div>
  )
}
