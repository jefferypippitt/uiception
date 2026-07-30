export type FaqItem = {
  id: string
  question: string
  answer: string
}

export const faqSectionMeta = {
  eyebrow: "FAQ",
  title: "The questions everyone asks before signing up.",
  description:
    "Everything you need to know about Acme. Can't find what you're looking for?",
  primaryCta: "Get started",
  secondaryCta: "Contact us",
}

export const faqItems: FaqItem[] = [
  {
    id: "getting-started",
    question: "How long does it take to get started?",
    answer:
      "Most teams are up and running in under 10 minutes. Connect your workspace, drop in your knowledge base, and Acme starts answering with your brand voice right away.",
  },
  {
    id: "data-privacy",
    question: "Is my company data used to train models?",
    answer:
      "No. Your prompts, documents, and conversations stay private to your workspace. We never use customer data to train foundation models.",
  },
  {
    id: "integrations",
    question: "Which tools does Acme integrate with?",
    answer:
      "Acme connects with Slack, Notion, Google Drive, Confluence, Zendesk, and more via native integrations or webhooks. You can also bring your own API endpoints.",
  },
  {
    id: "model-choice",
    question: "Can I choose which AI models to use?",
    answer:
      "Yes. Route each workflow to GPT, Claude, Gemini, or your own fine-tuned models. Switch providers anytime without rewriting your prompts.",
  },
  {
    id: "team-collaboration",
    question: "How does team collaboration work?",
    answer:
      "Invite teammates with role-based access, share prompt templates, and review AI outputs together. Admins can set guardrails and approve high-impact actions.",
  },
  {
    id: "billing-cancel",
    question: "What if I need to cancel or change plans?",
    answer:
      "Upgrade, downgrade, or cancel anytime from billing settings. Changes are prorated, and you keep access through the end of your current billing period.",
  },
]
