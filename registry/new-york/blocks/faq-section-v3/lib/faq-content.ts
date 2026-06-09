export type FaqItem = {
  id: string
  question: string
  answer: string
}

export const faqSectionMeta = {
  title: "Got Questions?",
  subtitle: "We've got answers",
}

export const faqItems: FaqItem[] = [
  {
    id: "free-trial",
    question: "Is there a free trial?",
    answer:
      "Yes. Every plan includes a 14-day free trial with no credit card required. You can upgrade, downgrade, or cancel at any time during or after the trial.",
  },
  {
    id: "billing",
    question: "How does billing work?",
    answer:
      "Plans are billed monthly or annually. Annual plans include a 20% discount. You'll receive an invoice by email at the start of each billing cycle.",
  },
  {
    id: "change-plan",
    question: "Can I change my plan later?",
    answer:
      "Yes. You can upgrade or downgrade at any time from your account settings. Upgrades take effect immediately; downgrades apply at the next billing cycle.",
  },
  {
    id: "team-seats",
    question: "How do team seats work?",
    answer:
      "Each seat covers one user. You can add or remove seats at any time and only pay for what you use, prorated to the day.",
  },
  {
    id: "data-security",
    question: "Is my data secure?",
    answer:
      "Yes. All data is encrypted in transit and at rest using AES-256. We are SOC 2 Type II certified and conduct regular third-party security audits.",
  },
  {
    id: "integrations",
    question: "What integrations do you support?",
    answer:
      "We integrate with Slack, Notion, GitHub, Jira, Zapier, and dozens more. You can also connect any tool via our REST API or webhooks.",
  },
  {
    id: "support",
    question: "What kind of support is available?",
    answer:
      "All plans include email and chat support with a 24-hour response time. Pro and Enterprise plans include priority support and a dedicated success manager.",
  },
  {
    id: "cancel",
    question: "Can I cancel at any time?",
    answer:
      "Yes. You can cancel your subscription at any time from your account settings with no cancellation fees. Your access continues until the end of the current billing period.",
  },
]
