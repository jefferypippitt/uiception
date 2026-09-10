/**
 * Edit this file to make the landing page yours. Every string on the
 * page lives here. Brand colors and hero motion live in app/globals.css;
 * registration submit wiring lives in lib/actions.ts.
 */
export const site = {
  name: "Where ideas get built",
  date: "January 1, 2026",
  city: "San Francisco",
  tagline: "48 hours. The best people in the room. One demo.",
  ctaLabel: "Get Your Ticket",
  ctaHref: "/register",
  register: {
    title: "Claim your spot",
    description:
      "A few quick questions so we can put you on the right track.",
    submitLabel: "Get Your Ticket",
    successTitle: "You're in",
    successDescription:
      "Check your inbox for confirmation and next steps.",
    questions: [
      {
        name: "role",
        required: true,
        prompt: "What do you build?",
        description: "Pick whichever one fits best, or write your own.",
        choices: [
          {
            value: "engineer",
            label: "Engineer",
            description: "Frontend, backend, full-stack, or infra.",
          },
          {
            value: "designer",
            label: "Designer",
            description: "Product, brand, or interaction design.",
          },
          {
            value: "founder",
            label: "Founder",
            description: "Ideating, shipping, and recruiting a team.",
          },
        ],
        input: {
          label: "Another role",
          placeholder: "Something else…",
        },
      },
      {
        name: "track",
        required: true,
        prompt: "Which track are you chasing?",
        description: "We’ll use this to group demos and mentors.",
        choices: [
          {
            value: "ai",
            label: "AI / agents",
            description: "Models, tools, and autonomous workflows.",
          },
          {
            value: "product",
            label: "Product",
            description: "Apps, platforms, and shipping experiences.",
          },
          {
            value: "hardware",
            label: "Hardware / IRL",
            description: "Devices, sensors, and physical prototypes.",
          },
          {
            value: "open",
            label: "Open exploration",
            description: "Still deciding? Surprise us.",
          },
        ],
      },
      {
        name: "team",
        required: false,
        prompt: "How are you showing up?",
        description: "Optional. Skip it if you’re not sure yet.",
        choices: [
          { value: "solo", label: "Flying solo" },
          { value: "have-team", label: "I have a team" },
          { value: "looking", label: "Looking for teammates" },
        ],
      },
      {
        name: "contact",
        required: true,
        prompt: "Where should we send your ticket?",
        description: "We’ll only use this for event updates.",
        choices: [],
        input: {
          label: "Email",
          placeholder: "you@company.com",
          type: "email" as const,
        },
      },
    ],
  },
} as const
