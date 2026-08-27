export type SocialLink = {
  label: string
  href: string
}

export type Project = {
  name: string
  href: string
  description: string
}

export type ExperienceItem = {
  role: string
  company: string
  href: string
  dates: string
  description: string
}

export type EducationItem = {
  school: string
  href: string
  detail: string
  dates: string
}

export type Certificate = {
  name: string
  issuer: string
  href: string
  year: string
}

export type SkillGroup = {
  label: string
  description: string
  items: string[]
}

export type Destination = {
  place: string
  year: string
  note: string
}

export type GlobalEvent = {
  name: string
  where: string
}

export const portfolio = {
  name: "Jon Doe",
  title: "Fullstack Developer",
  promptUser: "jon@portfolio",
  location: "Portland, Oregon",
  email: "jon@example.com",
  tagline: "Welcome to my portfolio. Type a command to look around.",
  about: {
    summary:
      "Hey — I'm Jon. Fullstack developer from Portland, building for AI infrastructure startups and teams shipping real tools with real users.",
    details: [
      "I keep my stack simple, ship in pieces I can trust, and leave software that's easy to maintain.",
      "Outside of work I'm usually cooking the same five meals on repeat, easing back into running after a bad knee, or finishing one more book for the shelf.",
    ],
    hobbies: [
      "Cooking on repeat",
      "Slow-return running",
      "Reading (and finishing) books",
      "Conferences & build nights",
      "Travel when I can steal the time",
    ],
  },
  socials: [
    { label: "X", href: "https://x.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "GitHub", href: "https://github.com/" },
  ] satisfies SocialLink[],
  experience: [
    {
      role: "Senior Full Stack Engineer",
      company: "Cortexa Labs",
      href: "https://www.linkedin.com/",
      dates: "2024 — Present",
      description:
        "Cortexa Labs builds AI infrastructure so teams can train, serve, and ship models in production.",
    },
    {
      role: "Full Stack Engineer",
      company: "Latentworks",
      href: "https://www.linkedin.com/",
      dates: "2021 — 2024",
      description:
        "Latentworks makes tools for machine learning teams — from experiment tracking to deployment pipelines.",
    },
    {
      role: "Software Engineer",
      company: "Synapse Foundry",
      href: "https://www.linkedin.com/",
      dates: "2018 — 2021",
      description:
        "Synapse Foundry is an early-stage platform helping startups turn prototypes into real products.",
    },
    {
      role: "Junior Developer",
      company: "NeuralArc",
      href: "https://www.linkedin.com/",
      dates: "2015 — 2018",
      description:
        "NeuralArc develops software for applied AI research and the teams putting models into practice.",
    },
  ] satisfies ExperienceItem[],
  internships: [
    {
      role: "Software Engineering Intern",
      company: "Cascade Systems",
      href: "https://www.linkedin.com/",
      dates: "Summer 2014",
      description:
        "Cascade Systems builds developer tools for teams shipping cloud-native web applications.",
    },
    {
      role: "Software Engineering Intern",
      company: "Northline Soft",
      href: "https://www.linkedin.com/",
      dates: "Summer 2013",
      description:
        "Northline Soft creates internal platforms that help mid-size companies modernize legacy software.",
    },
  ] satisfies ExperienceItem[],
  projects: [
    {
      name: "Panfry",
      href: "https://github.com/",
      description: "A small recipe box for the meals I actually cook on repeat.",
    },
    {
      name: "Longmile",
      href: "https://github.com/",
      description: "Tracks my slow, patient return to running after a bad knee.",
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
  ] satisfies Project[],
  skills: [
    {
      label: "Frontend",
      description: "User Interface Development",
      items: [
        "Next.js",
        "shadcn/ui",
        "Tailwind CSS",
        "WebGL",
        "Motion",
        "GSAP",
        "magic-ui",
        "Next View Transitions",
        "coss",
        "spline",
        "nuqs",
        "Figma",
      ],
    },
    {
      label: "Backend",
      description: "Server-side Development",
      items: [
        "Vercel",
        "Neon",
        "Drizzle",
        "Prisma",
        "Cloudflare R2",
        "Linux",
        "Vercel Blob",
        "Upstash",
        "ngrok",
        "uploadthing",
        "Supabase",
      ],
    },
    {
      label: "Dev Tools",
      description: "Productivity & Workflow",
      items: [
        "Cursor",
        "v0",
        "Git",
        "GitHub",
        "Vercel",
        "VSCode",
        "Notion",
        "Swift",
        "DaVinci Resolve",
        "Affinity",
      ],
    },
    {
      label: "APIs",
      description: "Integration & Connectivity",
      items: [
        "Better Auth",
        "Arcjet",
        "Vercel AI SDK",
        "DeepSeek",
        "NextAuth",
        "xAI",
        "Resend",
        "Claude",
        "GPT",
        "Clerk",
        "polar.sh",
        "Stripe",
      ],
    },
  ] satisfies SkillGroup[],
  education: [
    {
      school: "Georgia Tech",
      href: "https://omscs.gatech.edu/",
      detail: "M.S. Computer Science (OMSCS)",
      dates: "2017 — 2019",
    },
    {
      school: "University of Washington",
      href: "https://www.cs.washington.edu/",
      detail: "B.S. Computer Science",
      dates: "2010 — 2014",
    },
  ] satisfies EducationItem[],
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
  destinations: [
    {
      place: "Japan",
      year: "2014",
      note: "Tokyo",
    },
    {
      place: "Italy",
      year: "2019",
      note: "Rome",
    },
    {
      place: "Greece",
      year: "2023",
      note: "Athens",
    },
  ] satisfies Destination[],
  events: [
    {
      name: "Vercel Ship 2024",
      where: "New York · May 23, 2024",
    },
    {
      name: "CES 2025 — NVIDIA keynote",
      where: "Las Vegas · Jan 6, 2025",
    },
    {
      name: "Vercel Ship 2025",
      where: "New York · June 25, 2025",
    },
    {
      name: "Compile 26",
      where: "Fort Mason, San Francisco · Jun 22, 2026",
    },
    {
      name: "Grok Bot Founder Build Night",
      where: "Cursor HQ, San Francisco · Aug 20, 2026",
    },
    {
      name: "Cursor Conversations London",
      where: "Central London · Sep 15, 2026",
    },
    {
      name: "Vercel Ship 2026",
      where: "Palace of Fine Arts, San Francisco · Oct 15, 2026",
    },
  ] satisfies GlobalEvent[],
} as const
