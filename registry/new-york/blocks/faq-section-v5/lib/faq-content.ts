export type FaqItem = {
  id: string
  question: string
  answer: string
}

export const faqSectionMeta = {
  title: "Frequently asked questions",
  lastUpdated: "January 1, 2026",
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
    id: "billing-cancel",
    question: "What if I need to cancel or change plans?",
    answer:
      "Upgrade, downgrade, or cancel anytime from billing settings. Changes are prorated, and you keep access through the end of your current billing period.",
  },
]
