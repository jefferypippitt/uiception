export type FaqItem = {
  id: string
  question: string
  answer: string
}

export const faqSectionMeta = {
  title: "Frequently Asked Questions",
  description: "Quick answers about billing, plans, and your account.",
}

export const faqItems: FaqItem[] = [
  {
    id: "free-trial",
    question: "Is there a free trial?",
    answer:
      "Yes. Every plan includes a 14-day free trial with no credit card required. You can upgrade, downgrade, or cancel at any time.",
  },
  {
    id: "billing-cycle",
    question: "How does billing work?",
    answer:
      "Plans are billed monthly or annually. Annual plans include a 20% discount. You'll receive an invoice by email at the start of each cycle.",
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
    id: "refunds",
    question: "What is your refund policy?",
    answer:
      "We offer a full refund within 30 days of your first payment if you're not satisfied. Reach out to support and we'll sort it out, no questions asked.",
  },
]
