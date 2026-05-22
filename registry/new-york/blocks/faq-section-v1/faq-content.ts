export type FaqItem = {
  id: string
  question: string
  answer: string
}

export const faqSectionMeta = {
  title: "Frequently Asked Questions",
  description: "Quick answers about the agent SDK, routing, and getting started.",
}

export const faqItems: FaqItem[] = [
  {
    id: "what-is-sdk",
    question: "What is the AI coding agent SDK?",
    answer:
      "A single SDK to build and deploy coding agents with composable tools and session management.",
  },
  {
    id: "model-routing",
    question: "How does model routing work?",
    answer:
      "Agents pick the right model per task for speed, cost, and quality. You set guardrails; routing runs automatically.",
  },
  {
    id: "codebase-context",
    question: "Can agents work across multiple repos?",
    answer:
      "Yes. Agents can reason across repos, branches, and file trees in one session. Limits depend on your plan.",
  },
  {
    id: "getting-started",
    question: "How do I get started?",
    answer:
      "Install the package, add your API key, and use the playground. Most teams ship a first agent within a day.",
  },
  {
    id: "security",
    question: "How is my code handled?",
    answer:
      "Indexed code stays in your region. We do not train on customer code by default. SSO and audit logs on higher tiers.",
  },
]
