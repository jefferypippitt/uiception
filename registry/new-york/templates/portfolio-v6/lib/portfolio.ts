export type Project = {
  name: string
  href: string
  dates: string
  description: string
}

export type ExperienceItem = {
  role: string
  company: string
  href: string
  location?: string
  dates: string
  description: string
}

export type EducationItem = {
  school: string
  href: string
  detail: string
  dates: string
  description?: string
}

export type Certificate = {
  name: string
  issuer: string
  href: string
  year: string
}

export type Award = {
  name: string
  org: string
  year: string
}

export type ContactRow = {
  label: string
  value: string
  href: string
}

export const portfolio = {
  name: "Jon Doe",
  title: "Fullstack Developer at Cortexa Labs",
  location: "Portland, Oregon",
  email: "jon@example.com",
  about:
    "Hey, I'm Jon. Fullstack developer from Portland, building for AI infrastructure startups and teams shipping real tools with real users. I keep my stack simple, ship in pieces I can trust, and leave software that's easy to maintain. Outside of work I'm usually cooking the same five meals on repeat, easing back into running after a bad knee, or finishing one more book for the shelf.",
  experience: [
    {
      role: "Senior Full Stack Engineer",
      company: "Cortexa Labs",
      href: "https://www.linkedin.com/",
      location: "Portland, OR",
      dates: "2024 — Present",
      description:
        "Cortexa Labs builds AI infrastructure so teams can train, serve, and ship models in production.",
    },
    {
      role: "Full Stack Engineer",
      company: "Latentworks",
      href: "https://www.linkedin.com/",
      location: "Remote",
      dates: "2021 — 2024",
      description:
        "Latentworks makes tools for machine learning teams — from experiment tracking to deployment pipelines.",
    },
    {
      role: "Software Engineer",
      company: "Synapse Foundry",
      href: "https://www.linkedin.com/",
      location: "Seattle, WA",
      dates: "2018 — 2021",
      description:
        "Synapse Foundry is an early-stage platform helping startups turn prototypes into real products.",
    },
    {
      role: "Junior Developer",
      company: "NeuralArc",
      href: "https://www.linkedin.com/",
      location: "Portland, OR",
      dates: "2015 — 2018",
      description:
        "NeuralArc develops software for applied AI research and the teams putting models into practice.",
    },
    {
      role: "Software Engineering Intern",
      company: "Cascade Systems",
      href: "https://www.linkedin.com/",
      location: "Portland, OR",
      dates: "Summer 2014",
      description:
        "Cascade Systems builds developer tools for teams shipping cloud-native web applications.",
    },
    {
      role: "Software Engineering Intern",
      company: "Northline Soft",
      href: "https://www.linkedin.com/",
      location: "Seattle, WA",
      dates: "Summer 2013",
      description:
        "Northline Soft creates internal platforms that help mid-size companies modernize legacy software.",
    },
  ] satisfies ExperienceItem[],
  projects: [
    {
      name: "Coinwell",
      href: "https://github.com/",
      dates: "2023",
      description: "A simple, honest look at where my money actually goes.",
    },
    {
      name: "Spinebox",
      href: "https://github.com/",
      dates: "2022",
      description: "A shelf for the books I have actually finished this year.",
    },
    {
      name: "Longmile",
      href: "https://github.com/",
      dates: "2019",
      description: "Tracks my slow, patient return to running after a bad knee.",
    },
    {
      name: "Panfry",
      href: "https://github.com/",
      dates: "2016",
      description: "A small recipe box for the meals I actually cook on repeat.",
    },
  ] satisfies Project[],
  awards: [
    {
      name: "Engineering Excellence Award, Cortexa Labs",
      org: "Cortexa Labs",
      year: "2025",
    },
    {
      name: "Portland Tech 40 Under 40",
      org: "Portland Tech",
      year: "2023",
    },
    {
      name: "Best Internal Tooling, Synapse Foundry",
      org: "Synapse Foundry",
      year: "2021",
    },
    {
      name: "Rising Engineer, NeuralArc",
      org: "NeuralArc",
      year: "2018",
    },
  ] satisfies Award[],
  certificates: [
    {
      name: "AWS Certified Developer — Associate",
      issuer: "Amazon Web Services",
      href: "https://aws.amazon.com/certification/",
      year: "2023",
    },
    {
      name: "Professional Scrum Master I (PSM I)",
      issuer: "Scrum.org",
      href: "https://www.scrum.org/",
      year: "2021",
    },
    {
      name: "Meta Front-End Developer Certificate",
      issuer: "Meta / Coursera",
      href: "https://www.coursera.org/",
      year: "2020",
    },
  ] satisfies Certificate[],
  education: [
    {
      school: "Georgia Tech",
      href: "https://omscs.gatech.edu/",
      detail: "M.S. Computer Science (OMSCS)",
      dates: "2017 — 2019",
      description:
        "Part-time graduate study focused on computing systems and software engineering while working full time.",
    },
    {
      school: "University of Washington",
      href: "https://www.cs.washington.edu/",
      detail: "B.S. Computer Science",
      dates: "2010 — 2014",
      description:
        "Undergraduate foundation in algorithms, systems, and software design. Based in Seattle.",
    },
  ] satisfies EducationItem[],
  contact: [
    {
      label: "Email",
      value: "jon@example.com",
      href: "mailto:jon@example.com",
    },
    {
      label: "X",
      value: "jondoe",
      href: "https://x.com/",
    },
    {
      label: "LinkedIn",
      value: "jondoe",
      href: "https://www.linkedin.com/",
    },
    {
      label: "GitHub",
      value: "jondoe",
      href: "https://github.com/",
    },
  ] satisfies ContactRow[],
} as const
