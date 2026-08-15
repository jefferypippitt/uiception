export type JonEventSegment =
  | { type: "text"; value: string }
  | { type: "link"; value: string; href: string }

export type JonEventCategory = "work" | "college" | "destination"

export type JonEvent =
  | string
  | JonEventSegment[]
  | {
      text: string | JonEventSegment[]
      image?: string
      video?: string
      category?: JonEventCategory
    }

export type JonPerson = {
  name: string
  role?: string
  icon?: string
}

export type JonMilestone = {
  id: string
  events: JonEvent[]
  companies?: { id: string; name: string }[]
  met?: JonPerson[]
}

export const jonDoeMeta = {
  slug: "jon-doe",
  name: "Jon Doe",
  birthYear: 1992,
  endYear: 2026,
  description:
    "Fullstack developer — education, shipped projects, and the rooms where the work happens.",
  legend: [
    { type: "met" as const, label: "Global events" },
    { type: "destination" as const, label: "Destinations" },
    { type: "work" as const, label: "Work" },
    { type: "college" as const, label: "College" },
  ],
}

export const jonDoeMilestones: Record<number, JonMilestone> = {
  1992: {
    id: "born",
    events: ["I was born in Portland, Oregon."],
  },
  2010: {
    id: "university",
    events: [
      {
        text: [
          {
            type: "link",
            value: "University of Washington",
            href: "https://www.cs.washington.edu/",
          },
        ],
        category: "college",
      },
    ],
  },
  2014: {
    id: "japan",
    events: [
      {
        text: "Japan",
        image: "destinations/japan.jpg",
        category: "destination",
      },
    ],
  },
  2015: {
    id: "neuralarc",
    events: [
      {
        text: [
          { type: "text", value: "Joined " },
          {
            type: "link",
            value: "NeuralArc",
            href: "https://www.linkedin.com/",
          },
          { type: "text", value: " as a Junior Developer." },
        ],
        category: "work",
      },
    ],
  },
  2016: {
    id: "panfry",
    events: [
      {
        text: [
          { type: "text", value: "Shipped " },
          {
            type: "link",
            value: "Panfry",
            href: "https://github.com/",
          },
          {
            type: "text",
            value: " — a small recipe box for the meals I actually cook on repeat.",
          },
        ],
        category: "work",
      },
    ],
  },
  2017: {
    id: "omscs-start",
    events: [
      {
        text: [
          {
            type: "link",
            value: "Georgia Tech",
            href: "https://omscs.gatech.edu/",
          },
        ],
        category: "college",
      },
    ],
  },
  2018: {
    id: "synapse",
    events: [
      {
        text: [
          { type: "text", value: "Joined " },
          {
            type: "link",
            value: "Synapse Foundry",
            href: "https://www.linkedin.com/",
          },
          { type: "text", value: " as a Software Engineer." },
        ],
        category: "work",
      },
    ],
  },
  2019: {
    id: "longmile",
    events: [
      {
        text: [
          { type: "text", value: "Shipped " },
          {
            type: "link",
            value: "Longmile",
            href: "https://github.com/",
          },
          {
            type: "text",
            value:
              " — tracks my slow, patient return to running after a bad knee.",
          },
        ],
        category: "work",
      },
      {
        text: "Italy",
        image: "destinations/italy.jpg",
        category: "destination",
      },
    ],
  },
  2021: {
    id: "latentworks",
    events: [
      {
        text: [
          { type: "text", value: "Joined " },
          {
            type: "link",
            value: "Latentworks",
            href: "https://www.linkedin.com/",
          },
          { type: "text", value: " as a Full Stack Engineer." },
        ],
        category: "work",
      },
    ],
  },
  2022: {
    id: "spinebox",
    events: [
      {
        text: [
          { type: "text", value: "Shipped " },
          {
            type: "link",
            value: "Spinebox",
            href: "https://github.com/",
          },
          {
            type: "text",
            value: " — a shelf for the books I have actually finished this year.",
          },
        ],
        category: "work",
      },
    ],
  },
  2023: {
    id: "coinwell",
    events: [
      {
        text: [
          { type: "text", value: "Shipped " },
          {
            type: "link",
            value: "Coinwell",
            href: "https://github.com/",
          },
          {
            type: "text",
            value: " — a simple, honest look at where my money actually goes.",
          },
        ],
        category: "work",
      },
      {
        text: "Greece",
        image: "destinations/greece.jpg",
        category: "destination",
      },
    ],
  },
  2024: {
    id: "vercel-ship-2024",
    events: [
      {
        text: [
          { type: "text", value: "Joined " },
          {
            type: "link",
            value: "Cortexa Labs",
            href: "https://www.linkedin.com/",
          },
          { type: "text", value: " as a Senior Full Stack Engineer." },
        ],
        category: "work",
      },
      {
        text: "Attended Vercel Ship in New York.",
        image: "vercel-ship-2024.png",
      },
    ],
    met: [
      {
        name: "Vercel Ship 2024",
        role: "New York · May 23, 2024",
        icon: "vercel",
      },
    ],
  },
  2025: {
    id: "vercel-ship-2025",
    events: [
      {
        text: "Attended CES 2025 — NVIDIA keynote.",
        video: "ces-2025-nvidia.mkv",
      },
      {
        text: "Attended Vercel Ship 2025 in New York.",
        image: "vercel-ship-2025.png",
      },
    ],
    met: [
      {
        name: "CES 2025 Keynote NVIDIA",
        role: "Las Vegas · Jan 6, 2025",
        icon: "nvidia",
      },
      {
        name: "Vercel Ship 2025",
        role: "New York · June 25, 2025",
        icon: "vercel",
      },
    ],
  },
  2026: {
    id: "today",
    events: [
      {
        text: "Attended Compile 26 — Michael Truell's opening keynote.",
        video: "compile-26.mkv",
      },
    ],
    met: [
      {
        name: "Compile 26",
        role: "Fort Mason, San Francisco · Jun 22, 2026",
        icon: "cursor",
      },
      {
        name: "Grok Bot Founder Build Night",
        role: "Cursor HQ, San Francisco · Aug 20, 2026",
        icon: "cursor",
      },
      {
        name: "Cursor Conversations London",
        role: "Central London · Sep 15, 2026",
        icon: "cursor",
      },
      {
        name: "Vercel Ship 2026",
        role: "Palace of Fine Arts, San Francisco · Oct 15, 2026",
        icon: "vercel",
      },
    ],
  },
}
