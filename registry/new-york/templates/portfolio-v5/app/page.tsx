import { Button } from "@/components/ui/button"

const projects = [
  {
    name: "Panfry",
    href: "https://github.com/",
    description: "A small recipe box for the meals I actually cook on repeat.",
  },
  {
    name: "Longmile",
    href: "https://github.com/",
    description:
      "Tracks my slow, patient return to running after a bad knee.",
  },
  {
    name: "Spinebox",
    href: "https://github.com/",
    description: "A shelf for the books I have actually finished this year.",
  },
  {
    name: "Coinwell",
    href: "https://github.com/",
    description: "A simple, honest look at where my money actually goes.",
  },
] as const

export default function HomePage() {
  return (
    <main className="pointer-events-none relative z-10 max-w-md px-4 pt-[max(16vh,calc(1.5rem+env(safe-area-inset-top)))] pb-16 text-base text-white sm:max-w-lg sm:px-6 md:max-w-md md:px-8 lg:max-w-lg">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-5">
          <nav className="pointer-events-auto flex flex-wrap gap-x-4 gap-y-1">
            <Button
              variant="link"
              asChild
              className="h-auto p-0 text-base font-normal text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
            >
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </Button>
            <Button
              variant="link"
              asChild
              className="h-auto p-0 text-base font-normal text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
            >
              <a href="https://x.com" target="_blank" rel="noreferrer">
                X
              </a>
            </Button>
            <Button
              variant="link"
              asChild
              className="h-auto p-0 text-base font-normal text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
            >
              <a href="https://github.com" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </Button>
          </nav>

          <section className="pointer-events-auto flex flex-col gap-3 leading-relaxed">
            <p>
              I&apos;m Jon, a fullstack developer in Portland. Most of my work
              is with early AI infrastructure teams.
            </p>
            <p>
              I keep the stack small and ship in small pieces. I want to leave
              code the next person can read without me there to explain it.
            </p>
            <p>
              Outside work I cook the same handful of dinners on repeat.
              I&apos;m easing back into running after a bad knee, and working
              through a pile of books I bought and never opened.
            </p>
          </section>
        </div>

        <section className="pointer-events-auto flex flex-col gap-4">
          <h2 className="text-base font-normal">Projects</h2>
          <ul className="flex flex-col gap-4">
            {projects.map((project) => (
              <li key={project.name} className="flex flex-col gap-1">
                <Button
                  variant="link"
                  asChild
                  className="h-auto w-fit justify-start p-0 text-base font-normal text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
                >
                  <a href={project.href} target="_blank" rel="noreferrer">
                    {project.name}
                  </a>
                </Button>
                <span>{project.description}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
